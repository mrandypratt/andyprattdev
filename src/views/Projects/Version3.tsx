import { codeSnippets } from "../../components/CodeSnippets";
const V3Mockup = require("../../assets/Project/V3/V3-Mockup.png")

export const Version3 = () => {
  return (
    <div className="version-wrapper">
      <h2 className="version-header" id="version-3">
        Version 3: Single-Player
      </h2>

      <h3 className="section-header" id="version-3-tools">
        Tools Used
      </h3>

      <ul>
        <li>Rest API</li>
        <li>MongoDB</li>
        <li>Mongoose</li>
        <li>FullStory</li>
      </ul>

      <h3 className="section-header" id="version-3-version-goals">
        Version Goals
      </h3>
      <p className="portfolio-content">
        After Version 2 was released, I realized that many potential users gave me feedback that the game looked nice, but they didn't have friends with which to play.
        Further, the feedback I received was outside the application and I had no good way to track user data and feedback in the app. 
        With these opportunities in mind, my goal for V3 was to add feedback-gathering functionality to the app and create a single-player game mode.
      </p>

      <h3 className="section-header" id="version-3-identifying-problems">
        Identifying Problems
      </h3>
      <h4 className="section-header-2">
        Feature #1: Feedback
      </h4>
      <p className="portfolio-content">
        Thus far, I had no clue how users were using the app other than anecdotes.
        I needed a more systematic way to track user data.
      </p>

      <ul>
        <li>Determine when, if, and how users are using the site</li>
        <li>Offering users an option to leave feedback</li>
        <li>Recreating errors or bugs that users may be experiencing</li>
      </ul>
      <h4 className="section-header-2">
        Feature #2: Single-Player Mode
      </h4>
      <p className="portfolio-content">
        There were a few potential directions to take the single-player mode.  
        I wanted my users to be able to see the fun of the gameplay style so they will want to invite their friends to play online.  
        I also wanted to re-use as much of the game logic and front-end components as possible to lighten the engineering load.
        The problems areas are best summarized as the following:
      </p>

      <ul>
        <li>Online vs. Bot experience & Implementation</li>
        <li>Re-use of components and gameplay logic</li>
        <li>Restructuring the Application Flow</li>
      </ul>


      <h3 className="section-header" id="version-3-understanding-problems">
        Understanding the Problems
      </h3>
      <h4 className="section-header-2">
        Feature #1: Feedback
      </h4>
      <h5 className="section-header-3">
        User-Submitted Feedback
      </h5>
      <p className="portfolio-content">
      I wanted users to be able to submit feedback at any point in the game.  I figured that a globally-available React component would do the trick. 
      </p>
      <ul>
        <li>User clicks Feedback tab</li>
        <ul>
          <li>Feedback Form Displayed</li>
          <ul>
            <li>User Exits - form hidden</li>
            <li>User submits feedback:</li>
            <ul>
              <li>Loading Screen while feedback posting</li>
              <li>Success Screen when complete</li>
            </ul>
          </ul>
        </ul>
      </ul>

      <h5 className="section-header-3">
        Tracking User Data
      </h5>
      <p className="portfolio-content">
      I was informed of FullStory from a SWE friend of mine.  I found out that it was as easy as inserting a script in my React code to implement so I decided to give it a try.  The functionality allowed a full Session replay and tons of additional data about users and how they interacted with the app.  This plug-and-play service allowed me to keep my User-Submitted Feedback data very simple and leverage the FullStory data to cross-reference to see what problems that user may have experienced.
      </p>
      <h4 className="section-header-2">
        Feature #2: Single-Player Mode
      </h4>
      <p className="portfolio-content">
        Originally, the app flow was drawn up with the assumption that a user wanted to play with friends.
        With a new game mode, the application flow needed to accomodate this change in user types.
        Now, since not all players fell into the Multi-Player roles of Guest and Host, I started uses as either Single-Player and Multi-Player users.
      </p>
      <p className="portfolio-content">
        There were additional questions regarding how the single-player mode would be implemented.  From talking to users, an online experience was more enticing than playing with known bots.  While still estabilshing a user-base, though, I didn't know whether or not there would be enough users at a given time to make online worthwhile.  I decided to try to merge these experiences by creating bots, but making the experience feel like online by simulating a lobby and other players.
      </p>

      <h5 className="section-header-3">
        Game Creation Phase
      </h5>
      <ul>
        <li>User visits Home Page:</li>
        <ul>
          <li>Single-Player: looking to play single-player game</li>
          <ul>
            <li>User selects deck and user-name</li>
            <li>User joins mock-lobby</li>
            <li>Other players (bots) join the lobby at random time-intervals</li>
            <li>When lobby is full, gameplay begins.</li>
          </ul>
          <li>Multi-Player: Either Host or Guest</li>
          <ul>
            <li>Follows existing Host or Guest user flow</li>
          </ul>
          <li>Info Path: User wants to Learn about the Game</li>
          <ul>
            <li>Follows existing Info user flow</li>
          </ul>
        </ul>
      </ul>

      <h5 className="section-header-3">
        GamePlay Phase
      </h5>
      <p className="portfolio-content">
      The gameplay flow for Single-Player should follow the same views and patterns of the multi-player gameplay.  The trick will be adapting the game logic to work with events created by bots rather than socket events created by other players.  The bots need to have human-like timing, so this will mean orchestrating bot events (i.e. selecting card, moving to next round, etc.).
      </p>


      <h3 className="section-header" id="version-3-ux-mockup">
        Mapping out the Experience
      </h3>
      <p className="portfolio-content">
        The new Mock-Up was pretty simple, and just required adding an additional step at the beginning allow user's to choose their path, adding a Feedback Component, and creating Single-Player start-up flow.
      </p>

      <img src={V3Mockup} alt="V2-Mockup" width="500px"></img>

      <h3 className="section-header" id="version-3-engineering-the-solution">
        Engineering the Solution
      </h3>

      <h4 className="section-header-2">
        Feature #1: Feedback
      </h4>

      <h5 className="section-header-3">
        Front-End
      </h5>
      <ul>
        <li>Create a component visible on all views that would allow user to submit feedback.</li>
        <li>Insert FullStory Script in React, which works out of the box.</li>
      </ul>
      <h5 className="section-header-3">
        Back-End
      </h5>
      <ul>
        <li>Accepts feedback data from client and stores it somewhere.</li>
        <li>Sends confirmation to front-end whether data was received and stored.</li>
      </ul>
      <h5 className="section-header-3">
        Technology Selection
      </h5>
      <p className="portfolio-content">
        I decided to set up a Database for scalability.  I admit this was admittedly over-engineered solution that I justified as an excuse to learn more about database integration and REST API protocols.
      </p>
      <p className="portfolio-content">
        I setup MongoDB Atlas and used a fully remote cluster to store my data as JSON. I used Mongoose as well to create data models. To post to the database, I set up an Express <code>"/api/feedback"</code> route to trigger the database event.
      </p>
      <h5 className="section-header-3">
        Data Structures/Algorithms
      </h5>
      <p className="portfolio-content">
        The feedback I needed was pretty simple, so I created a model in Mongoose:
      </p>
      {codeSnippets.V3MongooseModel()}
      <p className="portfolio-content">
        Then my Post route would update the database, then send confirmation to client:
      </p>
      {codeSnippets.V3APIRoute()}


      <h4 className="section-header-2">
        Feature #2: Single-Player
      </h4>

      <h5 className="section-header-3">
        Front-End
      </h5>
      <p className="portfolio-content">
        Create Additional Views for Single-Player route.
      </p>
      
      <h5 className="section-header-3">
        Back-End
      </h5>
      <p className="portfolio-content">
        Update socket event-handling to account for only having a single player sending events.
      </p>

      <h5 className="section-header-3">
        Technology Selection
      </h5>
      <p className="portfolio-content">
        Most of the problem stemmed from needing to separate the back-end into single-player and multi-player modes efficiently and effectively.  I was able to utilize Faker, a NPM module that generates fake user data to power the bots.
      </p>
      <h5 className="section-header-3">
        Data Structures/Algorithms
      </h5>
      <p className="portfolio-content">
      I used Socket.io exclusively for handling the game events in the multi-player mode.  Now that I was introducing a game mode where other players were no longer able to send socket events, I needed to re-organize the back-end socket logic to handle the socket events from a single client based on any given game state.  For example, if my client selects a card, the view they will be shown will be different based on whether the other bot player(s) have selected.
      </p>
      <p className="portfolio-content">
      This was further complicated by my desire to orchestrate the bots to imitate human player timing. 
      </p>
      <p className="portfolio-content">
      My solution was to create separate Socket Events for Single-Player mode and use`setTimeout()`s to delay the bot selections.  Each event from the client would trigger the back-end to start any bot timers that were needed, and when the bot timers expired and triggered the event, I would have the back-end send a socket update to the client and trigger any further bot timers needed.
      </p>


      <h3 className="section-header" id="version-3-finished-state">
        Finished State
      </h3>
      <h4 className="section-header-2">
        Feature #1: Feedback
      </h4>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/wdrH4mSdk4Y" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      <h4 className="section-header-2">
        Feature #2: Single-Player Mode
      </h4>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/aBt8_rdTIMs" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    </div>
  )
}