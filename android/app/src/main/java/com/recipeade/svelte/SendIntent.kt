// IntentHandler.kt
package com.recipeade.svelte

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.PersistableBundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity



//class ShareReceiver : BroadcastReceiver() {
//    override fun onReceive(context: Context, intent: Intent) {
//        val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)
//
//        // 공유된 텍스트가 유효한 URL인지 확인합니다.
//        if (Uri.parse(sharedText).scheme in listOf("http", "https")) {
//            // 여기서 공유된 URL을 처리하거나 다른 작업을 수행할 수 있습니다.
//            Toast.makeText(context, "URL received: $sharedText", Toast.LENGTH_LONG).show()
//        }
//    }
//}

//class ShareActivity : AppCompatActivity() {
//    override fun onCreate(savedInstanceState: Bundle?) {
//        super.onCreate(savedInstanceState)
//
//        val intent = intent
//        val action = intent.action
//
//        if(Intent.ACTION_SEND == action && intent.type?.startsWith("text/") == true){
//            handleSendText(intent)
//        }
//
//        finish()
//    }
//
//    private fun handleSendText(intent: Intent){
//        val sharedText = intent.getStringExtra(Intent.EXTRA_TEXT)
//
//        if(Uri.parse(sharedText).scheme in listOf("http","https")){
//            Toast.makeText(this,"URL received: $sharedText",Toast.LENGTH_LONG).show()
//        }
//    }
//}
