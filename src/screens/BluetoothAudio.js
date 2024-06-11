import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, PermissionsAndroid, TouchableOpacity, ScrollView, NativeModules, Alert } from 'react-native'
import BleManager from 'react-native-ble-manager'
import Styles from '../hooks/Style'

const BluetoothAudio = () => {
    const [currentDevice, setCurrentDevice] = useState(null)
    const [pairedDevices, setPairedDevices] = useState(null)    
    const [connectedDevices, setConnectedDevices] = useState(null)    
    const [bluetoothStatus, setBluetoothStatus] = useState(false)

    const requestPermissions = async () => {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN)
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT)
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE)
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION)
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_MEDIA_LOCATION)        
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO)                
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO)        
    }
    
    const getDevices = async () => {
        try {            
            setPairedDevices(await NativeModules.BluetoothModule.getPairedDevices())
            setConnectedDevices(await NativeModules.BluetoothModule.getConnectedDevices())
        } catch (error) {
            console.error(error)
        }
    }

    const getDeviceInfo = async (address) => {
        NativeModules.BatteryModule.getBatteryLevel(address, (error, batteryLevel) => {
            if (error) {
                console.error(error);
                return;
            }
            console.log('Battery Level:', batteryLevel);
        });
    }

    const onConnect = async (item, index) => {
        try {
            await NativeModules.BluetoothModule.connectToA2DP(item.address)
            setCurrentDevice(item)
            Alert.alert('Status', 'Conexão OK com o dispositivo: ' + item.address)
            getDeviceInfo(item.address)
        } catch (error) {
            Alert.alert('Status', 'Conexão falhou com o dispositivo: ' + item.address)
            console.error(error)
        }
    }

    const onDisconnect = async () => {
        try {
            const result = await NativeModules.BluetoothModule.disconnectFromA2DP(currentDevice.address)
            setCurrentDevice(null)
            Alert.alert('Status', result)
        } catch (error) {
            console.error(error)
        }
    }
    
    useEffect(() => {
        requestPermissions().then(() => {           
            if (!bluetoothStatus) {
                BleManager.enableBluetooth().then(() => {
                    setBluetoothStatus(true)
                    console.log('Bluetooth is turned on!')
                    getDevices()            
                })                        
            }            
        })        
    }, [pairedDevices, connectedDevices])

    const ShowDevices = (props) => {
        if (props.devices) {
            return (           
                <View style={{ marginTop: 10 }}>
                    <Text style={Styles.colorWhite}>{props.title}</Text>
                    <FlatList scrollEnabled={false} data={props.devices}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => {
                            return (
                                <View style={Styles.devices}>
                                    <Text style={Styles.colorWhite}>{item.name} - {item.address}</Text>
                                    <TouchableOpacity onPress={() => onConnect(item, index)} style={Styles.btnConnect}>
                                        <Text>Utilizar</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                </View>       
            )      
        }         
    }    

    return (
        <View style={Styles.container}>
            <TouchableOpacity onPress={() => getDevices()} style={Styles.btn2}>
                <Text> Recarregar</Text>
            </TouchableOpacity>
            <ScrollView style={{ width: '70%' }}>
                <ShowDevices title={'Dispositivo(s) conectado(s)'} devices={connectedDevices} /> 
                <ShowDevices title={'Pareados anteriormente:'} devices={pairedDevices} />                    
            </ScrollView>                           
        </View>
    )
}

export default BluetoothAudio
