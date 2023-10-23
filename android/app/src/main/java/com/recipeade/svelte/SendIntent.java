package com.recipeade.svelte;

import android.content.ContentResolver;
import android.content.Intent;
import android.util.Log;

import java.io.IOException;

class IntentHandler{
    private Intent intent;
    private ContentResolver contentResolver;
    private ShareExtensionDataPlugin plugin;

    public IntentHandler(Intent intent, ContentResolver contentResolver,ShareExtensionDataPlugin plugin){
        this.intent = intent;
        this.contentResolver = contentResolver;
        this.plugin = plugin;
    }

    void handle(){
        String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
        if (sharedText == null){
            Log.e("Capacitor share","Invalid url");
            return;
        }

        try {
            plugin.notifyUrl(sharedText);
        }
        finally {
            return;
        }

    }
}

