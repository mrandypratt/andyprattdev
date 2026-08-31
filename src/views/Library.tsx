import { useCallback, useEffect, useRef, useState } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { BOOKS } from "../data/books";
import "../styles/Library.css";

const BOOKS_PER_SHELF = 6;
const SHELF_NUMERALS = ["I", "II", "III", "IV", "V", "VI"];

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
  const spineRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const cardRef = useRef<HTMLElement | null>(null);

  const closeCard = useCallback(() => {
    setSelected((current) => {
      if (current !== null) {
        spineRefs.current[current]?.focus();
      }
      return null;
    });
  }, []);

  // Escape reshelves the open card.
  useEffect(() => {
    if (selected === null) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCard();
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [selected, closeCard]);

  // Pull the card into view when a spine is picked.
  useEffect(() => {
    if (selected === null || !cardRef.current) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cardRef.current.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
    });
  }, [selected]);

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

        <section className="library-shelf-section" aria-labelledby="library-shelf-heading">
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
                        style={{
                          background: `linear-gradient(90deg, rgba(0,0,0,0.20), rgba(255,255,255,0.07) 30%, rgba(0,0,0,0.14)), ${color.bg}`,
                          color: color.fg,
                          width: SPINE_WIDTHS[index % SPINE_WIDTHS.length],
                          height: SPINE_HEIGHTS[index % SPINE_HEIGHTS.length],
                        }}
                        aria-label={`${book.title} by ${book.author}, rated ${book.rating} out of 10. Open the card.`}
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

          <p className="library-shelf-hint">Click a spine to pull the card</p>
        </section>

        {openBook && selected !== null && (
          <section className="library-card-section">
            <article className="library-card" ref={cardRef} aria-live="polite">
              <div className="library-card-head">
                <span>
                  Andy&rsquo;s Library &mdash; Card N&ordm;{" "}
                  {String(selected + 1).padStart(2, "0")}
                </span>
                <button type="button" className="library-reshelve" onClick={closeCard}>
                  Reshelve &#8617;
                </button>
              </div>

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

                <div className="library-stamp" aria-label={`Rated ${openBook.rating} out of 10`}>
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
            </article>
          </section>
        )}

        <section className="library-block" aria-labelledby="library-ranking-heading">
          <p className="library-eyebrow">Best to worst</p>
          <h2 id="library-ranking-heading" className="library-block-header">
            The ranking
          </h2>
          <p className="library-block-sub">
            The whole shelf, in order. Ten means I bought copies for other people. Three means I
            finished it out of spite.
          </p>

          <div className="library-rank-list">
            {ranked.map(({ book, index }, position) => (
              <button
                type="button"
                key={book.title}
                className="library-rank-row"
                onClick={() => setSelected(index)}
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
