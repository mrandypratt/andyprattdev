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

const PhotoFrame = ({ src, alt, caption, placeholderLabel }: PhotoFrameProps) => (
  <figure className="about-photo">
    {src ? (
      <img className="about-photo-img" src={src} alt={alt} loading="lazy" />
    ) : (
      <div className="about-photo-placeholder" aria-label={alt}>
        <span className="about-photo-placeholder-label">{placeholderLabel}</span>
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
            The projects page is where I show the work. This page is everything else — how
            I got here, what pulls me back to the keyboard, and what I'm doing when I'm
            not at one.
          </p>
        </header>

        <section className="about-chapter">
          <h2 className="about-chapter-header">How I got here</h2>
          <div className="about-chapter-body">
            <p>
              I didn't grow up writing code. Through college and the years after, I
              worked in fine-dining steakhouses — long nights, fast feedback, a lot of
              people. By day I was building an accounting career: the kind of work that
              rewards structure, patience, and an eye for systems that are almost
              working.
            </p>
            <p>
              The shift to software came sideways. Accounting meant spreadsheets, and
              spreadsheets meant repetition. I started writing macros, then small Python
              scripts to handle the things Excel couldn't. The first time I opened a
              real code editor was August 2020. The puzzle-shaped problems I'd been
              chasing in accounting — break a system down, find the leverage point,
              build the tool — turned out to be the job description for software
              engineers.
            </p>
            <p>I've been chasing that thread ever since.</p>
          </div>
        </section>

        <section className="about-chapter">
          <h2 className="about-chapter-header">What pulls me toward software</h2>
          <div className="about-chapter-body">
            <p>
              Three things, mostly. The feedback loop — you write something, run it,
              and find out in seconds whether you were right. The leverage — a good
              piece of code does the same job a thousand times without complaint. And
              the fact that the learning curve never really flattens; every new project
              hands me something I didn't know I was missing.
            </p>
            <p>
              These days, that curiosity is pointed squarely at AI: how it changes the
              way engineers build, what it doesn't change, and where it earns its keep
              in real systems.
            </p>
          </div>
        </section>

        <section className="about-chapter">
          <h2 className="about-chapter-header">Outside of work</h2>
          <p className="about-chapter-intro">
            Tennis, travel, and a fiancée who's a much better photographer than I am.
          </p>

          <div className="about-photo-grid">
            <PhotoFrame
              src={tennisFloridaPhoto}
              alt="Andy at a tennis tournament in Florida"
              caption="A tennis tournament in Florida — tennis has been a constant for years."
              placeholderLabel="Tennis · Florida"
            />
            <PhotoFrame
              src={pacificNorthwestPhoto}
              alt="Pacific Northwest trip"
              caption="Pacific Northwest — driving the coast from San Francisco up to Seattle."
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
              caption="And again from Denver — same idea, very different mountains."
              placeholderLabel="Denver"
            />
            <PhotoFrame
              src={switzerlandPhoto}
              alt="Engagement in Switzerland"
              caption="Got engaged in the Swiss Alps."
              placeholderLabel="Switzerland"
            />
            <PhotoFrame
              src={northeastPhoto}
              alt="Northeast trip — Boston and Maine"
              caption="The Northeast — Boston, then up the Maine coast for lighthouses and lobster rolls."
              placeholderLabel="Boston · Maine"
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
