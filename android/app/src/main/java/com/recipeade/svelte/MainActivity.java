package com.recipeade.svelte;

import android.content.Intent;
import android.os.Bundle;


import androidx.annotation.NonNull;

import com.getcapacitor.BridgeActivity;


import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Response;

public class MainActivity extends BridgeActivity {

    private final HttpConnection conn = HttpConnection.getInstance();
    private String sharedText;

    public String getSharedText(){
        return sharedText;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(ShareExtensionDataPlugin.class);
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        String action = intent.getAction();
        String type = intent.getType();

        if (Intent.ACTION_SEND.equals(action) && type != null){
            sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            sendData(sharedText);
            var plugin = (ShareExtensionDataPlugin)bridge.getPlugin("ShareExtensionDataPlugin").getInstance();
            new IntentHandler(intent, this.getContentResolver(),plugin).handle();
        }

//        String action = intent.getAction();
//        String type = intent.getType();
//
//        if (Intent.ACTION_SEND.equals(action) && type != null) {
//            if("text/plain".equals(type)){
//                String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
//                Log.d("url",sharedText);
//                sendURLInfo(sharedText);
//            }
//        }

    }
    @Override
    protected void onNewIntent(Intent intent){
        super.onNewIntent(intent);
        var plugin = (ShareExtensionDataPlugin) bridge.getPlugin("ShareExtensionDataPlugin").getInstance();
        new IntentHandler(intent,this.getContentResolver(),plugin).handle();
    }


    private void sendData(String url) {
        new Thread(){
            public void run(){
                conn.requestWebServer(url,callback);
            }
        }.start();
    }
    private final Callback callback = new Callback() {
        @Override
        public void onFailure(@NonNull Call call, @NonNull IOException e) {
        }

        @Override
        public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
            String body = response.body().string();
        }
    };
}
