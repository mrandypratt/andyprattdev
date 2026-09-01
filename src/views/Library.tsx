import {
  CSSProperties,
  TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Book, BOOKS } from "../data/books";
import "../styles/Library.css";

const BOOKS_PER_SHELF = 6;
const SHELF_NUMERALS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

/* ---------- Shelf order ----------
   Sorting rearranges the running order and nothing else: spine color, height,
   and width are all keyed to a book's index in BOOKS, so a book carries the
   same spine wherever it lands and the case doesn't repaint on every sort. */
type SortKey = "rating" | "title" | "author";

const SORT_OPTIONS: {
  key: SortKey;
  label: string;
  up: string;
  down: string;
}[] = [
  { key: "rating", label: "Rating", up: "lowest first", down: "highest first" },
  { key: "title", label: "Title", up: "A to Z", down: "Z to A" },
  { key: "author", label: "Author", up: "A to Z", down: "Z to A" },
];

/* The direction each key opens in: best books first, but names A to Z. */
const SORT_OPENS_DESCENDING: Record<SortKey, boolean> = {
  rating: true,
  title: false,
  author: false,
};

/* Ascending comparators; descending is the same order negated. Title breaks
   every tie, so the shelf is stable however it's arranged. Author sorts on the
   name as written — no first/last parsing. */
const compareAscending = (key: SortKey) => (a: Book, b: Book) => {
  if (key === "rating")
    return a.rating - b.rating || a.title.localeCompare(b.title);
  if (key === "author")
    return a.author.localeCompare(b.author) || a.title.localeCompare(b.title);
  return a.title.localeCompare(b.title);
};

/* Below this width the catalog card stops being a pinned column and becomes a
   bottom sheet over the shelf. Must stay in sync with Library.css. */
const COMPACT_QUERY = "(max-width: 899px)";

/* ---------- Swipe, on the bottom sheet only ----------
   Left for the next book, right for the previous, down to reshelve — the same
   three moves the arrows and Reshelve already offer, minus the aiming. */
const SWIPE_SLOP = 12; /* travel before a drag commits to an axis */
const SWIPE_COMMIT = 60; /* travel that reads as a swipe rather than a nudge */
const SWIPE_RESIST = 0.3; /* dragging past either end of the shelf goes nowhere fast */
const SWIPE_SLIDE_MS = 165; /* the card leaving; the one arriving matches it */
const SWIPE_DROP_MS = 200; /* the card falling back to the shelf, or settling home */

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

/* Base dimensions in px — the decorative variation that keeps the shelf from
   looking like a barcode. Library.css scales these down on small screens via
   the --spine-h / --spine-w custom properties. A book is never shorter than
   this, but spineFit below will make it taller when its title needs the room. */
const SPINE_HEIGHTS = [
  188, 168, 202, 162, 182, 196, 172, 206, 178, 194, 166, 190,
];
const SPINE_WIDTHS = [42, 36, 48, 34, 40, 44, 38, 46, 36, 42, 35, 47];

/* Spine lettering runs the length of the book, so a title physically has to fit
   between the two gilded bands or it gets clipped. These mirror Library.css:
   18px of padding above the text plus a 20px reserve below it, and roughly
   6.5px of run per character at the base 0.7rem Roboto with 0.06em tracking. */
const TITLE_PX_PER_CHAR = 6.5;
const TITLE_CLEARANCE = 38;
/* The per-character figure is an average, so a title of unusually wide letters
   would run long. This keeps every one off the edge of its reserve. */
const TITLE_SLACK = 6;
/* Past this a long title would leave the book towering over its neighbors, so
   the lettering shrinks instead — which is what a real spine does. */
const TALLEST_SPINE = 238;
const SMALLEST_TITLE_SCALE = 0.78;

/* Height and lettering scale for one spine. Grows the book to fit its title,
   then shrinks the lettering for the handful too long to solve with height. */
const spineFit = (title: string, index: number) => {
  const run = title.length * TITLE_PX_PER_CHAR;
  const titleScale = Math.max(
    SMALLEST_TITLE_SCALE,
    Math.min(1, (TALLEST_SPINE - TITLE_CLEARANCE - TITLE_SLACK) / run),
  );
  return {
    height: Math.max(
      SPINE_HEIGHTS[index % SPINE_HEIGHTS.length],
      Math.ceil(run * titleScale + TITLE_CLEARANCE + TITLE_SLACK),
    ),
    titleScale,
  };
};

