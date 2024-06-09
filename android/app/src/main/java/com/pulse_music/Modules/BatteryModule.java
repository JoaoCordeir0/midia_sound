package com.pulse_music.modules;

import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;
import java.util.UUID;

public class BatteryModule extends ReactContextBaseJavaModule {

    private static final String TAG = "BatteryModule";
    private final ReactApplicationContext reactContext;
    private final BluetoothManager bluetoothManager;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    public BatteryModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        this.bluetoothManager = (BluetoothManager) reactContext.getSystemService(Context.BLUETOOTH_SERVICE);
    }

    @Override
    public String getName() {
        return "BatteryModule";
    }

    @ReactMethod
    public void getBatteryLevel(String deviceAddress, Callback callback) {
        if (bluetoothManager == null) {
            Log.e(TAG, "BluetoothManager not available.");
            return;
        }

        BluetoothGatt bluetoothGatt = bluetoothManager.getAdapter().getRemoteDevice(deviceAddress).connectGatt(reactContext, false, new BluetoothGattCallback(callback));
        mainHandler.postDelayed(() -> bluetoothGatt.disconnect(), 10000);
    }

    private void runOnUiThread(Runnable runnable) {
        mainHandler.post(runnable);
    }

    private class BluetoothGattCallback extends android.bluetooth.BluetoothGattCallback {

        private final Callback callback;

        public BluetoothGattCallback(Callback callback) {
            this.callback = callback;
        }

        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            if (newState == BluetoothGatt.STATE_CONNECTED) {
                gatt.discoverServices();
            }
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            List<BluetoothGattService> services = gatt.getServices();
            Log.d(TAG, "Services discovered: " + services.size());

            for (BluetoothGattService service : services) {
                Log.d(TAG, "Service UUID: " + service.getUuid().toString());
                if (service.getUuid().equals(UUID.fromString(BatteryServiceUUID))) {
                    BluetoothGattCharacteristic batteryLevelCharacteristic = service.getCharacteristic(UUID.fromString(BatteryLevelCharacteristicUUID));
                    if (batteryLevelCharacteristic != null) {
                        gatt.readCharacteristic(batteryLevelCharacteristic);
                    } else {
                        Log.e(TAG, "Battery level characteristic not found.");
                        runOnUiThread(() -> callback.invoke("Battery level characteristic not found.", null));
                        gatt.disconnect();
                    }
                    return;
                }
            }

            Log.e(TAG, "Battery service not found.");
            runOnUiThread(() -> callback.invoke("Battery service not found.", null));
            gatt.disconnect();
        }

        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                byte[] value = characteristic.getValue();
                int batteryLevel = value[0];
                runOnUiThread(() -> callback.invoke(null, batteryLevel));
                gatt.disconnect();
            } else {
                Log.e(TAG, "Failed to read battery level.");
                runOnUiThread(() -> callback.invoke("Failed to read battery level.", null));
                gatt.disconnect();
            }
        }
    }

    // UUIDs for Battery Service and Battery Level characteristic
    private static final String BatteryServiceUUID = "0000180f-0000-1000-8000-00805f9b34fb";
    private static final String BatteryLevelCharacteristicUUID = "00002a19-0000-1000-8000-00805f9b34fb";
}
