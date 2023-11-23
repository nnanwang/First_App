// Import statements to include necessary modules and components
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable'; // For adding animations
import Board from './Board'; // Importing the Board component
import config from '../assets/config.json'; // Importing game configuration, which contains levels

// Styles for the game's components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfdff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStyle: {
    fontSize: 25,
    marginBottom: 10
  },
  endGameStyle: {
    fontSize: 40
  }
});

// Game class component definition
// Game extends Component, which is a class from the React library 
// that allows you to create a stateful component:
export default class Game extends Component {
  // The constructor is a special method for creating and initializing an object created with a class.
  constructor(props) {
    super(props); // A call to the constructor of the parent class (Component). This is required before using 'this'.
    // 'this.state' is an object where you store property values that belongs to the component.
    // When the state object changes (e.g., when a level is completed), the component re-renders.
    this.state = { levelNo: 0, level: config.levels[0] }; // 'levelNo' is set to 0, meaning the first level.
    // 'level' is set to the first element of the 'levels' array from the 'config' object.
    // This 'config' object would typically be defined outside this snippet and contain game configuration details such as level data.
  }

  // Function to change the current level
  levelChange = ({ levelNo, level }) => {
    this.setState({ levelNo, level });
  }

  // Render method of the Game component
  render() {
    const { container, titleStyle, endGameStyle } = styles; // Destructuring for easier access to styles
    const { levelNo, level } = this.state; // Destructuring state for current level number and details

    // Checking if the game is completed
    if (levelNo === config.levels.length) {
      return (
        // Displaying the end game message
        <View style={container}>
          <Animatable.Text
            style={endGameStyle}
            animation="rubberBand" 
            easing="ease-out" 
            iterationCount="infinite"
            duration={6000}
          >
            Congratulations!
          </Animatable.Text>
        </View>
      );
    } else {
      return (
        // Rendering the game board for the current level
        <View style={container}>
          <Animatable.Text 
            style={titleStyle}
            animation="bounceInDown"
            delay={1500}
            duration={1500}
          >
            Level {levelNo + 1}
          </Animatable.Text>

          {/* // Board component with props for width, height, current level, and completion handler */}
          <Board 
        width={3} // Set the width of each 3x3 grid within the Sudoku board
        height={3} // Set the height of each 3x3 grid within the Sudoku board
        level={level} // Pass the current level data to the Board
        onComplete={() => this.levelChange({ 
          levelNo: levelNo + 1, // Increment the level number when the current level is completed
          level: config.levels[levelNo + 1] // Load the next level from the config
        })}
      />

        </View>
      );
    }
  }
}