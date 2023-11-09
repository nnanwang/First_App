import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, View, TouchableOpacity } from 'react-native';
import axios from 'axios';
import open_api_key from './open_api_key';

const DictionaryDemo = () => {
    const [definition, setDefinition] = useState('');
    const [word, setWord] = useState('');
    const [loading, setLoading] = useState(false);

    const getDefinition = async () => {
        setLoading(true);
        setDefinition('');

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: `Give a sorrowful definition for the word "${word}"` }],
                    temperature: 0.7
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${open_api_key}`,
                    },
                }
            );
            setDefinition(response.data.choices[0].message.content);
        } catch (error) {
            console.error(error);
            setDefinition('Failed to get the definition. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, margin: 30 }}>
            <Text style={{ color: "darkturquoise", fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>Dictionary Demo</Text>
            <Text style={{ marginBottom: 10 }}>Enter a word:</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gainsboro', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10 }}
                onChangeText={text => setWord(text)}
                value={word}
                placeholder="Type a word here"
                onSubmitEditing={getDefinition}
            />
            <TouchableOpacity
                style={{ backgroundColor: 'darkturquoise', padding: 10, borderRadius: 10, alignItems: 'center' }}
                onPress={getDefinition}
                disabled={loading}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
                    {loading ? 'Searching...' : 'Get Sorrowful Definition'}
                </Text>
            </TouchableOpacity>
            {definition !== '' && (
                <View style={{ backgroundColor: 'honeydew', marginTop: 20, padding: 20 }}>
                    <Text style={{ fontSize: 20, color: 'darkturquoise', textAlign: 'center' }}>
                        Definition:
                    </Text>
                    <Text style={{ backgroundColor: 'white', fontSize: 18, marginTop: 20 }}>
                        {definition}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default DictionaryDemo;