const NO_TAKE_YET =
  "I haven't written this one up yet — the rating stands on its own for now.";

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
  const [isCompact, setIsCompact] = useState(
    () => window.matchMedia(COMPACT_QUERY).matches,
  );
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [descending, setDescending] = useState(SORT_OPENS_DESCENDING.rating);
  const spineRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const browseRef = useRef<HTMLDivElement | null>(null);
  const rankRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const cardBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const query = window.matchMedia(COMPACT_QUERY);
    const handleChange = (event: MediaQueryListEvent) =>
      setIsCompact(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  /* Shelf order as indices into BOOKS, so `selected` stays a stable book id and
     a re-sort keeps the open card open rather than jumping to another book. */
  const order = useMemo(() => {
    const compare = compareAscending(sortKey);
    return BOOKS.map((_, index) => index).sort((a, b) => {
      const result = compare(BOOKS[a], BOOKS[b]);
      return descending ? -result : result;
    });
  }, [sortKey, descending]);

  /* Same control for both jobs: a new key opens in its natural direction, the
     key already in use flips. */
  const selectSort = (key: SortKey) => {
    if (key === sortKey) {
      setDescending((current) => !current);
    } else {
      setSortKey(key);
      setDescending(SORT_OPENS_DESCENDING[key]);
    }
  };

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
    [selected],
  );

  /* Walk the shelf in place, in whatever order it's currently sorted into.
     Stops at the ends rather than wrapping so the controls can disable
     themselves and the position stays obvious. */
  const step = useCallback(
    (delta: number) => {
      setSelected((current) => {
        if (current === null) return current;
        const next = order.indexOf(current) + delta;
        return next < 0 || next >= order.length ? current : order[next];
      });
    },
    [order],
  );

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
          "button:not([disabled])",
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (
          event.shiftKey &&
          (active === first || active === cardRef.current)
        ) {
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
      if (
        browseRef.current?.contains(target) ||
        rankRef.current?.contains(target)
      )
        return;
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
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
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

  const shelfCount = Math.ceil(order.length / BOOKS_PER_SHELF);
  const shelves = Array.from({ length: shelfCount }, (_, shelfIndex) =>
    order.slice(
      shelfIndex * BOOKS_PER_SHELF,
      (shelfIndex + 1) * BOOKS_PER_SHELF,
    ),
  );

  /* Where the open book sits on the shelf as sorted — drives the card number
     and the ends of the arrow walk. */
  const shelfPosition = selected === null ? -1 : order.indexOf(selected);

  const ranked = BOOKS.map((book, index) => ({ book, index })).sort(
    (a, b) => b.book.rating - a.book.rating,
  );

  const openBook = selected === null ? null : BOOKS[selected];

  /* ---------- Swipe plumbing ----------
     A drag updates every frame, so it drives the sheet's transform straight on
     the node and keeps out of React state. The open animation uses fill-mode:
     both, which would outrank an inline transform for the life of the sheet —
     clearing it here hands control over the moment a finger lands. */
  const moveSheet = useCallback(
    (transform: string, ms: number, flush = false) => {
      const node = cardRef.current;
      if (!node) return;
      node.style.animation = "none";
      node.style.transition =
        ms > 0 ? `transform ${ms}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none";
      node.style.transform = transform;
      /* Commit the untransitioned position before the next call transitions away
       from it, or the two collapse into one and nothing animates. */
      if (flush) void node.offsetHeight;
    },
    [],
  );

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* True while the sheet is animating itself — a second gesture mid-flight
     would fight the one already running. */
  const sliding = useRef(false);
  const swipe = useRef({
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    axis: "",
    live: false,
  });

  /* Walk to a neighbour: the open card leaves in the direction of the swipe and
     the next one comes in from the other side. */
  const slideTo = useCallback(
    (delta: number) => {
      if (reducedMotion()) {
        step(delta);
        moveSheet("translate3d(0, 0, 0)", 0);
        return;
      }
      sliding.current = true;
      moveSheet(
        `translate3d(${delta > 0 ? "-104%" : "104%"}, 0, 0)`,
        SWIPE_SLIDE_MS,
      );
      window.setTimeout(() => {
        step(delta);
        moveSheet(
          `translate3d(${delta > 0 ? "104%" : "-104%"}, 0, 0)`,
          0,
          true,
        );
        moveSheet("translate3d(0, 0, 0)", SWIPE_SLIDE_MS);
        sliding.current = false;
      }, SWIPE_SLIDE_MS);
    },
    [moveSheet, step],
  );

  // Drop the sheet off the bottom of the screen, then reshelve the book.
  const slideAway = useCallback(() => {
    if (reducedMotion()) {
      closeCard(false);
      return;
    }
    sliding.current = true;
    moveSheet("translate3d(0, 110%, 0)", SWIPE_DROP_MS);
    window.setTimeout(() => {
      sliding.current = false;
      closeCard(false);
    }, SWIPE_DROP_MS - 20);
  }, [closeCard, moveSheet]);

  // A sheet that closed mid-flight leaves its flags behind; clear them.
  useEffect(() => {
    if (isOverlay) return;
    sliding.current = false;
    swipe.current.live = false;
  }, [isOverlay]);

  const handleTouchStart = (event: ReactTouchEvent<HTMLElement>) => {
    if (!isOverlay || sliding.current || event.touches.length !== 1) return;
    const touch = event.touches[0];
    swipe.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      dx: 0,
      dy: 0,
      axis: "",
      live: true,
    };
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLElement>) => {
    const gesture = swipe.current;
    if (!gesture.live || event.touches.length !== 1) return;
    const touch = event.touches[0];
    gesture.dx = touch.clientX - gesture.startX;
    gesture.dy = touch.clientY - gesture.startY;

    if (!gesture.axis) {
      if (
        Math.abs(gesture.dx) < SWIPE_SLOP &&
        Math.abs(gesture.dy) < SWIPE_SLOP
      )
        return;
      if (Math.abs(gesture.dx) > Math.abs(gesture.dy)) {
        gesture.axis = "x";
      } else if (gesture.dy > 0 && (cardBodyRef.current?.scrollTop ?? 0) <= 0) {
        gesture.axis = "y";
      } else {
        /* Upward, or downward from partway into a long take: that drag belongs
           to the body's own scroll, so let go of it entirely. */
        gesture.live = false;
        return;
      }
    }

    if (gesture.axis === "x") {
      const atEnd =
        gesture.dx < 0 ? shelfPosition >= order.length - 1 : shelfPosition <= 0;
      moveSheet(
        `translate3d(${atEnd ? gesture.dx * SWIPE_RESIST : gesture.dx}px, 0, 0)`,
        0,
      );
    } else {
      moveSheet(`translate3d(0, ${Math.max(0, gesture.dy)}px, 0)`, 0);
    }
  };

  const handleTouchEnd = () => {
    const gesture = swipe.current;
    if (!gesture.live) return;
    gesture.live = false;

    if (gesture.axis === "x" && Math.abs(gesture.dx) >= SWIPE_COMMIT) {
      const delta = gesture.dx < 0 ? 1 : -1; // the card travels with the finger
      const next = shelfPosition + delta;
      if (next >= 0 && next < order.length) {
        slideTo(delta);
        return;
      }
    }
    if (gesture.axis === "y" && gesture.dy >= SWIPE_COMMIT) {
      slideAway();
      return;
    }
    if (gesture.axis) moveSheet("translate3d(0, 0, 0)", SWIPE_DROP_MS);
  };

  const handleTouchCancel = () => {
    if (!swipe.current.live) return;
    swipe.current.live = false;
    moveSheet("translate3d(0, 0, 0)", SWIPE_DROP_MS);
  };

  return (
    <div className="library-container">
      <Navbar />

      <main className="library-main">
        <header className="library-intro">
          <p className="library-eyebrow">The Library</p>
          <h1 className="library-title">
            The books that have{" "}
            <span className="library-title-accent">shaped me.</span>
          </h1>
          <p className="library-lede">
            Seeing a person's shelf is a peek into their minds. Browse away and
            see what's been on mine along with my takeaways. Full ranked list at
            the bottom.
          </p>
        </header>

        <div className="library-browse" ref={browseRef}>
          <section
            className="library-shelf-column"
            aria-labelledby="library-shelf-heading"
          >
            <h2 id="library-shelf-heading" className="library-visually-hidden">
              The shelf
            </h2>

            <div
              className="library-sort"
              role="group"
              aria-label="Sort the shelf"
            >
              <span className="library-sort-label">Sort</span>
              {SORT_OPTIONS.map(({ key, label, up, down }) => {
                const isActive = sortKey === key;
                const isDescending = isActive
                  ? descending
                  : SORT_OPENS_DESCENDING[key];
                return (
                  <button
                    type="button"
                    key={key}
                    className={`library-sort-option${
                      isActive ? " library-sort-option-active" : ""
                    }`}
                    onClick={() => selectSort(key)}
                    aria-pressed={isActive}
                    aria-label={`Sort by ${label.toLowerCase()}, ${isDescending ? down : up}`}
                  >
                    {label}
                    <span className="library-sort-caret" aria-hidden="true">
                      {isDescending ? "\u25BE" : "\u25B4"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="library-bookcase">
              {shelves.map((shelf, shelfIndex) => (
                <div className="library-shelf" key={shelfIndex}>
                  <div className="library-books">
                    {shelf.map((index) => {
                      const book = BOOKS[index];
                      const color = SPINE_COLORS[index % SPINE_COLORS.length];
                      const fit = spineFit(book.title, index);
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
                              "--spine-h": `${fit.height}px`,
                              "--spine-w": `${SPINE_WIDTHS[index % SPINE_WIDTHS.length]}px`,
                              "--spine-title-scale": fit.titleScale,
                            } as CSSProperties
                          }
                          aria-label={`${book.title} by ${book.author}, rated ${book.rating} out of 10`}
                          aria-pressed={isSelected}
                          onClick={() => setSelected(isSelected ? null : index)}
                        >
                          <span className="library-spine-title">
                            {book.title}
                          </span>
                          <span className="library-tip" aria-hidden="true">
                            <span className="library-tip-title">
                              {book.title}
                            </span>
                            <span className="library-tip-author">
                              {book.author}
                            </span>
                            <span className="library-tip-score">
                              {book.rating} / 10
                            </span>
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

          <div
            className={`library-card-column${isOverlay ? " library-card-overlay" : ""}`}
          >
            {isOverlay && (
              <div
                className="library-card-scrim"
                onClick={() => closeCard(false)}
              />
            )}

            {openBook && selected !== null ? (
              <article
                className="library-card"
                ref={cardRef}
                tabIndex={-1}
                aria-live="polite"
                role={isOverlay ? "dialog" : undefined}
                aria-modal={isOverlay || undefined}
                aria-label={
                  isOverlay ? `${openBook.title} — catalog card` : undefined
                }
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
              >
                {isOverlay && (
                  <span className="library-card-handle" aria-hidden="true" />
                )}

                <div className="library-card-head">
                  <span className="library-card-number">
                    Card N&ordm; {String(shelfPosition + 1).padStart(2, "0")}
                    <span className="library-card-of"> of {BOOKS.length}</span>
                  </span>

                  <div className="library-card-controls">
                    <button
                      type="button"
                      className="library-card-step"
                      onClick={() => step(-1)}
                      disabled={shelfPosition === 0}
                      aria-label="Previous book"
                    >
                      &larr;
                    </button>
                    <button
                      type="button"
                      className="library-card-step"
                      onClick={() => step(1)}
                      disabled={shelfPosition === order.length - 1}
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

                {isOverlay && (
                  <p className="library-card-swipe-hint" aria-hidden="true">
                    Swipe to browse &middot; pull down to reshelve
                  </p>
                )}

                {/* Everything below the head scrolls; the head — and so the
                    arrows and Reshelve — stays put at a fixed sheet height. */}
                <div className="library-card-body" ref={cardBodyRef}>
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
                      <span className="library-stamp-score">
                        {openBook.rating}/10
                      </span>
                      <span className="library-stamp-date">
                        {openBook.finished}
                      </span>
                    </div>
                  </div>

                  <div className="library-card-take">
                    <span className="library-card-take-label">The take</span>
                    <p
                      className={
                        openBook.take ? undefined : "library-card-take-empty"
                      }
                    >
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
                  Click any spine and its catalog card opens here. Then walk the
                  shelf with the arrows or your &larr; and &rarr; keys, and
                  press Esc to reshelve.
                </p>
              </div>
            )}
          </div>
        </div>

        <section
          className="library-block"
          aria-labelledby="library-ranking-heading"
        >
          <p className="library-eyebrow">Best to worst</p>
          <h2 id="library-ranking-heading" className="library-block-header">
            The ranking
          </h2>
          <p className="library-block-sub">
            The whole shelf, in order. Ten means I bought copies for other
            people. Three means I finished it out of spite.
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
                <span className="library-rank-num">
                  {String(position + 1).padStart(2, "0")}
                </span>
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
