package com.mangox.newsletterx.helper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.mangox.newsletterx.model.SendGridSender;
import com.mangox.newsletterx.model.components.HtmlComponent;
import com.mangox.newsletterx.model.components.Post;
import com.mangox.newsletterx.model.components.Schedule;
import org.springframework.stereotype.Component;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

@Component
public class GsonHelper {
    private final Gson gson;
    public GsonHelper(){
        this.gson = new Gson();
    }

    public Schedule scheduleDeserialize(String json) {
        return gson.fromJson(json, Schedule.class);
    }


    public List<HtmlComponent> htmlComponentsDeserialize(String jsonArray){
        Type listType = new TypeToken<List<HtmlComponent>>(){}.getType();

        // Convert the JSON array string to a list of MyObject
        return gson.fromJson(jsonArray, listType);
    }

    public List<SendGridSender> sendersDeserialize(String jsonArray){
        Type userListType = new TypeToken<List<SendGridSender>>(){}.getType();

        // Deserialize the JSON array into a List of User objects
        return gson.fromJson(jsonArray, userListType);
    }

    public List<Post> postsDeserialize(String jsonArray){
        Type postListType = new TypeToken<List<Post>>(){}.getType();

        // Deserialize the JSON array into a List of User objects
        return  gson.fromJson(jsonArray, postListType);
    }

    public  SendGridSender senderDeserialize(String json){
        return gson.fromJson(json, SendGridSender.class);
    }

    public static Map generateMap(String object) throws JsonProcessingException {
        return  new ObjectMapper().readValue(object, Map.class);
    }

}
