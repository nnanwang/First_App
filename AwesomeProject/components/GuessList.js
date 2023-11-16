// Importing necessary modules from React and React Native.
import React from 'react';
import { View, Text, FlatList } from 'react-native';
// Importing functions for guess analysis and converting word to a list from a local file.
import { analyze_guess, word2list } from '../lib/words';

// Component to display a single guess.
const Guess = ({ word, guess, hint }) => {
    // Analyze the guess to get clues.
    const clue = analyze_guess(word, guess);
    // Define color codes for different clue types.
    const color = { '+': 'lightgreen', '-': 'yellow', '.': 'white', 'hint': 'lightblue' };

    return (
        <View style={{ flex: 1, flexDirection: 'row', margin: 0, padding: 2 }}>
            {/* Map each letter in the guess to a Text component with color based on the clue */}
            {word2list(guess).map((letter, index) => (
                <Text key={index}
                    style={{
                        backgroundColor: letter === hint ? color['hint'] : color[clue[index]],
                        fontSize: 30,
                        fontFamily: 'Courier New',
                        borderWidth: 1,
                        borderColor: 'black',
                        padding: 5,
                        margin: 0,
                    }}>
                    {letter}
                </Text>
            ))}
        </View>
    );
};

// Main component to display the list of guesses.
const GuessList = ({ word, guesses, hint }) => {
    return (
        <FlatList
            data={guesses}
            keyExtractor={(item, index) => index.toString()} // Extracting unique keys for list items.
            renderItem={({ item }) => (
                // Render a Guess component for each item in the list.
                <Guess word={word} guess={item} hint={hint} />
            )}
        />
    );
};

// Exporting the GuessList component.
export default GuessList;
