import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackDemo from './components/StackDemo';
import ImportDemo from './components/ImportDemo';
import Pomodoros from './components/Pomodoros';
import WeatherDemo from './components/WeatherDemo';
import GPTdemo from './components/GPTdemo';
import BMIdemo from './components/BMIdemo';
import DictionaryDemo from './components/DictionaryDemo';
import Wordle from './components/Wordle';

export default function App() {
  return (
    
    <View style={{flex:1}}>
      <Text  style={{textAlign:'center',fontSize:40}}>First App</Text>
      <Wordle />
   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

