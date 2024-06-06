package com.pulse_music

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothProfile
import android.bluetooth.BluetoothA2dp
import android.content.Context
import androidx.annotation.NonNull
import com.facebook.react.bridge.*
import java.lang.reflect.Method

class BluetoothModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
    private var bluetoothA2dp: BluetoothA2dp? = null
    private val context: Context = reactContext

    override fun getName(): String {
        return "BluetoothModule"
    }

    @ReactMethod
    fun connectA2DP(deviceAddress: String, promise: Promise) {
        val device: BluetoothDevice? = bluetoothAdapter?.getRemoteDevice(deviceAddress)
        if (device == null) {
            promise.reject("DEVICE_NOT_FOUND", "Dispositivo não encontrado")
            return
        }

        bluetoothAdapter?.getProfileProxy(context, object : BluetoothProfile.ServiceListener {
            override fun onServiceConnected(profile: Int, proxy: BluetoothProfile) {
                bluetoothA2dp = proxy as BluetoothA2dp
                try {
                    val connectMethod: Method = BluetoothA2dp::class.java.getDeclaredMethod("connect", BluetoothDevice::class.java)
                    connectMethod.isAccessible = true
                    connectMethod.invoke(bluetoothA2dp, device)
                    promise.resolve("Conectado ao dispositivo " + deviceAddress + " A2DP")
                } catch (e: Exception) {
                    promise.reject("CONNECT_FAILED", "Falha ao conectar ao dispositivo A2DP", e)
                }
            }

            override fun onServiceDisconnected(profile: Int) {
                bluetoothA2dp = null
            }
        }, BluetoothProfile.A2DP)
    }

    @ReactMethod
    fun getPairedDevices(promise: Promise) {
        val pairedDevices: Set<BluetoothDevice>? = bluetoothAdapter?.bondedDevices
        val deviceList = Arguments.createArray()

        pairedDevices?.forEach { device ->
            val deviceMap = Arguments.createMap()
            deviceMap.putString("name", device.name)
            deviceMap.putString("address", device.address)
            deviceList.pushMap(deviceMap)
        }

        promise.resolve(deviceList)
    }   

    @ReactMethod
    fun disconnectFromA2DP(deviceAddress: String, promise: Promise) {
        val device = bluetoothAdapter?.getRemoteDevice(deviceAddress)
        if (device != null && bluetoothA2dp != null) {
            val disconnectMethod = bluetoothA2dp!!.javaClass.getMethod("disconnect", BluetoothDevice::class.java)
            disconnectMethod.invoke(bluetoothA2dp, device)
            promise.resolve("Desconectado do dispositivo " + deviceAddress + " A2DP")
        } else {
            promise.reject("Error", "Dispositivo A2DP não dispónivel")
        }
    }
}
