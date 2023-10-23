package com.recipeade.svelte;


import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.net.URISyntaxException;

@CapacitorPlugin(name = "ShareExtensionDataPlugin")
public class ShareExtensionDataPlugin extends Plugin {

    public void notifyUrl(String url){
        JSObject ret = new JSObject();
        ret.put("url",url);
        notifyListeners("shared_text_uri_recevied",ret);
    }

//    @PluginMethod()
//    void read(PluginCall call)
//    {
//        try{
//            Intent intent = Intent.getIntentOld(null);
//            String uri = intent.getStringExtra(Intent.EXTRA_TEXT);
//
//            JSObject ret = new JSObject();
//            ret.put("url",uri);
//            call.resolve(ret);
//        }
//        catch (URISyntaxException e){
//            e.printStackTrace();
//        }
//    }
}




//@CapacitorPlugin(name = "ShareExtensionDataPlugin")

//class ShareExtensionDataPlugin : Plugin(){
//        fun notifyUrl(uri: String){
//        val ret = JSObject()
//        ret.put("url",uri)
//        notifyListeners("shared_text_uri_received",ret)
//        }
//
//@PluginMethod()
//    fun read (call: PluginCall){
//            val intent : Intent = getIntentOld(null)
//
//            val uri = intent.getStringExtra(Intent.EXTRA_TEXT)
//
//            val ret = JSObject()
//            ret.put("url",uri)
//            call.resolve(ret)
//            }
//            }