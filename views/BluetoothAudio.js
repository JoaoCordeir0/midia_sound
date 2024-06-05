import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const BluetoothAudio = () => {
    let bleManager = new BleManager()
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);

    // useEffect(() => {
    //     requestPermissions();
    //     return () => {
    //         // bleManager.destroy();
    //     };
    // }, []);

    // const requestPermissions = async () => {
    //     if (Platform.OS === 'android') {
    //         await PermissionsAndroid.requestMultiple([
    //             PermissionsAndroid.PERMISSIONS.BLUETOOTH,
    //             PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
    //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //         ]);
    //     }
    // };

    // const scanDevices = () => {
    //     // bleManager.startDeviceScan(null, null, (error, device) => {
    //     //     if (error) {
    //     //         console.error(error);
    //     //         return;
    //     //     }
    //     //     if (device && !devices.find(d => d.id === device.id)) {
    //     //         setDevices(prevDevices => [...prevDevices, device]);
    //     //     }
    //     // });
    // };

    // const connectToDevice = async (device) => {
    //     try {
    //         const connectedDevice = await bleManager.connectToDevice(device.id);
    //         setSelectedDevice(connectedDevice);
    //         // Aqui, configure as características BLE para receber dados de áudio
    //         // Normalmente, você precisará de características específicas para áudio BLE
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const renderDevice = ({ item }) => (
    //     <Button title={`Conectar a ${item.name}`} onPress={() => connectToDevice(item)} />
    // );

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
    );
};

export default BluetoothAudio;
