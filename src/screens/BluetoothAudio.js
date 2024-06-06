import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, PermissionsAndroid, TouchableOpacity, NativeEventEmitter, NativeModules, Alert } from 'react-native'
import BleManager from 'react-native-ble-manager'
import Styles from '../hooks/Style'

const BluetoothAudio = () => {
    const [currentDevice, setCurrentDevice] = useState(null)
    const [pairedDevices, setPairedDevices] = useState(null)    
    const [bluetoothStatus, setBluetoothStatus] = useState(false)

    const requestPermissions = async () => {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN)
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT)
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE)
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION)
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION)
    }
    
    const getPairedDevices = async () => {
        try {            
            setPairedDevices(await NativeModules.BluetoothModule.getPairedDevices())
        } catch (error) {
            console.error(error)
        }
    }

    const onConnect = async (item, index) => {
        try {
            const result = await NativeModules.BluetoothModule.connectA2DP(item.address)
            setCurrentDevice(item)
            Alert.alert('Status', result)
        } catch (error) {
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

    const renderDevices = ({ item, index }) => {
        return (
            <View style={Styles.devices}>
                <Text style={{ color: 'white' }}>{item.name} - {item.address}</Text>
                <TouchableOpacity onPress={() => item.address === currentDevice?.address ? onDisconnect() : onConnect(item, index)} style={Styles.btnConnect}>
                    <Text>{item.address === currentDevice?.address ? "Desconectar" : "Conectar"}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    useEffect(() => {
        requestPermissions().then(() => {           
            if (!bluetoothStatus) {
                BleManager.enableBluetooth().then(() => {
                    setBluetoothStatus(true)
                    console.log('Bluetooth is turned on!')
                    getPairedDevices()            
                })                        
            }            
        })
    }, [pairedDevices])

    return (
        <View style={Styles.container}>
            <View style={{ width: '70%' }}>
                <Text style={Styles.colorWhite}>Escolha o dispositivo: </Text>
                <FlatList data={pairedDevices}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderDevices}
                />
            </View>
        </View>
    )
}
export default BluetoothAudio
