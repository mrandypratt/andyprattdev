export type Book = {
  title: string;
  author: string;
  /** 0–10, halves allowed. Drives the ranking, the stamp, and the meter. */
  rating: number;
  /** Free text — when I finished it. Shows on the card and the stamp. */
  finished: string;
  /** My review. Leave it off until it's written; the card says so. */
  take?: string;
};

/* =========================================================
   THE SHELF — every book on /library comes from this array.
   Order here is shelf order (left to right, top shelf down).
   The ranking section sorts by rating on its own.
   Spine color, height, and width are assigned automatically.
   ========================================================= */
export const BOOKS: Book[] = [
  {
    title: "The Information",
    author: "James Gleick",
    rating: 10,
    finished: "Jan 2026",
    take:
      "Gleick condenses hundreds of generations of the evolution of humanity's ability to transfer information in a way that is both thorough and succinct in its premise. The book strikes a perfect balance for me: enough density of technical elements to learn from, enough narrative and biographical elements to be relatable, and it ties everything together to the central theme of information in a way that is truly mind-opening for a first-time reader.",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    rating: 9.5,
    finished: "Dec 2025",
    take:
      "Harari synthesizes the human journey in a way that is educational, fascinating, and relevant to today. It is not an exercise in history for history's sake — it builds a narrative for the story of humanity that perfectly sets up the tee he swings on in Homo Deus.",
  },
  { title: "Chaos", author: "James Gleick", rating: 9, finished: "Nov 2025" },
  { title: "Thinking in Systems", author: "Donella Meadows", rating: 9, finished: "Sep 2025" },
  { title: "Scale", author: "Geoffrey West", rating: 8, finished: "Jul 2025" },
  { title: "Gödel, Escher, Bach", author: "Douglas Hofstadter", rating: 8, finished: "May 2025" },
  {
    title: "How the World Really Works",
    author: "Vaclav Smil",
    rating: 8,
    finished: "Mar 2025",
    take:
      "The first book to truly cut through the rhetoric around energy and climate change in a way that endorses neither narrative — it simply quantifies and demonstrates the sheer dependence on oil our society has created, and how challenging, and in what specific ways it is challenging, to overcome that. A naive read says Smil advocates against climate policy; the mature read is that he is setting the standard any solution must uphold to support human life at its current energy output.",
  },
  {
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    rating: 5.5,
    finished: "Feb 2025",
    take:
      "I like the idea of this book more than the reality. The way it sprawls through human history is the thing I loved about Sapiens and The Information, but the delivery gets too specific about the where, the why, the who, and the what, rather than the concepts — which those other books did better.",
  },
  { title: "The Mythical Man-Month", author: "Fred Brooks", rating: 7, finished: "Jan 2025" },
  { title: "Energy and Civilization", author: "Vaclav Smil", rating: 7, finished: "Nov 2024" },
  { title: "The Design of Everyday Things", author: "Don Norman", rating: 7, finished: "Aug 2024" },
  {
    title: "The Fountainhead",
    author: "Ayn Rand",
    rating: 6.5,
    finished: "High school",
    take:
      "Reading this in high school was my first real exposure to what it means to live in a capitalist society. Rand, coming from a communist country and having watched that experiment fail before seeing the United States, makes a powerful case for individualism, capitalism, and the incentives that make them work. It doesn't rate higher because she is notoriously verbose in scene-setting, and the way the love interests are portrayed is controversial enough to distract from the value of the story. This book could be half as long and do more justice to its central point — but it was transformative when I read it, and still is today.",
  },
  {
    title: "Atlas Shrugged",
    author: "Ayn Rand",
    rating: 4,
    finished: "Feb 2024",
    take:
      "I read this after The Fountainhead, and early on it does expand on Rand's ideals in ways the first book didn't. But the second half becomes almost masturbatory — it's very clear that Rand enjoys writing more than she enjoys crafting a good story.",
  },
  { title: "Antifragile", author: "Nassim Taleb", rating: 6, finished: "Jun 2024" },
  { title: "Atomic Habits", author: "James Clear", rating: 5, finished: "Mar 2024" },
  {
    title: "Becoming Supernatural",
    author: "Joe Dispenza",
    rating: 4,
    finished: "May 2024",
    take:
      "This book had a profound impact on the way I view meditation, manifestation, and mindfulness. The ideas that resonated most: humans can become addicted to emotional states the same way we can to activities or substances, adopting a new state of being is — to some degree — a choice, and meditation and yoga are genuinely transformative. I'd rate it much higher if it didn't wrap all of that in a tone of scientific rigor that doesn't hold up, both from reading the book and from researching the author, whose credentials are highly questionable.",
  },
  { title: "Who Moved My Cheese?", author: "Spencer Johnson", rating: 3, finished: "Jan 2024" },
];
