import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const V1CodeSnippet = () => {
  return (
    <SyntaxHighlighter className="code-snippet" language="javascript" style={vscDarkPlus}>
      {`
        class StatefulGame extends Game {
          constructor() {
            super();
            // names were to track and re-rended state for form submission. This was removed in V2.
            this.names = ["", "", ""];
            this.VIEWS = {
              enterPlayers: "enter-players",
              selectPlayer: "player-select",
              judge: "judge-view",
              declareWinner: "declare-winner",
            }
            this.view = this.VIEWS.enterPlayers;
          }
        }
      
        class Game {
          constructor() {
            this.round = null;
            this.rounds = [];
            this.players = [];
            this.promptCards = [...promptCards];
            this.responseCards = [...responseCards];
            this.winningCard = null;
          }
        }
      
        class Round {
          constructor(game) {
            this.players = game.getNonJudgePlayers();
            this.judge = game.getJudgePlayer();
            this.promptCard = game.promptCards.pop();
            this.selectedCards = {};
            this.winningCard = null;
            this.winner = null;
          }
        }
      
        class Player {
          constructor(name) {
            this.id = playerIdCounter;
            playerIdCounter += 1;
            this.name = name;
            this.cards = [];
          }
        }
      
        class Card {
          constructor(text) {
            this.id = cardIdCounter;
            cardIdCounter += 1;
            this.text = text;
          }
        }
      
        // PromtCard and Response Card extended the Card class, but not necessary for understanding the architecture
      `}
    </SyntaxHighlighter>
  );
}
  
const V2DataStores = () => {
  return (
    <SyntaxHighlighter className="code-snippet" language="typescript" style={vscDarkPlus}>
      {`
        // Object that stores all Games in an arrya and houses Methods for Search and CRUD Operations
        class GameStore {
          games: Game[];
      
          constructor() {
            // All Games array
            this.games = [];
          }
      
          // Methods..
          addGame(game: Game): void {
            this.games.push(game);
          }
        }
      
        // Same with Session Store
        class SessionStore {
          sessions: Session[];
      
          constructor() {
            // Store the array of all Game objects on the GameStore Object
            this.sessions = [];
          }
          
          // All methods used to perform CRUD or Seach operaions on the store
          createSession(socketId: string, lobbyId: string | null, view: string): Session {
            const session = new Session(socketId, lobbyId, view);
            this.sessions.push(session);
            return session;
          }
      
          // ...more methods
      `}
    </SyntaxHighlighter>
  );
};

const V2DataStructure = () => {
  return (
    <SyntaxHighlighter className="code-snippet" language="typescript" style={vscDarkPlus}>
      {`
        export type SessionDataType = {
          sessionId: string;
          socketId: string;
          lobbyId: string | null;
          view: string;
        }

        export type GameDataType = {
          id: string;
          NSFW: boolean;
          round: RoundDataType | null;
          previousRounds: RoundDataType[];
          players: PlayerDataType[];
          judgeIndex: number;
          promptCards: CardDataType[];
          responseCards: CardDataType[];
          cardsPerPlayer: number;
          pointsToWin: number;
          winner: PlayerDataType;
        };

        export type RoundDataType = {
          number: number;
          players: PlayerDataType[];
          judge: PlayerDataType | null;
          promptCard: CardDataType;
          winner: PlayerDataType | null;
        }

        export type PlayerDataType = {
          sessionId: string;
          name: string;
          cards: CardDataType[];
          selectedCard: CardDataType | null;
          wins: number;
          readyForNextRound: Boolean;
        }

        export type CardDataType = {
          id: number;
          text: string;
          type: string;
          NSFW: boolean;
        };
      `}
    </SyntaxHighlighter>
  );
};

const V3MongooseModel = () => {
  return (
    <SyntaxHighlighter className="code-snippet" language="typescript" style={vscDarkPlus}>
      {`
          import { Schema, model } from 'mongoose'

          interface IFeedback {
            name: string;
            email: string;
            feedback: string;
            time: string;
          }
        
          const feedbackSchema = new Schema<IFeedback>({
            name: String,
            email: String,
            feedback: String,
            time: String,
          }, {
            collection: 'Feedback',
          });
        
          const Feedback = model<IFeedback>('Feedback', feedbackSchema);
      `}
    </SyntaxHighlighter>
  );
};

const V3APIRoute = () => {
  return (
    <SyntaxHighlighter className="code-snippet" language="typescript" style={vscDarkPlus}>
      {`
          apiroute.post("/feedback", async (req, res) => {

            const feedback = new Feedback({
              name: req.body.name,
              email: req.body.email,
              feedback: req.body.feedback,
              time: req.body.time
            });
          
            await feedback.save();
          
            res.status(201).send(feedback);
          })
      `}
    </SyntaxHighlighter>
  );
};

export const codeSnippets = {
  "V1CodeSnippet": V1CodeSnippet,
  "V2DataStores": V2DataStores,
  "V2DataStructure": V2DataStructure,
  "V3APIRoute": V3APIRoute,
  "V3MongooseModel": V3MongooseModel
};