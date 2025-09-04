package com.mangox.newsletterx.model.components;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    private String id;
    private String title;
    private String date;
    private String publicId;
    private String author;
    private String thumbnail;
    private String summary;
    private String publicUrl;
    private String category;
    private String postType;
}
