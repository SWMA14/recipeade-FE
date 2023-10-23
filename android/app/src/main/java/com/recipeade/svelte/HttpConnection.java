package com.recipeade.svelte;

import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;

public class HttpConnection {
    private OkHttpClient okHttpClient;
    private static HttpConnection instance = new HttpConnection();
    public static HttpConnection getInstance() {
        return instance;
    }

    public HttpConnection() {
        this.okHttpClient = new OkHttpClient();
    }

    public void requestWebServer(String url, Callback callback) {
        Request request = new Request.Builder()
                .url("https://recipeade.net/customize/create_default?sourceLink" + url)
                .get()
                .build();
        okHttpClient.newCall(request).enqueue(callback);
    }

}
