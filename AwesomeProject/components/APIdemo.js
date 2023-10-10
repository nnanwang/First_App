import React, { useState, useEffect } from 'react';
import { Text, FlatList, View } from 'react-native';

const Movie = ({ title, releaseYear }) => (
    <View style={{backgroundColor:'cyan', margin:20}}>
        <Text>{title}, {releaseYear}</Text>
    </View>
);

const APIdemo = () => {
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(true);

    const getMovies = async () => {
        try {
          const response = await fetch('https://reactnative.dev/movies.json');
          const json = await response.json();
          setData(json.movies); 
        } catch (error) {
          console.error(error);
        } finally {
            setLoading(false);
        }
      };

    useEffect(() => {getMovies()}, [])

    return(
        <View>
            <Text style={{color:'brown', fontSize:30, margin:20, fontWeight:'bold'}}>API Demo</Text>
            
            <FlatList style={{borderRadius: 5, borderWidth: 2, borderColor: 'brown', margin:20}}
                data={data.slice(0,5)}
                keyExtractor={({ id }, index) => id}
                renderItem={({ item }) => (
                    <Movie
                        title={item.title}
                        releaseYear={item.releaseYear}  
                    />
                )}
            />

        </View>
    );
}

export default APIdemo;