import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

/* 
   this shows how to import javascript functions
   from a module in the lib folder...
*/
import sq,{cube, circle_area} from '../lib/mymath.js';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!!!</Text>
      <Text> 100 squared = {sq(100)}</Text>
      <Text> 11 cubed = {cube(11)}</Text>
      <Text> the area of a circle of radius 5280 = {circle_area(5280)}</Text>
      <StatusBar style="auto" />
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