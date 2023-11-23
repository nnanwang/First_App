import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// Define a component named Selector which extends the React.Component class
export default class Selector extends React.Component {
  // Define a component named Selector which extends the React.Component class
  constructor(props) {
    // 'super' is used to call the constructor of the parent class (React.Component)
    super(props);
  }

    // Define a method for rendering individual buttons
  renderButton({ number, index, label }) {
        // Destructure to get styles for button container and cell text
    const { buttonContainer, cellText } = styles;
        // Return a Touchable component that will respond to touch events
    return (
      <TouchableOpacity 
      // Assign a unique key for React to identify each element in a list uniquely
        key={index} 
        // Define an onPress event handler
        onPress={() => this.props.onPress(number)}
      >
        {/* View container for the button */}
        <View style={buttonContainer}>
        {/* Text inside the button */}
          <Text style={cellText}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  // Define the render method which outputs the component UI
  render() {
    // Destructure to get styles for the selector row
    const { selectorRow } = styles;
    // Return the view structure of the component
    return (
      <View>
        {/* First row of buttons */}
        <View style={selectorRow}>
         {/* Generate buttons with numbers 1-4 using Array.map */}
          {[...Array(4).keys()].map((number, index) => this.renderButton({ number: ++number, index, label: number }))}
          
        {/* Add a button with label 'C' for clear or cancel */}
          {this.renderButton({ number: 0, index: 99, label: 'C' })}
        </View>
        
        {/* // Second row of buttons */}
        <View style={selectorRow}>
        {/* Generate buttons with numbers 5-9 using Array.map */}
        {[...Array(9).keys()].splice(4).map((number, index) => this.renderButton({ number: ++number, index, label: number }))}
      </View>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  selectorRow: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: 40*9,
    height: 40,
    marginTop: 15
  },
  buttonContainer: {
    flex:1,
    backgroundColor: '#e5efff',
    borderRadius: 2.5,
    borderWidth: 1.5,
    borderColor: '#c1d9ff',
    width: 63,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 30
  }
});