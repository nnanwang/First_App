import React, { useState, useEffect } from 'react';
import { Text, Button, TextInput, View } from 'react-native';

// Define the APIdemo component
const APIdemo = () => {

    // State variables for storing API data, forecast details, loading status, and user-inputted lat-long coordinates
    const [data,setData] = useState([]);
    const [forecast,setForecast] = useState([]);
    const [loading,setLoading] = useState(true);
    const [latlonText,setLatLonText] = useState("");
    const [latlon,setLatLon] = useState("42.3,-71.1");

    // Function to fetch JSON data for a given URL
    const getJSON = async (url) => {
        try {
            console.log("In getJSON, url = "+url);
            const response = await fetch(url);
            const json = await response.json();
            console.log("In getJSON, got this: ");
            console.dir(json);
            return json;  // Returning the fetched JSON data
        } catch (error) {
            console.error(error);
        }
    };

    // Function to fetch the weather data based on latitude and longitude
    const getWeather = async () => {
        const getData = async () => {
            try {
                // Fetch data for the provided lat-long coordinates
                const d = await getJSON("https://api.weather.gov/points/" + latlon);
                setData(d);

                // Fetch forecast details using the forecast URL from the first API response
                const f = await getJSON(d.properties.forecast);
                setForecast(f.properties.periods);

            } catch (error) {
                console.error("Error fetching weather data:", error);
            } finally {
                setLoading(false);  // Set loading to false regardless of success or failure
            }
        };
        
        await getData();  // Call the internal asynchronous function to fetch data
    };

    // Using the useEffect hook to re-fetch the weather data whenever the latlon state changes
    useEffect(() => {getWeather()}, [latlon])

    // Render the component
    return(
        <View style={{flex:1, margin:50, padding:10, backgroundColor:'palegreen', borderRadius:5}}>
            <Text style={{fontSize:40, textAlign:'center'}}>Weather Demo</Text>
            <View style={{margin:100, padding:10}}>
                {/* Conditional rendering based on the loading state */}
                {loading ? 
                    <Text>Loading...</Text> 
                    :
                    <>
                        <Text>Enter your latitude and longitude, separated by a comma</Text>
                        <TextInput 
                            style={{marginTop:10, color:'gray', padding: 5, fontStyle:"italic" ,backgroundColor:"white", marginBottom:10, fontSize:20, borderRadius:5, borderWidth:2, borderColor:'black'}}
                            placeholder="42.3,-71.1"
                            onChangeText={text => setLatLonText(text)}
                            value={latlonText}
                        />
                        
                        <Button
                            color="black"
                            onPress={() => {
                                console.log("Setting latlon to:", latlonText);
                                setLatLon(latlonText);  // Set the latlon state with user's input
                            }}
                            title="Get Weather"
                        />
                        
                        <Text style={{fontSize:45, marginTop:50, fontWeight:600, marginBottom:15, color:'dodgerblue', textAlign:'center'}}>{forecast[0].name}'s Weather</Text>
                        <Text 
                            style={{fontSize:40, padding:50, color:'dodgerblue', backgroundColor:'lightcyan', borderRadius:10}}>
                            {forecast[0].detailedForecast}
                        </Text>

                        {/* Conditional rendering for debugging info (always evaluates to false, so "............." will always be rendered) */}
                        {false? 
                            <>
                             <Text>{latlonText}</Text>
                             <Text>{latlon}</Text>
                             <Text>{JSON.stringify(data)}</Text>
                             <Text style={{backgroundColor:'yellow'}}>
                                {JSON.stringify(forecast[0])}
                            </Text>
                            </>:
                            "............."}
                    </>
                }
            </View>
        </View>
    );
}

// Exporting the APIdemo component for use in other parts of the application
export default APIdemo;
