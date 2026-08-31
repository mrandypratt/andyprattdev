import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import "../styles/About.css";

// Photo imports — files live in src/assets/about/ (see spec at the bottom of About.css).
import tennisFloridaPhoto from "../assets/about/tennis-florida.jpg";
import pacificNorthwestPhoto from "../assets/about/pacific-northwest.jpg";
import chicagoPhoto from "../assets/about/chicago.jpg";
import denverPhoto from "../assets/about/denver.jpg";
import switzerlandPhoto from "../assets/about/switzerland.jpg";
import northeastPhoto from "../assets/about/northeast.jpg";

type PhotoFrameProps = {
  src?: string;
  alt: string;
  caption: string;
  placeholderLabel: string;
};

const PhotoFrame = ({
  src,
  alt,
  caption,
  placeholderLabel,
}: PhotoFrameProps) => (
  <figure className="about-photo">
    {src ? (
      <img className="about-photo-img" src={src} alt={alt} loading="lazy" />
    ) : (
      <div className="about-photo-placeholder" aria-label={alt}>
        <span className="about-photo-placeholder-label">
          {placeholderLabel}
        </span>
      </div>
    )}
    <figcaption className="about-photo-caption">{caption}</figcaption>
  </figure>
);

export const About = () => {
  return (
    <div className="about-container">
      <Navbar />

      <main className="about-main">
        <header className="about-intro">
          <h1 className="about-title">A little about me.</h1>
          <p className="about-lede">
            I make my living at the keyboard, but I don't do all my living
            there.
          </p>
        </header>

        <section className="about-chapter">
          <h2 className="about-chapter-header">How I got here</h2>
          <div className="about-chapter-body">
            <p>
              I didn't grow up writing code. Through college and the years
              after, I spent my days building an accounting career and my nights
              working in fine-dining restaurants and steakhouses. I've had a
              great deal of passion for people, hard work, and learning
              throughout my life which I was able to channel through these
              avenues, but after a few years I felt the itch for something more.
            </p>
            <p>
              My path to software was paved through hard work, determination,
              and the will to try something new in the face of life's
              challenges. Accounting is riddled with tedious and often manual
              processes. I started with small Python and VBA scripts to handle
              the things Excel couldn't, which eventually led me down a 3 year
              journey to learn computer science, programming, and software
              development. After building a few apps for myself and leaning on a
              couple of very important mentors, I was able to finally break into
              a role in softward.
            </p>
            <p>And as the old saying goes, "The rest is history."</p>
          </div>
        </section>

        <section className="about-chapter">
          <h2 className="about-chapter-header">Why software?</h2>
          <div className="about-chapter-body">
            <p>
              I've always had a penchant for going deep to understand things
              that capture my seemingly insatiable curiosity. Software is
              crystallized intelligence and data is the raw material for
              understanding. When I discovered that I could use my brain to
              understand a problem and build a solution to handle it, I knew I
              was chasing the right dream. I love the flow state of programming,
              going deep on trade-offs, and the sense of satisfaction when a
              program works.
            </p>
            <p>
              Now with the advent of LLMs and agentic development I feel equally
              drawn on the quest to understand and harness the power of AI to
              build better quality software and ship more quickly while. Harness
              engineering become an increasingly important part of software
              engineering in order to improve velocity while not sacrificing
              quality and security. I love finding optimizations that allow me
              to explore the meta-process of software development to open doors
              that were previously locked by the limitations of the human brain
              alone.
            </p>
          </div>
        </section>

        <section className="about-chapter">
          <h2 className="about-chapter-header">Outside of work</h2>
          <p className="about-chapter-intro">
            Tennis, travel, and a fiancée who always expands my horizons.
          </p>

          <div className="about-photo-grid">
            <PhotoFrame
              src={tennisFloridaPhoto}
              alt="Andy at a tennis tournament in Florida"
              caption="Tennis tournament at Crandon Park in Key Biscayne, FL"
              placeholderLabel="Tennis in Florida"
            />
            <PhotoFrame
              src={pacificNorthwestPhoto}
              alt="Pacific Northwest trip"
              caption="Pacific Northwest road trip from San Francisco up to Seattle."
              placeholderLabel="Pacific Northwest"
            />
            <PhotoFrame
              src={chicagoPhoto}
              alt="Remote work stint in Chicago"
              caption="Two months working remote from Chicago."
              placeholderLabel="Chicago"
            />
            <PhotoFrame
              src={denverPhoto}
              alt="Remote work stint in Denver"
              caption="And two months in Denver."
              placeholderLabel="Denver"
            />
            <PhotoFrame
              src={switzerlandPhoto}
              alt="Engagement in Switzerland"
              caption="Proposed to the love of my life in the Swiss Alps."
              placeholderLabel="Switzerland"
            />
            <PhotoFrame
              src={northeastPhoto}
              alt="Northeast trip — Boston and Maine"
              caption="Northeast Coast road trip from Boston up to Maine for boat rides and lobster rolls."
              placeholderLabel="Boston & Maine"
            />
          </div>
        </section>

        <section className="about-chapter">
          <h2 className="about-chapter-header">A few other things</h2>
          <ul className="about-list">
            <li>Tennis, fitness, hiking.</li>
            <li>Podcasts: Lex Fridman, Tim Ferriss, Andrew Huberman.</li>
            <li>Board games and video games.</li>
            <li>Live music and stand-up.</li>
          </ul>
          <p className="about-outro">
            That's most of it. If you want to see the work, the{" "}
            <a className="about-link" href="/projects">
              projects page
            </a>{" "}
            is the other half of this site.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};
