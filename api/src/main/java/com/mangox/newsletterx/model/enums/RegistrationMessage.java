package com.mangox.newsletterx.model.enums;

public enum RegistrationMessage {
    CONFIRMATION_LINK_SENT("A confirmation link has been sent to your email"),
    CONFIRMATION_LINK_RESENT("A confirmation link has been resent to your email"),
    EMAIL_SEND_ERROR("An error occurred while sending the confirmation email"),
    SENDGRID_NOT_CONFIGURED("SendGrid is not configured"),
    REGISTRATION_SUCCESSFUL("Registration successful, please check your email"),
    ACCOUNT_UPDATED("Your account information has been updated, please check your email for a new confirmation link");

    private final String message;

    RegistrationMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
