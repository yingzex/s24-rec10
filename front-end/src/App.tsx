import React from 'react';
import './App.css'; // import the css file to enable your styles.
import { GameState, Cell } from './game';
import BoardCell from './Cell';

/**
 * Define the type of the props field for a React component
 */
// this component does not expect any props from its parent
interface Props { }

/**
 * Using generics to specify the type of props and state.
 * props and state is a special field in a React component.
 * React will keep track of the value of props and state.
 * Any time there's a change to their values, React will
 * automatically update (not fully re-render) the HTML needed.
 * 
 * props and state are similar in the sense that they manage
 * the data of this component. A change to their values will
 * cause the view (HTML) to change accordingly.
 * 
 * Usually, props is passed and changed by the parent component;
 * state is the internal value of the component and managed by
 * the component itself.
 */
// App receives Props and maintains GameState as its state.
class App extends React.Component<Props, GameState> {
  private initialized: boolean = false;

  /**
   * @param props has type Props
   */
  constructor(props: Props) {
    super(props)
    /**
     * state has type GameState as specified in the class inheritance.
     */
    // The constructor initializes the component state with an empty array of cells, indicating that no moves have been made or that the game hasn't started yet.
    this.state = { cells: [], winner: "" }
  }

  /**
   * Use arrow function, i.e., () => {} to create an async function,
   * otherwise, 'this' would become undefined in runtime. This is
   * just an issue of Javascript.
   */
  // This asynchronous method fetches a new game state from a backend server (presumably at the endpoint /newgame) and updates the component's state with the new cells. This effectively starts a new game.
  newGame = async () => {
    const response = await fetch('/newgame');
    // console.log(response)
    const json = await response.json();
    console.log(json)
    this.setState({ cells: json['cells'], winner: json['winner'] });
  }

  /**
   * play will generate an anonymous function that the component
   * can bind with.
   * @param x 
   * @param y 
   * @returns 
   */
  // This method generates an event handler for making a move. It prevents the default action for the event (useful if the move is triggered by clicking a link or a button), then sends a play request to the backend with the x and y coordinates of the move. Upon receiving the updated game state, it updates the component's state.
  play(x: number, y: number): React.MouseEventHandler {
    return async (e) => {
      // prevent the default behavior on clicking a link; otherwise, it will jump to a new page.
      e.preventDefault();
      const response = await fetch(`/play?x=${x}&y=${y}`)
      const json = await response.json();
      this.setState({ cells: json['cells'], winner: json['winner'] });
      console.log(json)
    }
  }

  handleUndo = async () => {
    console.log("handleundo")
    const response = await fetch('/undo');
    const json = await response.json();
    console.log(json)
    this.setState({ cells: json['cells'], winner: json['winner'] });
  }

  // This method takes a cell object and its index, then returns a JSX element that renders the cell.
  // The key prop is used by React to optimize rendering lists of elements.
  createCell(cell: Cell, index: number): React.ReactNode {
    if (cell.playable)
      /**
       * key is used for React when given a list of items. It
       * helps React to keep track of the list items and decide
       * which list item need to be updated.
       * @see https://reactjs.org/docs/lists-and-keys.html#keys
       */
      return (
        // If the cell is playable, it wraps the BoardCell component in an anchor tag (<a>) with an onClick event handler that calls the play method. 
        <div key={index}>
          <a href='/' onClick={this.play(cell.x, cell.y)}>
            {/* App component is the parent component of BoardCell component and renders BoardCell instances. It is responsible for passing cell as props to BoardCell.  */}
            {/* The parent component (App) is responsible for managing the game state, including the state of each cell on the board, and it passes each cell's state to the BoardCell component as props. */}
            <BoardCell cell={cell}></BoardCell>
          </a>
        </div>
      )
    else
      return (
        <div key={index}><BoardCell cell={cell}></BoardCell></div>
      )
  }

  /**
   * This function will call after the HTML is rendered.
   * We update the initial state by creating a new game.
   * @see https://reactjs.org/docs/react-component.html#componentdidmount
   */
  // This lifecycle method is called after the component is mounted (inserted into the DOM). It checks if the game has been initialized; if not, it calls newGame to fetch the initial game state and sets initialized to true.
  componentDidMount(): void {
    /**
     * setState in DidMount() will cause it to render twice which may cause
     * this function to be invoked twice. Use initialized to avoid that.
     */
    if (!this.initialized) {
      this.newGame();
      this.initialized = true;
    }
  }

  /**
   * The only method you must define in a React.Component subclass.
   * @returns the React element via JSX.
   * @see https://reactjs.org/docs/react-component.html
   */
  render(): React.ReactNode {
    /**
     * We use JSX to define the template. An advantage of JSX is that you
     * can treat HTML elements as code.
     * @see https://reactjs.org/docs/introducing-jsx.html
     */
    return (
      <div>
        <div id="instructions">"{this.state.winner}"</div>
        <div id="board">
          {this.state.cells.map((cell, i) => this.createCell(cell, i))}
        </div>
        <div id="bottombar">
          <button onClick={/* get the function, not call the function */this.newGame}>New Game</button>
          {/* Exercise: implement Undo function */}
          <button onClick={this.handleUndo}>Undo</button>
        </div>
      </div>
    );
  }
}

export default App;
