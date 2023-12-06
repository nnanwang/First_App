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

// Method to clear all error and duplicate flags from the grid
clearErrors = grid => {
  // Iterate over each row in the grid
  grid.forEach(row => {
    // Iterate over each cell in the current row
    row.forEach(cell => {
      // Reset the duplicate flag and error value for the cell
      cell.duplicate = false;
      cell.error = 0;
    });
  });
}

// Method to check for duplicate values within a given region (row, column, or 3x3 grid)
checkDuplicates = (region) => {
  // Map the region to an array of cell values and filter out zeros (empty cells)
  const regionValues = region.map((cell) => cell.value).filter(value => value !== 0);

  // Reduce the array of values to an array of duplicates
  const duplicateValues = regionValues.reduce((previous, current, idx) => {
      // If the current value has been seen before in the array, add it to the duplicate array
      if (regionValues.indexOf(current) < idx) {
          previous.push(current);
      }
      return previous;
  }, []);

  // Iterate over each cell in the region to set duplicate flags
  let errors = false;
  region.forEach((cell) => {
    // If the cell's value is in the duplicate array, set the duplicate flag to true
    if (duplicateValues.indexOf(cell.value) !== -1) {
      errors = true; // We have found duplicates, so errors is set to true
      cell.duplicate = true; // Mark the cell as a duplicate
    }
  });

  // For each cell in the region, if there are errors, increase the error opacity to visually indicate an error
  region.forEach((cell) => {
    if (errors) { cell.error += 3.3; } // Add to the error opacity value
  });
}
  
    // Checks entire grid for errors by looking at each column, row, and 3x3 subsection
    checkErrors = ({ grid }) => {
      const { width, height } = this.props; // Retrieve width and height from props
  
      // Check rows and columns for duplicates
      // Check each 3x3 subsection for duplicates
      for (let i = 0; i < width * height; i++) {
        this.checkDuplicates(this.getRegion({ grid, regionCol: null, regionRow: i })); // check each row
        this.checkDuplicates(this.getRegion({ grid, regionCol: i, regionRow: null })); // check each column
      }
  
      // Check each 3x3 subsection for duplicates
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          this.checkDuplicates(this.getRegion({ grid, regionCol: i, regionRow: j })); // Check each 3x3 grid
        }
      }
    }
  
    // Renders a row of cells
    renderRow({ row, rowIdx }) {
      return (
        // Assign a unique key to each row for React's reconciliation process
        <View key={rowIdx}> 
          {/* // Map each cell in the row to a renderCells call to create the cell components */}
          {row.map((cell, colIdx) => this.renderCells({ cell, colIdx, rowIdx }))}
        </View>
      );
    }
  
    // Applies styling for cells with errors 'red'
  errorStyle = cell => {
          // If the cell has an error, adjust the background color to indicate an error visually
      return (cell.error) ? { backgroundColor: `rgba(255, 116, 102, ${cell.error/10})` } : {};
    };
  
    // Applies styling for duplicate cells
  duplicateStyle = cell => {
    // Cells marked as duplicates are styled with a different background color
    return (cell.duplicate) ? { backgroundColor: 'rgb(255, 116, 102)' } : {};
    };
  
    // Applies styling for locked cells (cells that cannot be changed) "green"
  lockedStyle = cell => {
          // Locked cells get a specific styling, which differs if they are also marked as duplicates
      if (cell.locked && cell.duplicate) 
        return { backgroundColor: 'rgb(170, 90, 99)' }
      else if (cell.locked)
        return { backgroundColor: '#ccc' }
      else
        return {};
    };
  
    // Highlights the currently selected cell
    selectStyle = (rowIdx, colIdx) => {
      const { selected } = this.state; // Get the currently selected cell from the state
      // Apply specific styling if the cell is the one currently selected
      return (
        selected !== null &&
        selected.row === rowIdx && 
        selected.column === colIdx) ?
          { backgroundColor: '#fff247' } : {}; //yellow
    };
  
  // Adds border styling to separate 3x3 subsections
  borderStyle = (rowIdx, colIdx) => {
    let cellBorder = {};
    const separatorWidth = 3;
    // Borders are added to visually separate the 3x3 grids within the board
    // Apply thicker borders at the edges of each 3x3 grid
    if (((rowIdx+1) % this.props.width) === 0) {
      cellBorder.borderRightWidth = separatorWidth;
      cellBorder.borderRightColor = '#c1d9ff'; //blue
    } else if (rowIdx === 0) {
      cellBorder.borderLeftWidth = separatorWidth;
      cellBorder.borderLeftColor = '#c1d9ff'; //blue
    }

    if (((colIdx+1) % this.props.height) === 0) {
      cellBorder.borderBottomWidth = separatorWidth;
      cellBorder.borderBottomColor = '#c1d9ff';
    } else if (colIdx === 0) {
      cellBorder.borderTopWidth = separatorWidth;
      cellBorder.borderTopColor = '#c1d9ff';
    }

    return cellBorder; // Return the calculated border style for the cell
  }
  
     // Handles selection of a cell
  onSelect = ({ cell, rowIdx, colIdx }) => {
    const { selected } = this.state;

    // Check if the cell is not locked (editable)
    if (!cell.locked) {
      // Update the state to mark this cell as currently selected
      this.setState({ selected: { row: rowIdx, column: colIdx } })
    }
  }

  // Renders the text within a cell
  renderCellText = ({ duplicate, locked, value }) => {
    const { cellText } = styles; // Get cell text style
    let displayValue = (value) ? value : ''; // If value is present, display it; otherwise, it's an empty string

    // Check if the cell is a duplicate
    if (duplicate) {
      // For duplicate cells, apply a pulsating animation to highlight them
      return (
        <Animatable.Text 
          animation="pulseMore" // Use the defined 'pulseMore' animation
          easing="ease-out" 
          iterationCount="infinite" // Loop the animation
          style={cellText}>
          {displayValue}
        </Animatable.Text>
      );
    } else {
      // For non-duplicate cells, display the text normally
      return (
        <Text style={cellText}>
          {displayValue}
        </Text>
      );
    }
  }

  // Combines styles and renders a single cell
  renderCell = ({ cell, rowIdx, colIdx }) => {
    const { value, notes, duplicate, locked, error } = cell;
    const { cellStyle } = styles;

    // Combine various styles based on cell properties (error, duplicate, etc.)
    return (
      <View 
        style={[
          cellStyle, // Base cell style
          this.errorStyle(cell), // Style for errors
          this.duplicateStyle(cell), // Style for duplicates
          this.lockedStyle(cell), // Style for locked cells
          this.selectStyle(rowIdx, colIdx), // Style for selected cell
          this.borderStyle(rowIdx, colIdx) // Border style for 3x3 grid separation
        ]}
      >
        {/* // Render the cell's text content */}
        {this.renderCellText({ duplicate, locked, value })} 
      </View>
    );
  }

  // Renders individual cells within a row
  renderCells({ cell, rowIdx, colIdx }) {
    return (
      <TouchableOpacity 
        style={[
          { flex:1 }, // Flex style to ensure even spacing
          this.borderStyle(rowIdx, colIdx) // Border style for 3x3 grid separation
        ]}
        onPress={() => this.onSelect({ cell, rowIdx, colIdx })} // Handle cell selection on press
        key={colIdx} // Unique key for React's reconciliation process
      >
        {/* // Render the cell with combined styles */}
        {this.renderCell({ cell, rowIdx, colIdx })} 
      </TouchableOpacity>
    );
  }
  
    // Handles the logic when a number is selected from the selector
    selectorPressed = (selectedNumber) => {
      const { selected } = this.state;
      const { width, height } = this.props;
  
      // If a cell is selected, update its value with the selected number
      if (selected !== null) {
        let grid = _.cloneDeep(this.state.grid); // Create a deep copy of the grid to avoid direct state mutation
        grid[selected.row][selected.column].value = selectedNumber;
        this.clearErrors(grid); // Clear any errors before checking again
        this.checkErrors({ grid }); // Check for errors after updating the cell
  
        // If all cells are filled and no errors exist, the puzzle is complete
        if (!this.countItems({ grid, prop: 'value', value: 0 })
          && this.countItems({ grid, prop: 'error', value: 0 }) === Math.pow(width * height, 2))
         this.props.onComplete()
         
        this.setState({ grid }); // Update the state with the new grid
      }
    }
  
    // The main render function for the Board component
    render() {
      const { boardContainer } = styles; // Accessing the boardContainer style defined elsewhere
  
      return (
        // Wrap the entire board in an Animatable.View for the fade-in effect
        <Animatable.View animation="fadeInUp" duration={2000}>
          {/* Main view for the Sudoku board */}
          <View style={boardContainer}>
            {/* Map each row in the state's grid to the renderRow method */}
            {this.state.grid.map((row, rowIdx) => this.renderRow({ row, rowIdx }))}
            {/* This will render each row of the Sudoku board */}
          </View>
  
          {/* Wrap the Selector component in an Animatable.View for an animated effect */}
          <Animatable.View animation="lightSpeedIn" delay={1000}>
            {/* Selector component allows users to select a number to input into the board */}
            <Selector onPress={(selectedNumber) => this.selectorPressed(selectedNumber)}/>
            {/* When a number is pressed in the Selector, selectorPressed method is called */}
          </Animatable.View>
        </Animatable.View>
      );
    }
  }
  
  // Styles for the Board component, defining the layout and visual appearance
  const styles = StyleSheet.create({
    boardContainer: {
      justifyContent: 'flex-start',
      flexDirection: 'row',
      width: 40*9, // Total width based on 9 cells of 40 units each
      height: 40*9 // Total height matching the width for a square aspect ratio
    },
    cellStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: 39, // Width for each cell
      height: 39, // Height for each cell
      borderRadius: 1.5,
      borderWidth: 0.5,
      backgroundColor: '#e5efff', // Background color for cells
      borderColor: '#c1d9ff' // Border color for cells
    },
    cellText: {
      fontSize: 30 // Font size for numbers inside cells
    }
  });