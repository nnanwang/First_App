import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import Selector from './Selector';

// Create a custom animation
export const pulseMore = {
  // This defines the animation style at the beginning(0%) of the animation sequence.
  // The scale property is set to 1, meaning no scaling.
  0: { scale: 1 },
  // This defines the animation style at the midpoint(50%) of the animation.
  // The scale property is increased to 1.2, meaning the object will scale up to 120 % of its original size.
  0.5: { scale: 1.2 },
  // This defines the animation style at the end(100%) of the animation sequence.
  // The scale is returned to its original value, creating a pulse effect.
  1: { scale: 1 }
};
// This is a method provided by react-native-animatable that allows you to register custom animations.
Animatable.initializeRegistryWithDefinitions({ pulseMore });

export default class Board extends React.Component {

// Method to parse the level string and initialize the grid for the game level
readLevel = ({ level, grid })  => {
  // Split the level string by '|' to get each row and loop through each row
  level.split('|').forEach((row, rowIdx) => {
    // Split each row string into individual cells and loop through each cell
    row.split("").forEach((cell, colIdx) => {
      // If the cell contains '.', it's considered empty and set its value to 0
      if (cell === '.') {
        grid[colIdx][rowIdx].value = 0;
      } else {
        // If the cell contains a number, convert it from string to Number and mark it as locked
        // Locked cells are pre-filled cells that cannot be changed by the player
        grid[colIdx][rowIdx].value = Number(cell);
        grid[colIdx][rowIdx].locked = true;
      }
    });
  });
}


  // Method to create a 2D grid for the game board
  createGrid = (width, height) => {
    // Create an array with size equal to width * height, fill it with undefined, and map over it
    return Array(width * height).fill().map(
      // For each element in the array (representing a row), create a new array of the same size
      () => new Array(width * height).fill().map(
        // For each cell in the row array, create an object to hold the cell's state
        () => new (function(){ 
          this.value = 0;         // The numeric value of the cell, 0 represents an empty cell
          this.notes = [];        // An array to hold any notes or pencil marks the player may make
          this.duplicate = false; // A boolean flag to indicate if this cell's value is a duplicate in its row, column, or grid
          this.error = 0;         // A numeric value to represent an error state or level for the cell
          this.locked = false;    // A boolean to indicate if the cell is locked (pre-filled and not editable)
        })()
      )
    );
  };

  // Method to reset the game to a given level or create a new grid
  reset({ width, height, level }) {    
    let grid = new this.createGrid(width, height); // Create a new grid with the specified width and height
    if (level) {
      this.readLevel({ level, grid }); // If a level is provided, initialize the grid with the level data
      this.checkErrors({ grid }); // Check the newly initialized grid for any errors
    }
    return { grid, selected: null }; // Return the initialized grid and reset the selected cell to null
  }

  // Constructor method called when the component is created
  constructor(props) {
    super(props); // Call the constructor of the parent class (React.Component)
    const { width, height, level } = this.props; // Destructure width, height, and level from props
    this.state = this.reset({ width, height, level }); // Set the initial state using the reset method
  }

  // Lifecycle method called when the component receives new props
  componentWillReceiveProps(nextProps) {
    const { width, height, level } = nextProps; // Destructure the new props
    this.setState(this.reset({ width, height, level })); // Reset the state with the new props
  }
  
  // Method to count how many cells in the grid have a specific property value
  countItems({ grid, prop, value }) {
    // Use reduce to accumulate a total count across all rows
    return grid.reduce((total, currentRow, rowIdx) => {
      // For each row, further reduce to accumulate a count for the current row
      return total += currentRow.reduce((colTotal, currentCell, cellIdx) => {
        // If the current cell's specified property matches the given value, increment the count
        if (currentCell[prop] === value) {
            return ++colTotal;
        } else {
          return colTotal; // Otherwise, just return the current total for this row
        }
      }, 0);
    }, 0); // The initial total count is 0
  }

 // Method to get a specific region (row, column, or 3x3 grid) from the board
 getRegion = ({ grid, regionRow = null, regionCol = null} ) => {
  const { width, height } = this.props; // Get the width and height props for calculation
  // Reduce the grid to a single array that contains only the cells from the specified region
  return grid.reduce((previousRow, currentRow, rowIdx) => {
    // For each cell in the current row
    currentRow.forEach((cell, colIdx) => {
      // If we are targeting a column, push cells from this column to the result array
      if ( regionRow === null && colIdx === regionCol ) {
        previousRow.push(cell);
      }
      // If we are targeting a row, push cells from this row to the result array
      else if ( regionCol === null && rowIdx === regionRow) {
        previousRow.push(cell);
      }
      // If we are targeting a 3x3 grid, determine if the cell is in the correct grid and push it to the result array
      else if ( regionRow === Math.floor(rowIdx / width) 
        && regionCol === Math.floor(colIdx / height) ) {
        previousRow.push(cell);
      }
    });
    // Return the accumulated result
    return previousRow;
  }, []);
}


 
}



