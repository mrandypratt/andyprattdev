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
    finished: "2021",
    take: "My favorite book of all time: history, technology, biology, human nature, and wonder are all tied together in this audacious and sweeping tour of how information and the ability for humans to communicate that information have shaped the technology and society of today. The narrative style flows smoothly between topics and chapters that makes the density of the concepts easy to digest. Truly a mind-opening book and a must-read for engineers, especially in software. I would love to see a new chapter on AI if you’re reading, James!",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    rating: 9.5,
    finished: "2020",
    take: "The first book that opened my up to the style of grand, sweeping accounts of human history to put the abundance and absurdity of society and modern life into perspective. Harari rides the exponential curve of humanity from evolving cognition, to harnessing agriculture, to science and industry. He encapsulates the evolution and adaptation that lead to modern humans with a cohesive narrative and an great taste for thought-proving illustrative details and a sense of both appreciation and skepticism for the path that led us to modern day. A must read for humans.",
  },
  {
    title: "How the World Really Works",
    author: "Vaclav Smil",
    rating: 8.5,
    finished: "2026",
    take: "The first book to truly cut through the rhetoric around energy and climate change in a way that endorses neither narrative. Smil simply quantifies and demonstrates the sheer dependence on oil our human population requires and what challenges we face trying to reduce that dependence. He sizes up the scope and scale of global energy supply chain through concrete, steel, plastic, and ammonia and the oil-soaked process that creates and distributes these foundational building blocks. The unfortunate truth is shown that clean energy in the way society expresses is much more complicated due to our reliance on these elements and their respective reliance on petroleum products; a lasting clean energy source will require significant ingenuity and understanding of the limitations we face.",
  },
  {
    title: "The Fountainhead",
    author: "Ayn Rand",
    rating: 4,
    finished: "2010",
    take: "Reading this in high school was my first real exposure to what it means to live in a capitalist society, and I found it captivating at the time. Rand, coming from a communist country and having watched that experiment fail before seeing the United States, makes a powerful case for individualism, capitalism, and the incentives that make them work. It doesn't rate higher because she is notoriously verbose in scene-setting, violent and aggressive in her portrayal of love, and only highlights the benefits of capitalism with religious fervor and no regard to nuance. This book could be half as long and do more justice to its central point, but it was transformative when I read it and still is today.",
  },
  {
    title: "Guns, Germs, and Steel",
    author: "Jared Diamond",
    rating: 4,
    finished: "2023",
    take: "I was only able to get through a quarter of the book. This book has a ton of really eye-opening perspective into how the advantage of getting the technology of weapons and ships set the stage for colonists to wreak havoc on unsuspecting civilizations shaping the world order. As someone who is more interested in concepts and “ah-ha” moments, I found the density of details pedantic and difficult-to-follow to the point that the effort outweighed the payoff. I would certainly read a version that was about a quarter of the specificity and a more relaxed narrative style.",
  },
  {
    title: "Atlas Shrugged",
    author: "Ayn Rand",
    rating: 2,
    finished: "2014",
    take: "I loved Fountainhead in high school and wanted to dive deeper in college. I found this book to be even less succinct than the Fountainhead but the story, narrative, and themes to be trite and unappealing. I somehow plowed thought the industrial pursuit of the protagonists to the point where they reach the utopian mountain city where Rand goes on a literal 100-page rant about the splendor of capitalism. Hard work can create meaning, but Rand was struggling to do so herself in her 1000 page opus, resulting in a book that delivered her main thesis so poorly that it actively worked to the contrary of her intent.",
  },
  {
    title: "Becoming Supernatural",
    author: "Joe Dispenza",
    rating: 3.5,
    finished: "2019",
    take: "This book had a profound impact on the way I view meditation, manifestation, and mindfulness. The ideas that resonated most: humans can become addicted to emotional states the same way we can to activities or substances, adopting a new state of being is to some degree a choice, and meditation and yoga are genuinely transformative in realizing one’s own complicity and potential influence regarding their emotional regulation. I'd rate it much higher if it didn't wrap all of that in a tone of scientific rigor that doesn't hold up, both from reading the book and from researching the author, whose credentials are highly questionable. There are better books to get the same information without the quasi-science mumbo jumbo, but lots of gems in here.",
  },
  {
    title: "Abundance",
    author: "Derek Thompson and Ezra Klein",
    rating: 8,
    finished: "2024",
    take: "It’s refreshing to see a book on politics that is thoroughly researched and cited, and why would I expect anything less after listening to the Ezra Klein podcast. This book came at a time of disappointment for the American Left and offered us a narrative to understand why, from the perspective of an American liberal, how the Democrats failed in policy implementation and coalition building while supporting the case with papers and history. After the retrospective, the authors try to paint a better picture for the future and how to learn from the mistakes of the past. No small feat, and although not complete, it was a noble and well-delivered effort.",
  },
  {
    title: "Why We Sleep",
    author: "Matthew Walker",
    rating: 7.5,
    finished: "2024",
    take: "It’s a wonder I ever finished this book. I do most of my reading to transition into sleep, and there is no better book to help with that than one that enumerates the countless benefits of sleep. All the information in the book _should_ be intuitive, but the author’s dive into the mechanism and physiological benefits of sleep are both informative and a great reminder that we cannot be at our best if we aren’t getting our rest!",
  },
  {
    title: "The Artist’s Way",
    author: "Julia Cameron",
    rating: 6.5,
    finished: "2018",
    take: "This is a cult classic for artists and creatives of all walks. The underlying philosophy is inspired by and retread in many other books, but Cameron’s implementation resonates well. Don’t bother reading the book unless you’re ready to put in the work of morning pages and artist dates. There is a lot of truth and value in this book, perhaps I should give it a second pass one day.",
  },
  {
    title: "Big Magic",
    author: "Elizabeth Gilbert",
    rating: 3.5,
    finished: "2024",
    take: "Gilbert’s perspective is fanciful and full of gems, even if they are a little esoteric. I found a lot of the frameworks she espouses to be useful, even if not provable. The though that ideas are entities of their own are reminiscent of the Self Gene’s perspective on memes and genes as using humans. She does justice to the everyday person to remind them of the joy of creativity and gives them tools to overcome fear when approaching creative pursuits.",
  },
  {
    title: "The 4-Hour Workweek",
    author: "Tim Ferriss",
    rating: 4,
    finished: "2016",
    take: "I listened to this audiobook when I was an unhappy accountant and the promise of such a life of ease and luxury was quite alluring. The principles of making your work scale and buying back one’s time is a tried-and-true self-help angle. There is a lot of truth in Tim’s perspective, as is apparent in his prolific podcast career, but the advice here is to be taken as a framework and the details are to be discovered by the reader. This book did pioneer the idea of digital nomadism for the modern generation and is influential, even if I feel the principles in this book are better stated elsewhere.",
  },
  {
    title: "Be Here Now",
    author: "Ram Dass",
    rating: 5,
    finished: "2019",
    take: "Ram Dass is a fascinating character and his story from academic researcher to eastern philosophy guru is both entertaining and insightful. Echoes of the same are found in the lectures of Alan Watts, stories from Sam Harris, and of course a large swath of self-help books reminding people to let go and take life less seriously. It’s a good book for people who want to follow a man’s search for meaning and mindfulness through the exploration of psychedelics and eastern philosophy concepts like meditation and yoga, but there are better books if you want to learn Eastern Philosophy, meditation, yoga, or psychdelics for that matter.",
  },
  {
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    rating: 9,
    finished: "2025",
    take: "No book has ever given me the profound emotional impact, respect for the trauma of humanity, and number of tears as this book. The culmination of decades of clinical and social work, van der Kolk puts into perspective how trauma manifests from the most harrowing situations to the seemingly mundane. The pervasiveness of abuse, violence, and trauma are quantified which makes the reader realize that many everyday people are carrying the weight of broken homes and broken spirits every day. The subconscious nature outlined for how trauma responses manifest incites uneasiness, but thankfully van der Kolk comes with data, heart-warming stories of recovery, and scientifically researched methods for overcoming trauma. Come with an open heart, open mind, and a full box of tissues.",
  },
  {
    title: "The Omnivore’s Dilemma",
    author: "Michael Pollan",
    rating: 8.5,
    finished: "2026",
    take: "Very few authors (perhaps Bill Bryson as the only exception) can create such tantalizing prose when crafting a narrative around an otherwise unappealing topic as our industrial food system. Pollan’s natural curiosity and literary prowess combine with well-researched details and a first-person dive into food. The book dives into the industrial food system leaving no stone unturned, then explores more “natural” alternatives like regenerative farming. Every step of the journey, you feel like you’re sitting alongside Pollan seeing what he sees, listening to his fascinating anecdotes, and soaking in his well-curated blend of historical insight, thought-provoking questions, and humor along theway.",
  },
  {
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    rating: 6.5,
    finished: "2012",
    take: "This is the quintessential book for learning how to deal with people in business and in life. This book has stood the test of time because at the core it sees people as collaborative. Although the perspective is perhaps more tit for tat than we would like to think of ourselves, there is a good deal of truth that trying to find ways that what you want benefits other people will always end up with better results. The same book could be written in a way that feels manipulative (see 48 Laws of Power) but in this case the tone is good natured and really about finding the best for everyone involved. Very transformative book at the time I read it.",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki and Sharon Lechter",
    rating: 1,
    finished: "2016",
    take: "How can I encapsulate how morally bankrupt and empty of a perspective this book touts. The author offers basic financial concepts like assets and balance sheets, but packages them in a narrative that is conniving and underhanded. Most people progress over time through investing in themselves: that can be their skillset, education, creativity, or entrepreneurial dream. This book tells it’s readers if you aren’t the latter, you’re a loser and you’ll be broke. It’s clear this book was written by someone who only cares about money and will sell people the promise of a fast-fix and self-superiority to get it. There are FAR better books about personal finance and how to think about financial abundance.",
  },
  {
    title: "Think & Grow Rich",
    author: "Napoleon Hill",
    rating: 3,
    finished: "2020",
    take: "There is insight in this book, but Hill just took himself a bit too seriously, with a bit of a tone indicative of someone who wants to cement themselves as the upper echelon of society. The underlying mechanisms of positive affirmations leading to positive results, surrounding yourself with people that can influence you positively, and articulating the goals in your life all make sense but something about the way this book was written made it feel very stuffy and unappealing. Would make a better worksheet than a book.",
  },
  {
    title: "48 Laws of Power",
    author: "Robert Greene",
    rating: 1,
    finished: "2016",
    take: "I've never made it all the way through this book despite trying numerous times. The information in this book makes sense logically if all you want is to pillage and profit or protect yourself from someone who does. I know people I respect who have gotten value out of this book, but I personally find myself disgusted every time I read the paranoid and power-hungry perspective Greene puts forth.",
  },
  {
    title: "Mastery",
    author: "George Leonard",
    rating: 6,
    finished: "2020",
    take: "I read this book when I joined Launch School to learn programming in JavaScript. The boot camp was self-paced and required reading of this book to set the tone for the course. At the time I had struggled to maintain consistency and direction, and this book was pivotal in framing how sustained effort over time can manifest. I know there are plenty of books that discuss the topic of habits and small efforts accumulating over time but for some reason this one really resonated. Highly recommend.",
  },
  {
    title: "A Promised Land",
    author: "Barack Obama",
    rating: 6,
    finished: "2022",
    take: "I listened to the audiobook version of this for at least the first quarter of the book although I didn't finish it and I see things from his presidency that fall short of his values, this book humanized the ex-president and gives a peek behind the curtain of the messy world of politics. Barack Obama has a way with words that is unparalleled. He has a way of recounting things so that even if you don't agree with his decision on a matter, you feel like every decision was thoroughly contemplated.",
  },
  {
    title: "Dreams from My Father",
    author: "Barack Obama",
    rating: 7.5,
    finished: "2021",
    take: "The book of Barack Obama before he was president and one that served to boost him to contention for the role is such a fantastic read. Few people have such unique stories from growing up in Hawaii, having biracial parents from Kenya and Kansas, spending formative years in Indonesia, and becoming an intellectual social organizer in Chicago’s South Side. Obama’s gift for crafting nuanced narratives was present early on and seeing the man before the figure serves to humanize and intrigue.",
  },
  {
    title: "Nonviolent Communication",
    author: "Marshall B. Rosenberg",
    rating: 7,
    finished: "2026",
    take: "I listened to about a third of this audio book and got a great deal of gems. The ability to speak in “I” statements and speak to the emotions that one feels is critical for any worth my all long-term relationship but also serves well on many occasions. This book gives the tools to be able to talk about conflict in a way that lowers defenses and creates the opportunity for both the speaker and the listener to feel seen and heard.",
  },
  {
    title: "The Coming Wave",
    author: "Michael Bhaskar and Mustafa Suleyman",
    rating: 7.5,
    finished: "2026",
    take: "The Coming Wave takes the form of my favorite style of book: a sweeping look at history through the lens of the book's relevant subject. In this case the lens is technological revolutions and the proliferation of technology in service of understanding the current wave of artificial intelligence and to understand the most likely scenarios and challenges that we will face. The authors do seem to hold some amount of dissonance between the inescapability of AI proliferation while also advocating for trying to slow things down. The historical context and the technical insights at a high level are very useful and interesting to learn.",
  },
  {
    title: "Outlive",
    author: "Peter Attia",
    rating: 7,
    finished: "2024",
    take: "Peter Attia has become a controversial figure as of late but the principles in this book are very straightforwardly good. Peter acknowledges the current medical institutions as being able to treat acute illness while criticizing it not focusing on the foundations of health. The medicines in Attia’s pharmacy are exercise, diet, sleep, and mental health. Attia can get in the weeds with specifics, but for a longevity nerd that’s what you want. The book certainly could have been shorter, but it provides a great framework for undertsanding the biggest silent chronic killers and how to keep them at bay for as long as we can.",
  },
  {
    title: "Designing Data Intensive Applications",
    author: "Martin Kleppmann",
    rating: 7,
    finished: "2024",
    take: "I’ve read over half of this book and as someone who came into software engineering from a non-conventional background, I found it incredibly helpful for covering the core concepts of data storage, access, reliability, and transformation. The topics are structured in a natural way to lead into one another, but if you can easily thumb to your topic of choice and dive right in.",
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    rating: 5.5,
    finished: "2022",
    take: "Eric Ries evangelized some of the most fundamental startup philosophy present in many product teams today: MVPs, product market fit, user driven development, and agile. The company Eric founded is quite interesting, an online community where people interact as avatars. This book is very insightful for anyone looking for a framework to think about product leadership and entrepreneurship, but the advice can certainly be distilled to be a bit more concise and it’s primarily focused on digital products.",
  },
  {
    title: "Quick Start Guide to LLMs",
    author: "Sinan Ozdemir",
    rating: 8.5,
    finished: "2024",
    take: "This book was on my Christmas list in 2023, and I was halfway through before the return to work. This book is both practical and informative with examples to work along the way to demonstrate and practice, but reads just like a intro guide to the world of LLMs. If you are interested in understanding the language around LLMs, what they are, how they work, and how to use them to encode meaning into search or tools, this book still holds up. This book really met the moment for me and even though larger, smarter models and Agentic AI are changing the application of these tools, I think this book still has a lot of value for grounding in the fundamentals.",
  },
  {
    title: "What Is Real?",
    author: "Adam Becker",
    rating: 6,
    finished: "2025",
    take: "Science has a reputation for being rigorous, and it is once it has decided where to point that rigor. The journey from quantum physics over a century from curiosity to taboo and back again is a long winding road, perhaps as complicated as quantum mechanics itself. The story is truly fascinating and not what I expected when I found the book at a book shop, but there did come a point where I grew weary of keeping up with who is who, what papers they wrote, and with whom they were academically beefing. For the other non-fiction readers, this book is more about the biographical aspects of quantum discovery not “Quantum for Dummies”.",
  },
  {
    title: "Homo Deus",
    author: "Yuval Noah Harari",
    rating: 4.5,
    finished: "2022",
    take: "In his second book, Harari attempts to hit a home run with the ball so wonderfully teed up with Sapiens and ends up with a ground rule double. If Sapiens explains how humans got here, Homo Deus casts that lens into the future. The book is a really fascinating exercise in imagining where a world with AI and robotics will take us with a keen eye for pitfalls we may fall into along the way. The biggest weakness of this book is that the narrative falls into an odd space where predictions are often far in the future but presented with caution that indicates more urgency. The conflict between the tones of techno-optimism and alarmism seem a bit disjointed and are my main reasons for not recommending more highly.",
  },
  {
    title: "Nexus",
    author: "Yuval Noah Harari",
    rating: 6.5,
    finished: "2025",
    take: "Harari’s book about information would have really connected had I not already read “The Information” years prior. Harari’s perspective is distinct despite overlapping concepts with Gleick: his focus is less on the technology but on the tangible societal impact of those in control of the technology. From the gatekeepers of Bible writing and curating to modern century political regimes, we get a classic Harari broad-and-deep-dive, albeit not as dazzling as Sapiens. Of course, Harari ties this into AI as has been his preoccupation since Homo Deus",
  },
  {
    title: "A Walk in the Woods",
    author: "Bill Bryson",
    rating: 7.5,
    finished: "2025",
    take: "Bill Bryson has a penchant for making everything he talks about dryly funny and interesting. A Walk in the Woods is pure entertainment value buddy-comedy of two guys hiking the Appalachian Trail with curiosity, profundities, and wholesome moments sprinkled throughout Bryson’s signature narrative wit and humor. ",
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    rating: 7.5,
    finished: "2025",
    take: "Okay, please don’t hate me, I read half and still gave it 7.5. I saw the movie before the book and I really loved the book but got distracted. Weir’s style resonates deeply with a non-fiction reader’s desire to understand how and why, while also catering to the core elements of all novels that keep a story, its characters, and its plot interesting. The stakes are high and so is the IQ of both the author and the protagonist to come us with this space-faring, survival story and live through it, respectively.",
  },
  {
    title: "Understanding Power",
    author: "Noam Chomsky",
    rating: 7.5,
    finished: "2024",
    take: "Few political writers are as well-cited as Noam Chomsky, both in the books he has written and the books being written referencing him. This book is the tour of his greatest lectures that give a lens into his view about most topics. Chomsky can be quite bleak, as he is able to sniff out the hypocrisy in just about any person or institution, especially the United States and it’s leaders. His background in linguistics and foray into Vietnam War activism led him to start calling out propaganda campaigns the US used to avoid accountability and drum up support for proxy wars against public interest. From there came an unbridled and articulate series of prolific lectures and books, all researched and specific, eviscerating and condemning all the abuses of power he could find, and he found plenty. Reader Beware: you may not like what you find out.",
  },
  {
    title: "Who Rules the World?",
    author: "Noam Chomsky",
    rating: 6.5,
    finished: "2024",
    take: "In who rules the world, Chomsky dissects how the US takes advantage of it’s position of global power to enforce rules on the world whilst blatantly refusing to apply the same rules to itself and key allies. As with all Chomsky content, we are reminded of the influence of the wealthy business class, the use of propaganda to influence public perception at home and abroad, and disconnect between the stated values of democracy and the methods through which power is wielded.",
  },
  {
    title: "Elon Musk",
    author: "Ashlee Vance",
    rating: 6,
    finished: "2019",
    take: "When a figure becomes as successful, powerful, and divisive as Elon, the propaganda machine will be steadily working to craft or destroy a prevailing narrative. Regardless of whether the book is propaganda or whether you agree with his choices, it’s hard not to find his story fascinating. He is without a doubt one of the most influential humans in history, for better or worse. The details of his childhood relationship with his father and the kids around him growing up explain a lot about his present day flaws, even if they don’t always excuse them. To parlay that situation to end up at PayPal mafia is impressive, but the high-risk play of rolling that into Tesla against the odds, then the ultra-high-risk decision to put it all on the line for SpaceX is one of the gutsiest series of decisions on record.",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    rating: 5.5,
    finished: "2018",
    take: "This rating is a little unfair, because this is such an influential book and the ideas at the core of the book are very interesting. It’s just a dense read, that even a non-fiction guy like me could only make it halfway through. The concepts of the two parts of the brain for thinking and reacting was powerful and thoroughly explored and allows readers to be able to observe their own behavior in a new light. I learned that my brain sometimes lies to me when it’s convenient to store energy and we are really not that reliable when push comes to shove. I can try to try to have the right heuristics and biases to be the exception, but even that is likely just overconfidence.",
  },
];

