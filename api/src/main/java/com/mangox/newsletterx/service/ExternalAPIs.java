package com.mangox.newsletterx.service;

import com.mangox.newsletterx.exception.ErrorException;
import com.squareup.okhttp.OkHttpClient;
import com.squareup.okhttp.Request;
import com.squareup.okhttp.Response;
import com.squareup.okhttp.ResponseBody;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExternalAPIs {
    private final OkHttpClient client;

    public ExternalAPIs() {
        this.client = new OkHttpClient();
    }


    public JSONObject getRecommendedPosts(String appDomain, Integer size, String userId) throws Exception {
        Request request = new Request.Builder()
                .url("https://mdn-search.mangopulse.net/mangopulse/event/trending?clientId=almayadeen&size="+size+"&type=article")
                .build();
        Response response = client.newCall(request).execute();
        if (response.isSuccessful()) {
            ResponseBody responseBody = response.body();
            if (responseBody != null) {
                String responseString = responseBody.string();
                JSONObject jsonResponse = new JSONObject(responseString);
                return jsonResponse;
            }
        }
        throw new ErrorException("Failed to get Data");
    }
}

