package com.pulse_music.modules;

import android.content.Context;
import android.media.AudioManager;
import android.media.MediaMetadata;
import android.media.session.MediaController;
import android.media.session.MediaSessionManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import java.util.List;

public class AudioModule extends ReactContextBaseJavaModule {

    private static final String TAG = "AudioModule";
    private MediaSessionManager mediaSessionManager;
    private AudioManager audioManager;

    public AudioModule(ReactApplicationContext reactContext) {
        super(reactContext);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            mediaSessionManager = (MediaSessionManager) reactContext.getSystemService(Context.MEDIA_SESSION_SERVICE);
            audioManager = (AudioManager) reactContext.getSystemService(Context.AUDIO_SERVICE);
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "AudioModule";
    }

    @ReactMethod
    public void getCurrentAudio(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            List<MediaController> controllers = mediaSessionManager.getActiveSessions(null);
            for (MediaController controller : controllers) {
                MediaMetadata metadata = controller.getMetadata();
                if (metadata != null) {
                    WritableMap audioInfo = Arguments.createMap();
                    audioInfo.putString("title", metadata.getString(MediaMetadata.METADATA_KEY_TITLE));
                    audioInfo.putString("artist", metadata.getString(MediaMetadata.METADATA_KEY_ARTIST));
                    audioInfo.putString("album", metadata.getString(MediaMetadata.METADATA_KEY_ALBUM));
                    audioInfo.putString("url", metadata.getString(MediaMetadata.METADATA_KEY_MEDIA_URI));
                    promise.resolve(audioInfo);
                    return;
                }
            }
            promise.reject("NoActiveAudio", "No active audio found");
        } else {
            promise.reject("NotSupported", "This feature is not supported on devices below Lollipop");
        }
    }
}
