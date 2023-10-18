import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackDemo from './components/StackDemo';
import ImportDemo from './components/ImportDemo';


export default function App() {
  return (
    
    <View style={{flex:1}}>
      <Text  style={{textAlign:'center',fontSize:40}}>Math</Text>
      <ImportDemo />
   
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
