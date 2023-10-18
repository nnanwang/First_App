import React, { useState, useContext } from 'react';
import { View, Text, Button } from 'react-native';
import UsernameContext from './UsernameContext';

const CoinCount = (props) => {
    const coinName = props.coinName;
    const coinValue = props.coinValue;
    const updateTotal = props.updateTotal;
    const username = useContext(UsernameContext)

    const [value, setValue] = useState(0);

    return (
        <View styke={{
            flex: 1,
            flexDirection: 'row',
            borderWidth: 2,
            borderColor: 'blue'
        }}>
            <Button
                title={coinName}
                onPress={() => {
                    setValue(value + coinValue);
                    updateTotal(coinValue);
                }}
            >    
            </Button>
            <Text> value={value}</Text>
            <Text> owned by {username}</Text>
        </View>
    )
}

export default CoinCount;