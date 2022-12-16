const V2UserFlow = require("../../assets/Project/V2/V2-User-Flows.png");
const V2Mockup = require("../../assets/Project/V2/V2-Mockup.png");
const V2Session = require("../../assets/Project/V2/V2-Sessions-Mockup.png");
const V2EndGame = require("../../assets/Project/V2/V2-End-Game-Buttons.png");
import { codeSnippets } from "../../components/CodeSnippets";

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
        The vision of the product at Version 2 to enable gameplay across multiple devices allowing for both in-person and fully remote gameplay. 
        From talking to users about the game, it seemed that being able to experience the reactions of other players in real-time was very important.
        I decided to continue to optimize the experience around in-person while extending the use-case to video/phone calls.
      </p>
      <p className="portfolio-content">
        The goal for V2 was to take my existing gameplay and spread it across multiple clients while making improvements to the application flow and interface that will serve the new experience. 
      </p>

      <h3 className="section-header" id="version-2-identifying-problems">
        Identifying Problems
      </h3>
      <p className="portfolio-content">
        As before, I wanted a structured approach to this new feature. I made a list of things that needed to be done to enable online play.
      </p>

      <ul>
        <li>Re-Map the application flow.</li>
        <li>Create new views to represent the new flow</li>
        <li>Identify and track clients to serve them the correct data</li>
        <li>Connect clients in the same game.</li>
        <li>Allow players to end a game</li>
        <li>Allow a dynamic number of players (3+)</li>
        <li>Store and serve game and client data</li>
        <li>Synchronize game state across multiple clients</li>
        <li>Update the Data Structures/Algorithms</li>
        <li>Implement Round & Game winners</li>
        <li>Improve the UX and UI to be responsive and clean</li>
        <li>Add an option to choose less "adult" content</li>
      </ul>

      <h3 className="section-header" id="version-2-understanding-problems">
        Understanding the Problems
      </h3>
      <p className="portfolio-content">
        If a user visits the site, it is assumed they want to play a game or they are confused about why they are there.
        The game either already exists and the user wants to join, or it doesn't exist yet and the player wants to create a game.
        So before getting to the Gameplay phase of the game, there appeared to be a phase of Game Creation where users connect with their friends online. 
        Once they were linked, they could then be moved into the phase of Gameplay. 
        With this in mind, I divided the application into two distinct phases: Creating Game & Gameplay.
      </p>
      <p className="portfolio-content">
        In Version 1, there were already roles assigned to users for Gameplay: Judge and Player.  
        Now with the Game Creation phase, users could also be either a Host (starting a game) or a Guest (joining a game).
        Also, I want to cover the case of the confused user who needs Info.
      </p>
      <p className="portfolio-content">
        With all this together, I have 5 categories of users throughout the flow of the application (Info, Guest, Host, Player, Judge) and two phases of the app (Game Creation and GamePlay).
      </p>
      <h4 className="section-header-2">
        PseudoCode
      </h4>
      <h5 className="section-header-3">
        Phase 1: Creating Game (Host, Guest, & Info Paths)
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
        Phase 2: Gameplay (Player & Judge Paths)
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

      <h3 className="section-header" id="version-2-ux-mockup">
        Mapping out the Experience
      </h3>
      <p className="portfolio-content">
        I took to Miro to get put UI components together some logical flows and get some idea of how the user's experience should be mapped in a way that makes clear how to use the app and makes gameplay intuitive at any point in the experience. 
      </p>
      <h4 className="section-header-2">
        Basic User Flow
      </h4>
      <p className="portfolio-content">
        I first mocked up a start-to-finish journey for each of the 5 categories of user at each step in their journey. (Note: Game Over/Results was part of Player & Judge paths)
      </p>

      <img src={V2UserFlow} alt="5-User-Mockup" width="300px"></img>

      <p className="portfolio-content">
        Since users will be on separate devices, it was also important to inform the user what is happening at each step of the journey (i.e. “who is the judge?”, “who is winning?”, “what do I need to do now?”, etc.). 
        I made sure to use Headings and Call-to-Actions to inform the user of where they were in the journey and included waiting screens to inform and reassure users of what is happening in the game while they are waiting for other players.
      </p>
      <p className="portfolio-content">
        I expanded my original V1 Mock-Up in incorporate the two phases of play and the 5 user journeys.
      </p>

      <img src={V2Mockup} alt="V2-Mockup" width="300px"></img>

      <h4 className="section-header-2">
        Advanced Flow Elements
      </h4>
      <p className="portfolio-content">
        There was addititional complexity introduced with lobbies and games when someone either leaves or disconnects from a lobby. 
        I mocked up ways to allow users to exit a lobby or game at any point in the game and determine how these cases should be handled.
      </p>

      <img src={V2Session} alt="V2-Sessions" width="300px"></img>
      <img src={V2EndGame} alt="V2-End-Game" width="300px"></img>

      <h3 className="section-header" id="version-2-engineering-the-solution">
        Engineering the Solution
      </h3>

      <h4 className="section-header-2">
        Scalability: TypeScript Migration
      </h4>
      <p className="portfolio-content">
        Since I was going to be moving things around a lot and increasing the size and complexity, I decided to migrate my codebase to TypeScript to leverage type-safety and linting.  
        It made sense to make this migration first before adding additional features. 
        TI installed TypeScript and types for each necessary package and began migrating files one-by-one.
        This gave me ample exposure and experience to the benefits of type-safety and the syntax of TypeScript on existing code before trying to build new files/components with the new syntax.
      </p>

      <h4 className="section-header-2">
        Back-End
      </h4>
      <p className="portfolio-content">
        A networked game required a server. 
        I already had my Front-End being distributed by an S3 bucket, so I didn't need to serve Front-End data. 
        What I would need is to centralize, organize, and distribute data across clients.
        
      </p>
      <h5 className="section-header-3">
        Requirements
      </h5>

      <ul>
        <li>Establish a connection with each client</li>
        <li>Uniquely identify each client on each future request</li>
        <li>Store data about each client (current view, game joined, name)</li>
        <li>Store data for each Game (players, game state)</li>
        <li>Associate Clients in the same lobby/game</li>
        <li>Handle the logic for running the game engine and updating state</li>
        <li>Receive and Push updates to all players in real-time</li>
        <li>Remove Client from Game/Lobby and handle the effect on the game and other players in game</li>
      </ul>

      <h5 className="section-header-3">
        Constraints
      </h5>
      <p className="portfolio-content">
        I found it helpful to be explicit about things I didn't need to focus as well. I did not need to:
      </p>
      <ul>
        <li>User Authentication: Users just want to play a game as quickly as possible.</li>
        <li>Long-Term Data Persistence: In-memory storage would do the trick until user-count ramped up. Using JS Objects, I could easily adopt a document database (like MongoDB) or caching (Redis) later.</li>
      </ul>

      <h4 className="section-header-2">
        Technology Selection
      </h4>

      <h5 className="section-header-3">
        Backend Language: Node.js
      </h5>
      <p className="portfolio-content">
        I already knew I planned to use Node.js on the server, as I already had familiarity with Node/JavaScript/TypeScript and knew there were many libraries devoted web applications.
        This helped me narrow my future tool choices to one ecosystem.
      </p>

      <h5 className="section-header-3">
        Backend Framework: Express
      </h5>
      <p className="portfolio-content">
        I found that I could manage much of the Server options easily with Express (CORS, routing, etc.). 
        Express offered a more robust HTTP server with many options for easy integration with other tools in the ecosystem.
      </p>

      <h5 className="section-header-3">
        Updating Clients: Socket.io
      </h5>
      <p className="portfolio-content">
        Socket.io worked with Node & Express to enable bi-directional websocket communication between all clients and server out of the box.
        The Pub/Sub events architecture made connections and updates fast.
        Synchronizing game state across all clients became as simple as defining events on client and server-side and emitting updates when needed.
      </p>

      <h5 className="section-header-3">
        Session Management: Custom Solution
      </h5>
      <p className="portfolio-content">
        I started by using Socket ID's to track clients, but they reset across refreshes and re-connections.
        I created a persistent Session ID that was stored on both client and server.
        The Session ID's were stored in a <code>SessionStore</code> object which associated Session ID's with the correct socket connection.
      </p>

      <h5 className="section-header-3">
        Game Engine: Custom Solution
      </h5>
      <p className="portfolio-content">
        The Game Engine needed to be expanded to last for multiple rounds, declare various winning states, and to integrate with the socket events. 
        Additionally, I needed to keep up with many games on the server at any given time.
        A <code>GameStore</code> object stored all active games and associated them with the appropriate clients. 
        This object was kept in-memory both to avoid additional database complexity and because I only needed semi-persistence (memory to last through the game, but not necessarily after a game is finished). 
      </p>
      <h5 className="section-header-3">
        Hosting/Deployment
      </h5>
      <p className="portfolio-content">
        I selected AWS EC2 as my back-end hosting platform, as I had familarity with AWS and knew this would be affordable.
        I created an architecture to help me shift between Dev, Test, and Prod environments and documented it all in a <code>CONTRIBUTING.md</code> file.
      </p>

      <ul>
        <li>Dev</li>
        <ul>
          <li><code>concurrently</code> to run both react and node server at the same time.</li>
          <li><code>.env</code> file to house environment variables and sensitive data.</li>
        </ul>
        <li>Test/Prod</li>
        <ul>
          <li>Server for both Test and Prod with environment variables for Test or Prod, respectively.</li>
          <li>React build script to set front-end environment variable to test or prod, respectively.</li>
          <li>Using <code>PM2</code> to run production server and store logs.</li>
          <li>Elastic IP: used to keep a consistent URL for the EC2 instance across time and server re-boots.</li>
        </ul>
      </ul>

      <h4 className="section-header-2">
        Data Structures/Algorithms
      </h4>

      <p className="portfolio-content">
        The things I needed to track were Clients (Users/Sessions/Sockets) and Games (Players/Cards/Winners).
        I knew I wanted to use a JS Array to keep up with the arbitrary number of Sessions and Games that could be active at any time and reference them by ID's. 
        Within the Arrays, I would store objects that represented Session data and Game data respectively.
        I would essentially have Foreign keys in Session to reference an active game and in each game to reference the Sessions associated with the game.
      </p>

      {codeSnippets.V2DataStores()}
      {codeSnippets.V2DataStructure()}

      <h3 className="section-header" id="version-2-finished-state">
        Finished State
      </h3>

      <p className="portfolio-content">
        Abstracting many weeks and months of hard work and aggressive Googling, I finally released Version 2!
      </p>

      <iframe width="560" height="315" src="https://www.youtube.com/embed/cLoCAiEKYpw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/7O-wDc7RE2s" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

    </div>
  )
}