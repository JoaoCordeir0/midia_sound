import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import SelectMode from './src/screens/SelectMode'
import LocalAudio from './src/screens/LocalAudio';
import BluetoothAudio from './src/screens/BluetoothAudio';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer theme={DarkTheme}>
            <Stack.Navigator>
                <Stack.Screen name="SelectMode" component={SelectMode} options={{title: 'Bem vindo ao Pulse Music'}} />
                <Stack.Screen name="Local" component={LocalAudio} options={{title: 'Musicas locais'}} />
                <Stack.Screen name="Bluetooth" component={BluetoothAudio} options={{title: 'Musicas bluetooth'}} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App