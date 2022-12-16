import { ToolTable } from "../../components/ToolTable"

export const Version2 = () => {
  return (
    <div className="version1">
        <h2 className="version-header" id="version-2">
          Version 2: Multi-Device MVP
        </h2>

        <h3 className="section-header" id="version-2-tools">
          Tools Used
        </h3>
        <ul>
          <li>TypeScript</li>
          <li>Node.js</li>
          <li>Express</li>
          <li>Socket.io</li>
          <li>EC2</li>
          <li>PM2</li>
          <li>Async/Await</li>
        </ul>


        <h3 className="section-header" id="version-2-version-goals">
          Version Goals
        </h3>
        <p className="portfolio-content">
          The vision of the product at Version 2 to enable gameplay across multiple devices allowing for both in-person and fully remote gameplay. From talking to users about the game, it seemed that being able to experience the reactions of other players was very important, so I decided to continue to optimize the experience with the use-cases of in-person and video call in mind.
        </p>
        <p className="portfolio-content">
          The goal for V2 was to figure out what elements were necessary for online play.  In addition to the multi-client technical challenge, I also wanted to ensure the User Experience was clear and easy to follow and the UI was clean and reactive.
        </p>

        <h3 className="section-header" id="version-2-identifying-problems">
          Identifying Problems
        </h3>
        <p className="portfolio-content">
          Enabling online play was the premier technical challenge which had a number of ripple-effects. The shift from a self-contained game engine in the browser to enabling state updates across multiple clients entailed:
        </p>

        <ul>
          <li>Re-Mapping the the application flow.</li>
          <li>Creating new views to represent the new flow and user classes.</li>
          <li>Tracking and identifying each client within and across connections.</li>
          <li>Allowing users a way to organize and connect in an online game.</li>
          <li>Tracking Game State for each client and updating across all clients in the same game.</li>
          <li>Updating the Data Structures/Algorithms.</li>
          <li>Creating a more complete Gameplay Experience to keep track of Round and Game Winners.</li>
          <li>Improving the UX and UI along the way to be more responsive and clean.</li>
        </ul>

        <p className="portfolio-content">
          Finally, some of my content was unsavory, so I also wanted an option for more "safe-for-work" content.
        </p>

        <h3 className="section-header" id="version-2-understanding-problems">
          Understanding the Problems
        </h3>
          <p className="portfolio-content">
            Before diving into technical challenges right away, I wanted to take some time to think about the User Experience. Cards Against Humanity needs a minimum of 3 players, and to play online they will need to be able to be linked together. So before getting to the Gameplay phase of the game, there would have to be a Game Creation phase where users find their friends online. Once they were linked, they could then be moved into Gameplay. With this in mind, I divided the application into two distinct phases: Creating Game & Gameplay.
          </p>
          <p className="portfolio-content">
          Thinking more deeply into user stories in each phase, I imagined a user logging onto the site. The user would need to do one of three things: Create a game, Join a game, or learn about the app. Once gameplay was started, I already knew from V1 that there were Players and Judge users, and that categories would change, where a host will become a player and then judge. So across the app, I decided to put users in one of these 5 categories based on where the were in the flow and what they wanted/needed to do: Host, Guest, Info, Player, & Judge. 
          </p>
          <h4 className="section-header-2">
            PseudoCode
          </h4>
          <p className="portfolio-content">
            Now with some high-level understanding, it was time to start breaking down the logical steps of the application into pseudo-code for each of the two phases and five categories of user:
          </p>
          <h5 className="section-header-3">
            Creating Game: Host, Guest, & Info Paths
          </h5>
          <ul>
            <li>User visits Home Page as one of the following:</li>
            <ul>
              <li>Host Path: User looking to Start a Game</li>
              <ul>
                <li>Host enters name and selects card deck</li>
                <li>Lobby is created</li>
                <li>Host invites friends to join the lobby</li>
                <li>When friends arrive, user may start gameplay </li>
              </ul>
              <li>Guest Path: User looking to Join a Game</li>
              <ul>
                <li>Guest enters name and finds and joins their desired host's lobby</li>
                <li>Guest enters gameplay when host starts game</li>
              </ul>
              <li>Info Path: User wants to Learn about the Game</li>
              <ul>
                <li>User reads info and returns home</li>
              </ul>
            </ul>
          </ul>

          <h5 className="section-header-3">
            Gameplay: Player & Judge Paths 
          </h5>

          <ul>
            <li>Game Begins</li>
            <ul>
              <li>Round Starts</li>
              <ul>
                <li>Cards are dealt to all game participants & Prompt Card is drawn.</li>
                <li>One participant is designated as judge.</li>
                <li>All non-judge players will select a Response Card from their hand.</li>
                <ul>
                  <li>If all players have not selected, the player will be waiting.</li>
                  <li>The Judge Will be waiting.</li>
                </ul>
                <li>Judge Player will select the Winner</li>
                <ul>
                  <li>Non-judge players will be waiting</li>
                </ul>
                <li>Round or Game Winner is declared</li>
                <ul>
                  <li>Player's score is incremented</li>
                  <li>Winning Cards and Players are displayed</li>
                  <li>Option to play new round/game offered</li>
                </ul>
              </ul>
              <li>Loop</li>
            </ul>
          </ul>
          <h5 className="section-header-3">
            Additional Considerations
          </h5>
          <p className="portfolio-content">
            For a plesant gameplay experience, the app will need to handle additional functionality:
          </p>
          <ul>
            <li>User refreshes connection or leaves site should not abandon game or lose state/view data.</li>
            <li>Numer of players should be dynamic.</li>
            <li>Game State needs to centralized and updated instantly across clients.</li>
            <li>A user should be able to leave the lobby or end a game.</li>
          </ul>
          <p className="portfolio-content">
            Now with some pseudo-code and requirements, I could start putting together visuals to represent the states and actions.
          </p>

        <h3 className="section-header" id="version-2-ux-mockup">
          Mapping out the Experience
        </h3>
          <p className="portfolio-content">
            I took to Miro to get put together some logical flows and get some idea of how the user's experience should be mapped in a way that makes clear how to use the app and makes gameplay intuitive at any point in the experience. 
          </p>
          <h4 className="section-header-2">
            Basic User Flow
          </h4>
          <p className="portfolio-content">
            I first mocked up a start-to-finish journey for users at each step in their journey based on the 5 categories of User separately (Note: Game Over/Results was part of Player & Judge paths).
          </p>

          <img src="../../assets/Project/V2/V2-User-Flows.png" alt="5-User-Mockup" width="300px"></img>

          <p className="portfolio-content">
            With the increased number of types of users spread across multiple clients, it was also important to inform the user what is happening at each step of the journey (i.e. “who is the judge?”, “who is winning?”, “what do I need to do now?”, etc.). I made sure to use Headings and Call-to-Actions to inform the user of where they were in the journey and included waiting screens to inform and reassure users of what is happening in the game while they are waiting for other players.
          </p>
          <p className="portfolio-content">
            Feeling confident about each user Journey, I then expanded my original V1 Mock-Up in incorporate the two phases of play and the 5 user journeys:
          </p>

          <img src="../../assets/Project/V2/V2-Mockup.png" alt="V2-Mockup" width="300px"></img>

          <h4 className="section-header-2">
            Advanced Flow Elements
          </h4>
          <p className="portfolio-content">
            In addition to the basic flow, I also knew that there were some additional complexity to handle in regards to giving users access to leave a lobby or game and determining how to handle these cases. I decided that 
          </p>


        <h3 className="section-header" id="version-2-engineering-the-solution">
          Engineering the Solution
        </h3>

          <h4 className="section-header-2">
            Scalability: TypeScript Migration
          </h4>
          <p className="portfolio-content">
            Since I was going to be moving things around a lot and increasing the size and complexity, I decided to migrate my codebase to TypeScript to leverage type-safety and linting.  It made sense to make this migration first before adding additional features. To do this, I simply installed TypeScript and types for the libraries I was using and began migrating files one-by-one from `js`/`jsx` to `ts`/`tsx`.  This gave me ample exposure and experience to the benefits of type-safety and the syntax of TypeScript on existing code before trying to build new files/components with the new syntax.
          </p>
          <h4 className="section-header-2">
            Back-End Requirements
          </h4>
          <p className="portfolio-content">
          With a networked game, I knew I would need a server, but I needed to think a bit about what I needed my server to do.  I alredy had my Front-End being distributed by an S3 bucket, so I didn't need to serve Front-End data. I made a list of requirements for my back-end.
          </p>
          <p className="portfolio-content">
            
          </p>
          <p className="portfolio-content">
            
          </p>



        <h3 className="section-header" id="version-2-finished-state">
          Finished State
        </h3>

        <iframe width="560" height="315" src="https://www.youtube.com/embed/cLoCAiEKYpw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/7O-wDc7RE2s" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

    </div>
  )
}