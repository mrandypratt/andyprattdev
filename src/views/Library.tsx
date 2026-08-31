import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { BOOKS } from "../data/books";
import "../styles/Library.css";

const BOOKS_PER_SHELF = 6;
const SHELF_NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

/* Below this width the catalog card stops being a pinned column and becomes a
   bottom sheet over the shelf. Must stay in sync with Library.css. */
const COMPACT_QUERY = "(max-width: 899px)";

/* Spine palette — bg/fg pairs. Dark spines take light lettering and vice versa. */
const SPINE_COLORS = [
  { bg: "#7E3231", fg: "#F0E4D2" }, // oxblood
  { bg: "#33475E", fg: "#EAF1F7" }, // navy
  { bg: "#56673D", fg: "#EFEDD9" }, // moss
  { bg: "#B98F3E", fg: "#2A2313" }, // mustard
  { bg: "#A25B3C", fg: "#F5E7D8" }, // clay
  { bg: "#3A3A3F", fg: "#E8E4DA" }, // charcoal
  { bg: "#2F5D5A", fg: "#E2F0EC" }, // teal
  { bg: "#5C3A56", fg: "#F0E2ED" }, // plum
];

/* Base dimensions in px. Library.css scales these down on small screens via
   the --spine-h / --spine-w custom properties. */
const SPINE_HEIGHTS = [188, 168, 202, 162, 182, 196, 172, 206, 178, 194, 166, 190];
const SPINE_WIDTHS = [42, 36, 48, 34, 40, 44, 38, 46, 36, 42, 35, 47];

const NO_TAKE_YET = "I haven't written this one up yet — the rating stands on its own for now.";

type MeterProps = { rating: number; tone: "paper" | "dark" };

const Meter = ({ rating, tone }: MeterProps) => (
  <span className={`library-meter library-meter-${tone}`} aria-hidden="true">
    {Array.from({ length: 10 }, (_, index) => {
      const dot = index + 1;
      let fill = "";
      if (dot <= Math.floor(rating)) {
        fill = " library-meter-dot-on";
      } else if (dot === Math.ceil(rating) && rating % 1 !== 0) {
        fill = " library-meter-dot-half";
      }
      return <i key={dot} className={`library-meter-dot${fill}`} />;
    })}
  </span>
);

