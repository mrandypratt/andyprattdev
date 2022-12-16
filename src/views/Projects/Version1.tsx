import { codeSnippets } from "../../components/CodeSnippets"
import { ToolTable } from "../../components/ToolTable"

export const Version1 = () => {
  return (
    <div className="version1">
        <h2 className="version-header" id="version-1">
          Version 1: MVP (Single-Client)
        </h2>

        <h3 className="section-header" id="version-1-tools">
          Tools Used
        </h3>
        <ToolTable version="one"/>


        <h3 className="section-header" id="version-1-version-goals">
          Version Goals
        </h3>
        <p className="portfolio-content">
          The vision of the product at Version 1 was to be a party game optimized for in-person play with friends.
        </p>
        <p className="portfolio-content">
          The goal for Version 1 was to create a Proof-of-Concept or Minimum Viable Product (MVP). As a one-man team, it was important to keep the goals as concise and focused as possible. Anything not absolutely necessary to deliver the product vision had to be tabled for later versions.
        </p>

        <h3 className="section-header" id="version-1-identifying-problems">
          Identifying Problems
        </h3>
          <p className="portfolio-content">
            In order to figure out what needs to be built, the main objective is to get a thorough understanding of the gameplay and map out the logical steps. Then I can create a visual representation of the game at each step in a wire-frame.  After that, I can decide how to bring the vision together in code and then deploy it all.
          </p>
          <p className="portfolio-content">
            In-person play worked as a useful constraint, as it allowed me to only build on one device and avoided the complexity of building a networked architecture. For V1, I would focus purely on building a React Front-End, creating a Game Engine, and getting the site live on the internet. Additionally, There was no need for persistent data or session-tracking.  With these constraints in mind, it was time to start thinking about the experience.
          </p>


        <h3 className="section-header" id="version-1-understanding-problems">
          Understanding the Problems
        </h3>
          <p className="portfolio-content">
          I started by dictating the logical steps of the game over and over, each time trimming down the length of the explanation until something relatively concise emerged. From there, I extracted some pseudo-code to represent the gameplay:
          </p>
          <h4 className="section-header-2">
            PseudoCode
          </h4>
          <ul>
            <li className="">Select Number of Participants</li>
            <ul>
              <li>Participants have names</li>
            </ul>
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
          <p className="portfolio-content">
            From a UI perspective, I wanted the both the Card Components and the UI to mimic Cards Against Humanity simple, elegant black and white color scheme. I also decided to get into Canva to create a Favicon that would represent the game as well.
          </p>
          <p className="portfolio-content">
            With this, I decided the best solution would be to allow users to enter all the players for a game, and within the game, give each player their own button where they could make there selections. This would keep the card selections private. I also decided to only included buttons on the screen that needed to be selected, so I would hide the "Judge's Round" button until all players had selected, and inactivate player buttons after selections had been made.
          </p>

          <img src="../../assets/Project/V1/V1-Mockup.png" alt="V1-Mockup" width="100%"></img>

        <h3 className="section-header" id="version-1-engineering-the-solution">
          Engineering the Solution
        </h3>
          <p className="portfolio-content">
            Now with the experience mapped, the next step was to think about what technologies to use to implement. I broke down the most important aspects of this process as follows:
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
              I created a new React app. Built each view as it appeared on the Wireframe and hooked up the buttons to transition between the views. I used a mix of customized MUI elements and builiding my own from scratch to match the gameplay.  Unfortunately, I did not know how to use CSS Grid at the time, so I used a mix of Block and Flexbox display styles and optimized the game to look good on mobile.
            </p>

            <h5 className="section-header-3">
              Back-End
            </h5>
            <p className="portfolio-content">
            Since the app at this stage does not any need persistent data, user accounts, or networked connectivity so no server or database is needed.
            </p>

            <h5 className="section-header-3">
              Hosting/Deployment
            </h5>
            <p className="portfolio-content">
              Domain Name: The front-end code will need to be accessible on the internet, so a Domain will need to be purchased and configured to serve the front-end code to users.
            </p>
            <p className="portfolio-content">
              Static Site Hosting: I selected AWS S3 based mostly on familiarity with AWS having used EC2 and Cloud9 on prior projects.
            </p>

            <h5 className="section-header-3">
              Data Structures & Algorithms
            </h5>
            <p className="portfolio-content">
              I decided to use JavaScript objects to create and manage state in the Front End.  
              I decided to use a master <code>StatefulGame</code> object that would track all data 
              needs for the app and I would render views and game data based on this object in React.  
              I from my pseudo-code, I knew I needed to keep track of <code>Player</code>s, <code>Card</code>s, 
              the <code>Game</code> and multiple <code>Round</code>s, so I broke these nouns out into objects. 
            </p>
            <p className="portfolio-content">
              Since I needed to keep track of the current <code>view</code> in React, I decided to create an 
              abstract class <code>StatefulGame</code> which would also house the views, since the view wasn't
               logically part of the game logic. Excluding the Methods, below was the data structure 
               used to manage state for the game:
            </p>

            {codeSnippets.V1CodeSnippet()}


        <h3 className="section-header" id="version-1-finished-state">
          Finished State
        </h3>

        <iframe width="560" height="315" src="https://www.youtube.com/embed/rLt7-uvqtIc" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
    </div>
  )
}