import React from 'react';
import { Cell } from './game';

// specify the shape of the props that BoardCell will receive.
interface Props {
  cell: Cell
}

// class-based React component that extends React.Component, with Props serving as the type for the component's props.
class BoardCell extends React.Component<Props> {
  // This method is required in all class components and tells React what should be rendered to the DOM. The method returns JSX, a syntax extension that resembles HTML but can include JavaScript expressions.

  render(): React.ReactNode {
    // In React, "props" are short for properties. They are a mechanism for passing data from a parent component to a child component. 
    const playable = this.props.cell.playable ? 'playable' : '';
    return (
      // This text represent anything pertinent to the cell, like an "X" or an "O" in a Tic-Tac-Toe game or empty if the cell hasn't been played.
      <div className={`cell ${playable}`}>{this.props.cell.text}</div>
    )
  }
}

export default BoardCell;