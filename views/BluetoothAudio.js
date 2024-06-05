import React, { useState, useEffect } from 'react'
import { View, Text, Button, FlatList, PermissionsAndroid, Platform, Alert } from 'react-native'
import { BleManager } from 'react-native-ble-manager'

const BluetoothAudio = () => {
    const [devices, setDevices] = useState([])
    const [selectedDevice, setSelectedDevice] = useState(null)

    const requestPermissions = async () => {
        try {
            if (Platform.OS === 'android') {
                await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
                ])
            }
        } catch (err) {
            console.warn(err)
        }
    }

    const bluetoothStart = async () => {             
        BleManager.start({ showAlert: true }).then(() => {
            console.log('BleManager initialized');
            handleGetConnectedDevices();
        });
    }

    const handleGetConnectedDevices = () => {
        BleManager.getConnectedPeripherals([]).then(results => {
            if (results.length === 0) {
                Alert.alert('Bluetooth error', 'Nenhum dispositivo pareado', [                    
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
            } else {
                for (let i = 0; i < results.length; i++) {
                    let peripheral = results[i];
                    peripheral.connected = true;
                    peripherals.set(peripheral.id, peripheral);
                    setDevices(Array.from(peripherals.values()));
                }
            }
        });
    };

    useEffect(() => {
        requestPermissions()
        bluetoothStart()    
        return () => {
            // bleManager.destroy()
        }
    }, [])

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Scanear Dispositivos" />
            {/* <FlatList
                data={devices}
                keyExtractor={item => item.id}
                renderItem={renderDevice}
            />
            {selectedDevice && <Text>Conectado a: {selectedDevice.name}</Text>} */}
        </View>
    )
}
export default BluetoothAudio;
