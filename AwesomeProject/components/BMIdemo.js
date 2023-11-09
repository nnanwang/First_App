import React, { useState, createContext, useContext } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Create a context to share state (profile data) across different components.
const ProfileContext = createContext();

// Profile component where users can view and edit their profile information.
const Profile = () => {
      // useContext hook to access and modify the shared state (profile data).
  const [currentValue, setCurrentValue] = useContext(ProfileContext);

      // useState hook to manage the editable draft values in the TextInput fields.
  const [draftValue, setDraftValue] = useState(currentValue);
  
      // Function to update the shared state with the draft values.
  const handleSaveProfile = () => setCurrentValue(draftValue);
  // The UI for the Profile component with Text and TextInput fields.
    // It shows the current values and allows users to edit them.
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {/* Display the current value as a JSON string for debugging purposes */}

        <Text style={{ textAlign: 'left', marginHorizontal: 20 }}>currentValue = {JSON.stringify(currentValue)}</Text>
  
        <View style={{ marginHorizontal: 70 }}>
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Name:</Text>
            <TextInput 
              style={{height: 30, backgroundColor: '#9CF094', flex: 0.5, marginLeft: 10}}
              onChangeText={text => setDraftValue({...draftValue, name: text})}
              value={draftValue.name}
            />
          </View>
  
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Age:</Text>
            <TextInput 
              style={{height: 30, backgroundColor: '#B7D6E5', flex: 0.5, marginLeft: 10}}
              onChangeText={text => setDraftValue({...draftValue, age: text})}
              value={draftValue.age}
            />
          </View>
  
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Weight:</Text>
            <TextInput 
              style={{height: 30, backgroundColor: '#F7C2CA', flex: 0.5, marginLeft: 10}}
              onChangeText={text => setDraftValue({...draftValue, weight: text})}
              value={draftValue.weight}
            />
          </View>
  
          <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>Height:</Text>
            <TextInput 
              style={{height: 30, backgroundColor: '#6EFBFE', flex: 0.5, marginLeft: 10}}
              onChangeText={text => setDraftValue({...draftValue, height: text})}
              value={draftValue.height}
            />
          </View>
        </View>
  
        <View style={{ marginBottom: 0 }}>
          <Button title="SAVE PROFILE" onPress={handleSaveProfile} />
        </View>
      </View>
    );
  };
  
  
  
// BMI component which calculates and displays the user's Body Mass Index.
const BMI = () => {
      // Access the shared profile data.
  const [currentValue] = useContext(ProfileContext);
  // Calculate BMI using the weight and height from the profile.
    // It's displayed only if both weight and height are available.
    // ... (BMI calculation and rendering logic)
    const bmi = (parseFloat(currentValue.weight) / Math.pow(parseFloat(currentValue.height), 2) * 703).toFixed(4);
  // parseFloat(currentValue.height) -  converts it into a floating-point number (i.e., a number with decimals if present)
    return (
      <View>
        <Text>BMI Calculator</Text>
        <Text>height: {currentValue.height || "Please enter your height in the profile page."}</Text>
        <Text>weight: {currentValue.weight || "Please enter your weight in the profile page."}</Text>
        <Text>bmi: {isNaN(bmi) ? "Please enter your weight and height in the profile page." : bmi}</Text>
      </View>
    );
  };
  
// Age component which calculates and displays the user's age in weeks and days.
const Age = () => {
      // Access the shared profile data.
  const [currentValue] = useContext(ProfileContext);
  // Calculate age in weeks and days using the age from the profile.
    // It's displayed only if the age is provided.
    // ... (Age calculation and rendering logic)
  const weeks = (parseFloat(currentValue.age) * 52.143).toFixed(2);
  // toFixed(2) The method rounds the number to two decimal places
    const days = (parseFloat(currentValue.age) * 365.25).toFixed(2);
  
    return (
      <View>
        <Text>Age Calculator</Text>
        <Text>age in years: {currentValue.age || "Please enter your age in the profile page."}</Text>
        <Text>age in weeks: {isNaN(weeks) ? "Please enter your age in the profile page." : weeks}</Text>
        <Text>age in days: {isNaN(days) ? "Please enter your age in the profile page." : days}</Text>
      </View>
    );
  };

  // Create the tab navigator which allows switching between the Profile, Age, and BMI screens.
const Tab = createBottomTabNavigator();

export default function App() {
  // useState to manage the profile state at the top-level of the application.
    // This state will be shared across components using the ProfileContext.Provider.
    const profileState = useState({
      name: '',
      age: '',
      weight: '',
      height: '',
    });
  
  return (
      // Wrapping the application in NavigationContainer and ProfileContext.Provider.
    // This setup allows navigation and shared state to be accessible in the entire app.
      <ProfileContext.Provider value={profileState}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Profile" component={Profile} />
            <Tab.Screen name="Age" component={Age} />
            <Tab.Screen name="BMI" component={BMI} />
          </Tab.Navigator>
        </NavigationContainer>
      </ProfileContext.Provider>
    );
  }