export const Library = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isCompact, setIsCompact] = useState(() => window.matchMedia(COMPACT_QUERY).matches);
  const spineRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const browseRef = useRef<HTMLDivElement | null>(null);
  const rankRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const query = window.matchMedia(COMPACT_QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsCompact(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  /* On narrow screens the card is a modal bottom sheet — there is no room to
     put it beside the shelf, and scrolling down to it was the whole problem. */
  const isOverlay = isCompact && selected !== null;

  const closeCard = useCallback(
    (returnFocus: boolean) => {
      if (returnFocus && selected !== null) {
        spineRefs.current[selected]?.focus({ preventScroll: true });
      }
      setSelected(null);
    },
    [selected]
  );

  /* Walk the shelf in place. Stops at the ends rather than wrapping so the
     controls can disable themselves and the position stays obvious. */
  const step = useCallback((delta: number) => {
    setSelected((current) => {
      if (current === null) return current;
      const next = current + delta;
      return next < 0 || next >= BOOKS.length ? current : next;
    });
  }, []);

  // Escape reshelves; left/right walk the shelf while a card is open.
  useEffect(() => {
    if (selected === null) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCard(true);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "Tab" && isOverlay) {
        // The sheet is modal, so keep Tab from wandering behind the scrim.
        const focusable = cardRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled])"
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || active === cardRef.current)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [selected, closeCard, step, isOverlay]);

  // Clicking away from the shelf, the card, or the ranking puts the book back.
  useEffect(() => {
    if (selected === null) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (browseRef.current?.contains(target) || rankRef.current?.contains(target)) return;
      closeCard(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [selected, closeCard]);

  /* Only move the page when the card would otherwise be invisible. The card is
     pinned beside the shelf on desktop and overlaid on mobile, so browsing never
     scrolls; this is the fallback for in-between widths and ranking jumps. */
  useEffect(() => {
    if (selected === null || isCompact || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const navHeight = 72;
    const onScreen = rect.bottom > navHeight && rect.top < window.innerHeight;
    if (onScreen) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cardRef.current.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }, [selected, isCompact]);

  // Hold the page still behind the sheet.
  useEffect(() => {
    if (!isOverlay) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOverlay]);

  // Hand focus to the sheet when it opens so Esc and the arrows are live.
  useEffect(() => {
    if (!isOverlay) return;
    cardRef.current?.focus({ preventScroll: true });
  }, [isOverlay]);

  const shelfCount = Math.ceil(BOOKS.length / BOOKS_PER_SHELF);
  const shelves = Array.from({ length: shelfCount }, (_, shelfIndex) =>
    BOOKS.map((book, index) => ({ book, index })).filter(
      ({ index }) => Math.floor(index / BOOKS_PER_SHELF) === shelfIndex
    )
  );

  const ranked = BOOKS.map((book, index) => ({ book, index })).sort(
    (a, b) => b.book.rating - a.book.rating
  );

  const openBook = selected === null ? null : BOOKS[selected];

  return (
    <div className="library-container">
      <Navbar />

      <main className="library-main">
        <header className="library-intro">
          <p className="library-eyebrow">The Library</p>
          <h1 className="library-title">
            Every book I've finished, <span className="library-title-accent">shelved and scored.</span>
          </h1>
          <p className="library-lede">
            Reading is where most of my thinking starts. Hover a spine for a peek, pull one down for
            the full take, or skip to the ranking. Everything is scored out of ten — no cowardly
            sevens across the board.
          </p>
        </header>

        <div className="library-browse" ref={browseRef}>
          <section className="library-shelf-column" aria-labelledby="library-shelf-heading">
            <h2 id="library-shelf-heading" className="library-visually-hidden">
              The shelf
            </h2>

            <div className="library-bookcase">
              {shelves.map((shelf, shelfIndex) => (
                <div className="library-shelf" key={shelfIndex}>
                  <div className="library-books">
                    {shelf.map(({ book, index }) => {
                      const color = SPINE_COLORS[index % SPINE_COLORS.length];
                      const isSelected = selected === index;
                      return (
                        <button
                          type="button"
                          key={book.title}
                          ref={(node) => {
                            spineRefs.current[index] = node;
                          }}
                          className={`library-spine${isSelected ? " library-spine-selected" : ""}`}
                          style={
                            {
                              background: `linear-gradient(90deg, rgba(0,0,0,0.20), rgba(255,255,255,0.07) 30%, rgba(0,0,0,0.14)), ${color.bg}`,
                              color: color.fg,
                              "--spine-h": `${SPINE_HEIGHTS[index % SPINE_HEIGHTS.length]}px`,
                              "--spine-w": `${SPINE_WIDTHS[index % SPINE_WIDTHS.length]}px`,
                            } as CSSProperties
                          }
                          aria-label={`${book.title} by ${book.author}, rated ${book.rating} out of 10`}
                          aria-pressed={isSelected}
                          onClick={() => setSelected(isSelected ? null : index)}
                        >
                          <span className="library-spine-title">{book.title}</span>
                          <span className="library-tip" aria-hidden="true">
                            <span className="library-tip-title">{book.title}</span>
                            <span className="library-tip-author">{book.author}</span>
                            <span className="library-tip-score">{book.rating} / 10</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="library-plank">
                    <span className="library-plaque">
                      Shelf {SHELF_NUMERALS[shelfIndex] ?? shelfIndex + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="library-shelf-hint">Tap a spine to pull its card</p>
          </section>

          <div className={`library-card-column${isOverlay ? " library-card-overlay" : ""}`}>
            {isOverlay && (
              <div className="library-card-scrim" onClick={() => closeCard(false)} />
            )}

            {openBook && selected !== null ? (
              <article
                className="library-card"
                ref={cardRef}
                tabIndex={-1}
                aria-live="polite"
                role={isOverlay ? "dialog" : undefined}
                aria-modal={isOverlay || undefined}
                aria-label={isOverlay ? `${openBook.title} — catalog card` : undefined}
              >
                {isOverlay && <span className="library-card-handle" aria-hidden="true" />}

                <div className="library-card-head">
                  <span className="library-card-number">
                    Card N&ordm; {String(selected + 1).padStart(2, "0")}
                    <span className="library-card-of"> of {BOOKS.length}</span>
                  </span>

                  <div className="library-card-controls">
                    <button
                      type="button"
                      className="library-card-step"
                      onClick={() => step(-1)}
                      disabled={selected === 0}
                      aria-label="Previous book"
                    >
                      &larr;
                    </button>
                    <button
                      type="button"
                      className="library-card-step"
                      onClick={() => step(1)}
                      disabled={selected === BOOKS.length - 1}
                      aria-label="Next book"
                    >
                      &rarr;
                    </button>
                    <button
                      type="button"
                      className="library-reshelve"
                      onClick={() => closeCard(true)}
                    >
                      Reshelve &#8617;
                    </button>
                  </div>
                </div>

                {/* Everything below the head scrolls; the head — and so the
                    arrows and Reshelve — stays put at a fixed sheet height. */}
                <div className="library-card-body">
                  <div className="library-card-main">
                    <div className="library-card-identity">
                      <h3 className="library-card-title">{openBook.title}</h3>
                      <p className="library-card-author">{openBook.author}</p>
                      <div className="library-card-meta">
                        <span>
                          Finished <b>{openBook.finished}</b>
                        </span>
                        <span className="library-card-meta-score">
                          Score <Meter rating={openBook.rating} tone="paper" />
                        </span>
                      </div>
                    </div>

                    <div
                      className="library-stamp"
                      aria-label={`Rated ${openBook.rating} out of 10`}
                    >
                      <span className="library-stamp-score">{openBook.rating}/10</span>
                      <span className="library-stamp-date">{openBook.finished}</span>
                    </div>
                  </div>

                  <div className="library-card-take">
                    <span className="library-card-take-label">The take</span>
                    <p className={openBook.take ? undefined : "library-card-take-empty"}>
                      {openBook.take ?? NO_TAKE_YET}
                    </p>
                  </div>

                  <div className="library-card-hole" />
                </div>
              </article>
            ) : (
              <div className="library-card-resting" aria-hidden="true">
                <p className="library-card-resting-title">Pull a book down</p>
                <p className="library-card-resting-copy">
                  Click any spine and its catalog card opens here. Then walk the shelf with the
                  arrows or your &larr; and &rarr; keys, and press Esc to reshelve.
                </p>
              </div>
            )}
          </div>
        </div>

        <section className="library-block" aria-labelledby="library-ranking-heading">
          <p className="library-eyebrow">Best to worst</p>
          <h2 id="library-ranking-heading" className="library-block-header">
            The ranking
          </h2>
          <p className="library-block-sub">
            The whole shelf, in order. Ten means I bought copies for other people. Three means I
            finished it out of spite.
          </p>

          <div className="library-rank-list" ref={rankRef}>
            {ranked.map(({ book, index }, position) => (
              <button
                type="button"
                key={book.title}
                className={`library-rank-row${
                  selected === index ? " library-rank-row-selected" : ""
                }`}
                onClick={() => setSelected(selected === index ? null : index)}
                aria-pressed={selected === index}
              >
                <span className="library-rank-num">{String(position + 1).padStart(2, "0")}</span>
                <span className="library-rank-body">
                  <span className="library-rank-title">{book.title}</span>
                  <span className="library-rank-author">{book.author}</span>
                </span>
                <span className="library-rank-score">
                  <Meter rating={book.rating} tone="dark" />
                  <span className="library-rank-value">{book.rating}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
