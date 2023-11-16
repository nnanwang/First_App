import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, Button } from 'react-native';
import words5 from '../assets/words5a';
import {pick_random_word,analyze_guess} from '../lib/words';
import GuessList from '../components/GuessList';
import WordleButton from '../components/WordleButton';



// Main App component.
const App = () => {
  // State variables for game management.
  const [word, setWord] = useState(pick_random_word(words5)); // Random word for the game.
  const [guessNum, setGuessNum] = useState(0); // Number of guesses made.
  const [guess, setGuess] = useState(""); // Current guess.
  const [gameOver, setGameOver] = useState(false); // Game over state.
  const [guesses, setGuesses] = useState([]); // Array of guesses made.
  const [debugging, setDebugging] = useState(false);  // Debugging mode state.
  const [hint, setHint] = useState(null);

// Function to generate a hint for the Wordle game.
const generateHint = () => {
  // Split the secret word into individual letters and filter out those letters
  // that have not been correctly guessed at their respective positions in any of the guesses.
  let unguessedLetters = word.split('').filter((letter, index) => {
 
      return !guesses.some(guess => guess[index] === letter);
  });

  // Check if there are any unguessed letters left.
  if (unguessedLetters.length > 0) {
      // If there are, pick one at random.
      // Generate a random index based on the length of the unguessed letters array.
      let randomIndex = Math.floor(Math.random() * unguessedLetters.length);
      // Update the hint state with the randomly selected unguessed letter.
      setHint(unguessedLetters[randomIndex]);
  } else {
      // If there are no unguessed letters left, alert the user that no more hints are available.
      alert("No more hints available!");
  }
};


const generateHint2 = () => {
  // Create an array of hint candidates, consisting of letters and their positions
  // in the secret word that have not yet been guessed correctly.
  let hintCandidates = word.split('').map((letter, index) => {
      // Check if the letter at this position has not been correctly guessed in any of the guesses.
      return guesses.every(guess => guess[index] !== letter) ? { letter, index } : null;
  }).filter(item => item !== null);  // Filter out null values to keep only valid hint candidates.

  // Check if there are any valid hint candidates.
  if (hintCandidates.length > 0) {
      // If there are, randomly select one candidate as the hint.
      let randomIndex = Math.floor(Math.random() * hintCandidates.length);
      // Update the hint state with the chosen letter and its position.
      setHint(hintCandidates[randomIndex]);
    } else {
    setHint(null); // or set to a default value if preferred

      // If there are no valid hint candidates, inform the player that no more hints are available.
      alert("No more hints available!");
  }
};


  // Console log for debugging purposes.
  // console.log('words5 has length', words5.length);

  // Function to validate the guess length.
  const validateGuess = (guess) => {
    return guess.length == 5;
  };

  // Main render method for the component.
  return (
    <SafeAreaView style={styles.container}>
      {/* Displaying the header text */}
      <Text style={styles.header}>Wordle App</Text>

      {/* Conditional rendering based on game over state */}
      {gameOver ?
        // Display reset button when the game is over.
        <WordleButton title="Reset" onPress={() => {
          setWord(pick_random_word(words5));
          setGuesses([]);
          setGuessNum(0);
          setGuess(''); // Clear guess box.
          setGameOver(false);
          setHint(null);
        }} />
        : 
        // Display game interface when the game is not over.
        <>
          <Text style={{ fontSize: 20 }}> Make a guess </Text>
          <View>
            {/* Text input for entering guesses */}
            <TextInput
              style={{
                width: 200, fontSize: 30,
                textAlign: 'center',
                fontFamily: 'Courier New',
                borderColor: 'gray', borderWidth: 1, borderRadius: 5,
                backgroundColor: '#fff',
                margin:10

              }}
              autoCapitalize='none'
              onChangeText={text => setGuess(text)}
              value={guess}
            />
          </View>

          {/* Button to check the guess */}
          <WordleButton
            title="Check Guess"
            onPress={() => {
              // Logic to handle the action when the guess check button is pressed.
          
              // Convert the guess to lowercase and compare it to the secret word.
              if (guess.toLowerCase() == word) {
                  // If the guess is correct:
                  // 1. Add the current guess to the list of guesses.
                  setGuesses(guesses.concat(guess));
                  // 2. Show an alert indicating that the word has been correctly guessed,
                  //    and display the number of guesses taken.
                  alert('You guessed the word ' + word + ' in ' + (guessNum + 1) + ((guessNum == 0) ? ' guess' : ' guesses'));
                  // 3. Increment the number of guesses.
                  setGuessNum(guessNum + 1);
                  // 4. Set the game over state to true.
                  setGameOver(true);
              } 
              // Check if the guess is a valid word by seeing if it exists in the words5 list.
              else if (!words5.includes(guess.toLowerCase())) {
                  // If the guess is not a valid word, show an alert message asking the user to try again.
                  alert('Your guess is not a valid word. Please try again.');
              } 
              // Check if the maximum number of guesses (5) has been reached and the guess is still incorrect.
              else if (guessNum == 5 && guess != word) {
                  // If so, show an alert indicating the game is over and reveal the correct word.
                  alert('You have already submitted the maximum number of guesses. The word was ' + word);
                  // Set the game over state to true.
                  setGameOver(true);
                  // Add the current guess to the list of guesses.
                  setGuesses(guesses.concat(guess));
              } 
              else {
                  // For any other case (an incorrect guess that is a valid word and within the guess limit):
                  // 1. Add the current guess to the list of guesses.
                  setGuesses(guesses.concat(guess));
                  // 2. Increment the number of guesses.
                  setGuessNum(guessNum + 1);
              }
              // After handling the guess, clear the guess input field for the next guess.
              setGuess(''); 
          }}
          
          />

          {/* / Button to generate a hint */}

          <WordleButton title="Get a Hint" onPress={generateHint} />
          {hint && <Text>Hint: One of the letters is '{hint}'</Text>}


          {/* Displaying the clue for the current guess */}
          <Text> {guess} clue ='{analyze_guess(word, guess)}' </Text>
        </>
      }

      {/* Displaying the list of guesses */}
      <GuessList word={word} guesses={guesses} />

      {/* Debugging feature to show or hide the correct word */}
      {debugging ? <Text style={styles.word}>word is {word}</Text> : ""}
      <Button color="orange" title={debugging ? "hide answer" : "show answer"} onPress={() => setDebugging(!debugging)} />
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 30,
    margin:15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'seashell',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  word: {
    fontSize: 18,
  },
});

export default App;  