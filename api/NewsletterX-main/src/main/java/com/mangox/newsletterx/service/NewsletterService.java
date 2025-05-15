package com.mangox.newsletterx.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mangox.newsletterx.exception.ErrorException;
import com.mangox.newsletterx.helper.StaticFileHelper;
import com.mangox.newsletterx.model.components.HtmlComponent;
import com.mangox.newsletterx.model.components.ImageConfig;
import com.mangox.newsletterx.model.components.Post;
import com.mangox.newsletterx.model.components.Schedule;
import com.mangox.newsletterx.model.entities.EmailNewsletter;
import com.mangox.newsletterx.model.entities.User;
import com.mangox.newsletterx.model.enums.HtmlComponentType;
import com.mangox.newsletterx.model.newsletter.Newsletter;
import com.mangox.newsletterx.model.newsletter.NewsletterResponse;
import com.mangox.newsletterx.model.newsletter.NewslettersResponse;
import com.mangox.newsletterx.repositories.EmailNewsletterRepository;
import com.mangox.newsletterx.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class NewsletterService {
    private final EmailNewsletterRepository emailNewsletterRepository;

    private static final String IMAGE = "@@IMAGE-";
    private static final String URL = "@@URL-";
    private static final String TITLE = "@@TITLE-";
    private static final String CLOSING = "@@";

    private static final List<String> needsDataEnrichment = Arrays.asList( HtmlComponentType.BASIC_WIDGET.name());


    public String generateHTML(List<HtmlComponent> components, Integer neededPostsCount, List<Post> posts, String unsubscribe, List<String> titles) throws Exception {
        if (posts.isEmpty() || posts.size() != neededPostsCount) throw new ErrorException("Failed to get needed posts ; please check widgets!");
        StringBuilder html = new StringBuilder();

        //Add the container div that will have all the components
        html.append("<div style=\"background-color:#f3f4f6 ;  font-family: Tahoma\"> <br /> <center> <div style=\"width: 600px; max-width:600px\">");

        //looping over the components and appending the content after enrichment
        for (HtmlComponent component : components) {
            if (needsDataEnrichment.contains(component.getType()))
                dataEnrich(component, posts, titles);
            html.append(component.getHtml()).append("<br />");
        }
        //close the container div that will have all the components
        html.append("</div> </center> </div>");
        return html.toString().replaceAll("@@UNSUBSCRIBE_API@@", unsubscribe);
    }

    private void dataEnrich(HtmlComponent component, List<Post> posts, List<String> titles) throws Exception {
        for (int i = 1; i <= component.getExtra().getPostsCount(); i++) {
            if(posts.isEmpty()){
                component.setHtml(" <div style=\"display: none;\">"+component.getHtml()+"</div>");
            }else{
                Post usedPost = posts.getFirst();
                titles.add(usedPost.getTitle());
                component.setHtml(component.getHtml()
                        .replace(IMAGE + i + CLOSING, usedPost.getThumbnail() + imageDimension(component.getExtra().getImageSize()))
                        .replace(TITLE + i + CLOSING, usedPost.getTitle())
                        .replaceAll(URL + i + CLOSING, usedPost.getPublicUrl()));
                posts.removeFirst();
            }

        }
    }

    private String imageDimension(ImageConfig imageConfig) {
        if (imageConfig != null) return "=w" + imageConfig.getWidth() + "-h" + imageConfig.getHeight() + "-c";
        return "";
    }

    @Transactional
    public NewslettersResponse getEmailNewsletters(String website) throws Exception {
        List<EmailNewsletter> websiteEmailNewsletters = emailNewsletterRepository.findByWebsite(website);
        if(websiteEmailNewsletters.isEmpty())
            throw new ErrorException("Failed, The newsletter was not found!");
        return new NewslettersResponse(generateNewsletters(websiteEmailNewsletters));
    }

    @Transactional
    public NewsletterResponse getNewsletter(Long id) throws Exception {
        Optional<EmailNewsletter> emailNewsletter = emailNewsletterRepository.findById(id);
        if(emailNewsletter.isEmpty())
            throw new ErrorException("Email Newsletter with the following ID was not found");
        return new NewsletterResponse(generateNewsletter(emailNewsletter.get()));
    }

    @Transactional
    public NewsletterResponse updateNewsletter(String htmlComponents, Long id, String title) throws Exception {
        Optional<EmailNewsletter> emailNewsletter = emailNewsletterRepository.findById(id);
        if(emailNewsletter.isEmpty())
            throw new ErrorException("Email Newsletter with the following ID was not found");
        EmailNewsletter emailNewsletterObject = emailNewsletter.get();
        emailNewsletterObject.setHtmlComponents(htmlComponents);
        if(title!= null)
            emailNewsletterObject.setTitle(title);
        emailNewsletterObject = emailNewsletterRepository.save(emailNewsletterObject);
        return new NewsletterResponse(generateNewsletter(emailNewsletterObject));
    }

    public NewsletterResponse toggleNewsletter(Long id, boolean state) throws Exception{
        Optional<EmailNewsletter> emailNewsletter = emailNewsletterRepository.findById(id);
        if(emailNewsletter.isEmpty())
            throw new ErrorException("Email Newsletter with the following ID was not found");
        EmailNewsletter emailNewsletterObject = emailNewsletter.get();
        emailNewsletterObject.setActive(state);
        emailNewsletterObject = emailNewsletterRepository.save(emailNewsletterObject);
        return new NewsletterResponse(generateNewsletter(emailNewsletterObject));
    }

    public NewsletterResponse scheduleNewsletter(Long id, String type, String hour, String day) throws Exception {
        Optional<EmailNewsletter> emailNewsletter = emailNewsletterRepository.findById(id);
        if(emailNewsletter.isEmpty())
            throw new ErrorException("Email Newsletter with the following ID was not found");
        //if(type.equals("daily"))
        //    throw new ErrorException("Currently you can't schedule daily newsletters!!");
        EmailNewsletter emailNewsletterObject = emailNewsletter.get();
        emailNewsletterObject.setType(type);
        emailNewsletterObject.setHour(hour);
        emailNewsletterObject.setDay(day == null ? "":day);
        emailNewsletterObject = emailNewsletterRepository.save(emailNewsletterObject);
        return new NewsletterResponse(generateNewsletter(emailNewsletterObject));
    }

    public List<Newsletter> generateNewsletters(List<EmailNewsletter> emailNewsletters) throws JsonProcessingException {
        List<Newsletter> newsletters = new ArrayList<>();
        for(EmailNewsletter newsletter : emailNewsletters)
            newsletters.add(generateNewsletter(newsletter));
        return newsletters;
    }

    public Newsletter generateNewsletter(EmailNewsletter emailNewsletter) throws JsonProcessingException {
        return new Newsletter(emailNewsletter.getId(), emailNewsletter.getWebsite(),emailNewsletter.getTitle(), new ObjectMapper().readValue(emailNewsletter.getHtmlComponents(), List.class), emailNewsletter.isActive(), new Schedule(emailNewsletter.getType(), emailNewsletter.getHour(), emailNewsletter.getDay()));
    }
}
