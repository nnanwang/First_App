// Import the axios module for making HTTP requests
// Import the axios module for making HTTP requests
const axios = require('axios');

// Define a function to get the latitude and longitude for a given address
// The function queries the U.S. Census Bureau's geocoding service
const get_latlon = async (address) => {
    // Encode the address to be URL-safe
    address = encodeURI(address);

    // Construct the URL for the geocoding request
    let url="https://geocoding.geo.census.gov/geocoder"+
              "/locations/onelineaddress"+
              "?address="+address+
              "&benchmark=2020"+
              "&format=json";

    // Log the constructed URL for debugging
    console.log('url=',url);

    // Fetch the response from the geocoding service
    let response = await fetch(url);

    // Parse the response as JSON
    let json = await response.json();

    // Return the matched addresses from the response
    return json.result.addressMatches;
}

// Define a function to get the weather forecast URL for a given latitude and longitude
// The function queries the U.S. National Weather Service's API
const get_forecastURL = async (latlon) => {
  // Construct the URL for the forecast request
  let url = "https://api.weather.gov/points/"+
              latlon.y+","+latlon.x;

  // Use axios to make the HTTP GET request
  const response = await axios.get(url);

  // Return the forecast URL from the response
  return response.data.properties.forecast;
}

// Define a function to get the weather forecast for a given address
const get_weather = async (address) => {
  // First, get the latitude and longitude for the address
  const matches = await get_latlon(address);

  // Check if there are no matches found for the address
  if (matches.length==0) {
    // Return an empty array if no matches found
    return ([]);
  } else {
    // If a match is found, get the forecast URL using the matched coordinates
    const url = await get_forecastURL(matches[0].coordinates);

    // Use axios to fetch the weather data from the forecast URL
    const response = await axios.get(url);

    // Return the weather forecast data
    return (response.data.properties.periods);
  }
}

// Export the functions to be used in other parts of the application
export {get_latlon, get_forecastURL,  get_weather};
