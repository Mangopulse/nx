package com.mangox.newsletterx.service.sender;

import com.mangox.newsletterx.helper.GsonHelper;
import com.mangox.newsletterx.model.components.Post;
import com.mangox.newsletterx.service.ExternalAPIs;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final ExternalAPIs externalAPIs;
    private final GsonHelper gsonHelper;

    public List<Post> getPostResponse(String appDomain, Integer postsCount, String userId) throws Exception {

        JSONObject postsResponseObject = externalAPIs.getRecommendedPosts(appDomain, postsCount, userId);
        return deserialize(postsResponseObject);
    }

    private List<Post> deserialize(JSONObject widgetsResponseObject){
        if(widgetsResponseObject.has("data"))
            return gsonHelper.postsDeserialize(widgetsResponseObject.getJSONArray("data").toString());
        return null;
    }
}
