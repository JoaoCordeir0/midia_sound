import { DarkTheme, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

import LocalAudio from './views/LocalAudio'
import BluetoothAudio from './views/BluetoothAudio'
import SelectMode from './views/SelectMode'

const App = () => {
    return (
        <NavigationContainer theme={DarkTheme}>            
            <Stack.Navigator initialRouteName='Mode'>
                <Stack.Screen name='Mode' component={SelectMode} />
                <Stack.Screen name='Local' component={LocalAudio} options={{ headerShown: false }} />
                <Stack.Screen name='Bluetooth' component={BluetoothAudio} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App