export type WantToRead = {
  title: string;
  author: string;
  /** First publication year of the edition I'm after. */
  year: string;
  /** One line on why it's queued — the hook, not a summary. */
  why: string;
};

/* =========================================================
   THE QUEUE — books I haven't read yet, so they get no
   spine and no rating. Order here is display order.
   ========================================================= */
export const WANT_TO_READ: WantToRead[] = [
  {
    title: "A Brief History of Intelligence",
    author: "Max S. Bennett",
    year: "2023",
    why: "The type of grand sweeping book I love applied to the technology I find most fascinating makes an easy next pick.",
  },
  {
    title: "Co-Intelligence: Living and Working with AI",
    author: "Ethan Mollick",
    year: "2024",
    why: "A book to give a framework on how to think about working with Models as collaborators.",
  },
  {
    title: "The Structure of Scientific Revolutions",
    author: "Thomas S. Kuhn",
    year: "1962",
    why: 'Said to be timeless, I\'m curious how the book that defined "paradigm shift" applies to today.',
  },
  {
    title: "Chaos: Making a New Science",
    author: "James Gleick",
    year: "1987",
    why: "Gleick's precursor to The Information highlighting the unpredictability of deterministic systems.",
  },
  {
    title: "Thinking in Systems",
    author: "Donella H. Meadows",
    year: "2008",
    why: "I love thinking about the behaviors of systems and scale and this book keeps popping up on my recommendations.",
  },
  {
    title: "Factfulness",
    author: "Hans Rosling",
    year: "2018",
    why: "Evidence backed reasons that the world isn't awful sounds like the antidote to the AI wave and Chomsky",
  },
  {
    title: "Seeing Like a State",
    author: "James C. Scott",
    year: "1998",
    why: "I've seen successes and failures of large institutions, so diving into the mechanisms of how govenment plans fail seems relevant.",
  },
  {
    title: "The Inner Game of Tennis",
    author: "W. Timothy Gallwey",
    year: "1974",
    why: "This book has been recommended by people who play tennis competitively and even many who don't. Learning how to harness the self-critic is a universal good.",
  },
  {
    title: "The Master Switch",
    author: "Tim Wu",
    year: "2010",
    why: "Learn how information technology starts open and ends consolidated would apply well to today's AI landscape.",
  },
  {
    title: "Lifespan",
    author: "David A. Sinclair",
    year: "2019",
    why: "I have no delusions about cheating death, but a book about how aging works seems helpful to live a healthy life.",
  },
  {
    title: "Debt: The First 5,000 Years",
    author: "David Graeber",
    year: "2014",
    why: "I understand this book to be Sapiens through the lens of how the modern financial system came to be.",
  },
  {
    title: "Manufacturing Consent",
    author: "Edward S. Herman and Noam Chomsky",
    year: "1988",
    why: "Chomsky's perspecives on power are predicated on his work in this book, it would be interesting to deep-dive on how narratives shape society.",
  },
  {
    title: "Who Is Government?",
    author: "Edited by Michael Lewis",
    year: "2025",
    why: "I like Michael Lewis, and I've always wanted to peek behind the curtain of bureaucracy to learn about how government works.",
  },
  {
    title: "Breath",
    author: "James Nestor",
    year: "2020",
    why: "A tactical guide to one of the most universal tools.  I loved the book on sleep and books on meditation, this seems like a natural compliment.",
  },
  {
    title: "Salt, Fat, Acid, Heat",
    author: "Samin Nosrat",
    year: "2017",
    why: "A framework for deliciousness, count me in!",
  },
];
