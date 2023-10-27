import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

const PlaceholderImage = require('./assets/background-image.png');

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{ color: 'red' }}>Our First Camera!</Text>
      <View style={styles.imageContainer}>
        <Image source={PlaceholderImage} style={styles.image} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
    justifyContent: 'center',
  },
  image: {
    width: 400,
    height: 580,
    borderRadius: 8,
  },
});
