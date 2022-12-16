import { codeSnippets } from "../../components/CodeSnippets";
const V1Mockup = require("../../assets/Project/V1/V1-Mockup.png");

export const Version1 = () => {
  return (
    <div className="version-wrapper">
      <h2 className="version-header" id="version-1">
        Version 1: MVP (Single-Client)
      </h2>

      <h3 className="section-header" id="version-1-tools">
        Tools Used
      </h3>

      <ul>
        <li>Canva</li>
        <li>Miro</li>
        <li>React</li>
        <li>Material UI</li>
        <li>GoDaddy</li>
        <li>AWS S3 Bucket</li>
      </ul>

      <h3 className="section-header" id="version-1-version-goals">
        Version Goals
      </h3>
      <p className="portfolio-content">
        The vision of the product at Version 1 was to create a Proof-of-Concept or Minimum Viable Product (MVP) for a Cards Against Humanity party game optimized for in-person play with friends.
      </p>
      <p className="portfolio-content">
        As a one-man team, it was important to keep the goals as concise and focused as possible. My goal was to figure out the bare minimum necessary to create a functional game with a simple and clean interface.
      </p>

      <h3 className="section-header" id="version-1-identifying-problems">
        Identifying Problems
      </h3>
      <p className="portfolio-content">
        The first problem was needing to have a structured approach to creating this product. I came up with the following steps:
      </p>

      <ol>
        <li>Gain a thorough understanding of the gameplay by mapping out all the logical steps.</li>
        <li>Create a visual representation of the game at each step in a wire-frame.</li>
        <li>Decide what technologies could help me build and deploy the product.</li>
        <li>Build, test, and deploy.</li>
      </ol>

      <p className="portfolio-content">
        To know what to build, I wanted to hone in on the constraints. 
        In-person optimization worked as a useful constraint, as it allowed me to only build for a single device and avoided the complexity of building a networked architecture.
        For V1, I would focus purely on building an interface, creating a Game Engine, and getting the site live on the internet.
        With these constraints in mind, it was time to start thinking about the experience.
      </p>

      <h3 className="section-header" id="version-1-understanding-problems">
        Understanding the Problems
      </h3>
      <p className="portfolio-content">
      I started by dictating the logical steps of the game over and over, each time trimming down the length of the explanation until something relatively concise emerged, which became the following:
      </p>
      <h4 className="section-header-2">
        PseudoCode
      </h4>
      <ul>
        <li>Three or more Participants decide to play</li>
        <li>Game Begins</li>
        <ul>
          <li>A prompt card is pulled from the deck</li>
          <li>A hand of Response Cards are dealt to all participants</li>
          <li>One player is assigned the role of Judge</li>
          <li>Non-judge participants are Players</li>
          <li>Players select a Response Card from their hand</li>
          <li>When all Players have selected, the Judge’s turn begins</li>
          <li>Judge selects from the Response Cards submitted by Players</li>
          <li>The Player who submitted the Response Card selected by the Judge wins round</li>
        </ul>
        <li>Game Repeats</li>
      </ul>
      <p className="portfolio-content">
        Now with some pseudo-code, I could start putting together visuals to represent the states and actions.
      </p>

      <h3 className="section-header" id="version-1-ux-mockup">
        Mapping out the Experience
      </h3>

      <p className="portfolio-content">
        From a UX perspective, I wanted to ensure that users could:
      </p>

      <ul>
        <li>Select a variable number of players.</li>
        <li>Keep track of who is who.</li>
        <li>Know where they are in the gameplay.</li>
        <li>View and Select cards while keeping them hidden from other players.</li>
        <li>Be sure that a card was properly selected.</li>
        <li>Know who won.</li>
      </ul>

      <p className="portfolio-content">
        Each of these items needed to be turned into features and design, such as forms for player data, Call-to-Actions, creating separate views for each player, and using reactive DOM Elements to communicate to the user what is happening.
      </p>
      <p className="portfolio-content">
        From a UI perspective, I wanted the both the Card Components and the UI to mimic Cards Against Humanity simple, elegant black and white color scheme. 
        I also decided to get into Canva to create a Favicon that would represent the game as well.
      </p>
      <p className="portfolio-content">
        With all this planning aside, I was able to create the following mockup:
      </p>
        
      <img src={V1Mockup} alt="V1-Mockup" width="100%"></img>

      <h3 className="section-header" id="version-1-engineering-the-solution">
        Engineering the Solution
      </h3>
      <p className="portfolio-content">
        With the experience mapped, the next step was to decide about what technologies to use to implement.
      </p>

      <h4 className="section-header-2">
        Technology Selections
      </h4>
      <h5 className="section-header-3">
        Front-End
      </h5>
      <li>React: I decided to use React due to its ease-of-use, state management, and developer experience (and because I know JavaScript).</li>
      <li>Material UI: Third party components take some of the heavy lifting out of the design process</li>
      <p className="portfolio-content">
        I created a new React app, and eventually built each view as it appeared on the Wireframe by using a mix of MUI and custom UI components.
        Using flexbox and block styling, I was able to make the views mobile-first so I could optimize for full-response later.
        Then I had to hook up the buttons to React State to render the correct components and views throughout the app flow.
      </p>

      <h5 className="section-header-3">
        Back-End
      </h5>
      <p className="portfolio-content">
        The app at this stage did not any need persistent data, user accounts, or networked connectivity.
        As such, no server or database was needed.
      </p>

      <h5 className="section-header-3">
        Hosting/Deployment
      </h5>
      <p className="portfolio-content">
        The front-end code will need to be accessible to clients on the internet, so I purhased a domain from GoDaddy which needed to be configured to serve the front-end code to users.
      </p>
      <p className="portfolio-content">
        For the hosting of the client code, I selected AWS S3 based mostly on familiarity with AWS having used EC2 and Cloud9 on prior projects.
      </p>

      <h5 className="section-header-3">
        Data Structures & Algorithms
      </h5>
      <p className="portfolio-content">
        I decided to use JavaScript objects to create and manage state in the Front End.  
        Using the Object-Oriented approach I extracted nouns and verbs from my pseudo-code to get a high-level data heirarchy.
        <code>Player</code>s would be deal and select <code>Card</code>s in order to win a <code>Round</code> and eventually win the <code>Game</code>.
        Beyond these, I had some data that was important to the state of the application, that were not relevant necessarily to any of these objects.
        I created an abstract class <code>Stateful Game</code> to track this data (including the <code>view</code> and form data).
      </p>

      {codeSnippets.V1CodeSnippet()}

      <h3 className="section-header" id="version-1-finished-state">
        Finished State
      </h3>

      <p className="portfolio-content">
        After lots of time spend on planning and execution, I finally had a working version of the game!
      </p>

      <iframe width="560" height="315" src="https://www.youtube.com/embed/rLt7-uvqtIc" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    </div>
  )
}