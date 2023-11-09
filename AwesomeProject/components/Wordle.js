import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import words5 from '../assets/words5a.json'

const pick_random_word = () => {
    let random_index = Math.floor(Math.random() * words5.length);

  if (random_index === words5.length) {
    // This line adjusts the index to be within the array bounds, which is redundant
    random_index = random_index - 1;
  }
  return words5[random_index];
};

const App = () => {
  const [word, setWord] = useState(words5[1000]);
  console.log('words5 has length', words5.length);

  const resetWord = () => {
    const randomWord = pick_random_word();
    setWord(randomWord);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Random Word App</Text>
      <Text style={styles.word}>{word}</Text>
      <Button color="royalblue" title="Reset Word" onPress={resetWord} />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'honeydew',
  },
  header: {
    fontSize: 24,
      fontWeight: 'bold',
    color:"slategray",
    marginBottom: 100,
  },
  word: {
      fontSize: 18,
      fontWeight: 'bold',
      backgroundColor: 'lightgreen',
      padding: 50,
      borderRadius: 10,
      borderColor: 'paleturquoise',
      borderWidth: 5,
      marginBottom: 20,
  },
});

export default App;