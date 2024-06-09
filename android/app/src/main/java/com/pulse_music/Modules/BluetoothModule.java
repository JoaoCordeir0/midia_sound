package com.pulse_music.modules;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.BluetoothA2dp;
import android.content.Context;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Set;

public class BluetoothModule extends ReactContextBaseJavaModule {

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothA2dp bluetoothA2dp;

    public BluetoothModule(ReactApplicationContext reactContext) {
        super(reactContext);
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    @NonNull
    @Override
    public String getName() {
        return "BluetoothModule";
    }

    @ReactMethod
    public void getPairedDevices(Promise promise) {
        if (bluetoothAdapter == null) {
            promise.reject("Error", "Bluetooth not supported on this device");
            return;
        }

        Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
        WritableArray deviceList = Arguments.createArray();

        if (pairedDevices.size() > 0) {
            for (BluetoothDevice device : pairedDevices) {
                WritableMap deviceMap = Arguments.createMap();
                deviceMap.putString("name", device.getName());
                deviceMap.putString("address", device.getAddress());
                deviceList.pushMap(deviceMap);
            }
        }

        promise.resolve(deviceList);
    }

    @ReactMethod
    public void getConnectedDevices(Promise promise) {
        bluetoothAdapter.getProfileProxy(getReactApplicationContext(), new BluetoothProfile.ServiceListener() {
            @Override
            public void onServiceConnected(int profile, BluetoothProfile proxy) {
                if (profile == BluetoothProfile.A2DP) {
                    bluetoothA2dp = (BluetoothA2dp) proxy;
                    List<BluetoothDevice> connectedDevices = bluetoothA2dp.getConnectedDevices();
                    WritableArray deviceList = Arguments.createArray();
                    for (BluetoothDevice device : connectedDevices) {
                        WritableMap deviceMap = Arguments.createMap();
                        deviceMap.putString("name", device.getName());
                        deviceMap.putString("address", device.getAddress());
                        deviceList.pushMap(deviceMap);
                    }
                    promise.resolve(deviceList);
                }
            }

            @Override
            public void onServiceDisconnected(int profile) {
                if (profile == BluetoothProfile.A2DP) {
                    bluetoothA2dp = null;
                }
            }
        }, BluetoothProfile.A2DP);                
    }

    @ReactMethod
    public void getBondedDevices(Promise promise) {
        try {
            Set<BluetoothDevice> bondedDevices = bluetoothAdapter.getBondedDevices();
            WritableArray deviceList = Arguments.createArray();
            for (BluetoothDevice device : bondedDevices) {
                WritableMap deviceMap = Arguments.createMap();
                deviceMap.putString("name", device.getName());
                deviceMap.putString("address", device.getAddress());
                deviceList.pushMap(deviceMap);
            }
            promise.resolve(deviceList);
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }

    @ReactMethod
    public void connectToA2DP(String deviceAddress, Promise promise) {
        BluetoothDevice device = bluetoothAdapter.getRemoteDevice(deviceAddress);
        if (device != null && bluetoothA2dp != null) {
            try {
                Method connectMethod = bluetoothA2dp.getClass().getMethod("connect", BluetoothDevice.class);
                connectMethod.invoke(bluetoothA2dp, device);
                promise.resolve("Device connected to A2DP");
            } catch (Exception e) {
                promise.reject("Error", e.getMessage());
            }
        } else {
            promise.reject("Error", "Device or A2DP not available");
        }
    }

    @ReactMethod
    public void disconnectFromA2DP(String deviceAddress, Promise promise) {
        BluetoothDevice device = bluetoothAdapter.getRemoteDevice(deviceAddress);
        if (device != null && bluetoothA2dp != null) {
            try {
                Method disconnectMethod = bluetoothA2dp.getClass().getMethod("disconnect", BluetoothDevice.class);
                disconnectMethod.invoke(bluetoothA2dp, device);
                promise.resolve("Device disconnected from A2DP");
            } catch (Exception e) {
                promise.reject("Error", e.getMessage());
            }
        } else {
            promise.reject("Error", "Device or A2DP not available");
        }
    }
}