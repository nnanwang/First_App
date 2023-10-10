import * as React from 'react';
import {Button,Text,View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CountChange from './CountChange';
// import KeyPad from './KeyPad';

const Stack = createNativeStackNavigator();

const HomeScreen = ({navigation}) => {
    return (
     <View style={{flexDirection:'row', justifyContent:"space-evenly"}}>
            <Button
                title="Go to Tim's profile"
                onPress={() =>
                navigation.navigate('Profile', {name: 'Tim'})
                }
            />
            <Button
                title="Count Change"
                onPress={() =>
                navigation.navigate('CountChange') 
                }
            />
            {/* <Button
                title="Key Pad"
                onPress={() =>
                navigation.navigate('KeyPad') 
                }
            /> */}
      </View>
    );
  };
  const ProfileScreen = ({navigation, route}) => {
    return <Text>This is {route.params.name}'s profile</Text>;
  };

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CountChange" component={CountChange} />
        {/* <Stack.Screen name="KeyPad" component={KeyPad} />       */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;