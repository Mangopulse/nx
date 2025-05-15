package com.mangox.newsletterx.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mangox.newsletterx.exception.ErrorException;
import com.mangox.newsletterx.model.entities.ConfirmationToken;
import com.mangox.newsletterx.model.entities.User;
import com.mangox.newsletterx.model.request.ChangePasswordRequest;
import com.mangox.newsletterx.model.responses.UserResponse;
import com.mangox.newsletterx.repositories.ConfirmationTokenRepository;
import com.mangox.newsletterx.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final ConfirmationTokenRepository confirmationTokenRepo;
    private final UserRepository userRepository;
    private static final String EMPTY_ARRAY = "[]";

    public UserResponse changePassword(ChangePasswordRequest request, Principal connectedUser) throws JsonProcessingException {

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("The current password you entered is wrong");
        }

        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user = userRepository.save(user);

        // save the new password
        return UserResponse.builder()
                .email(user.getEmail())
                .website(user.getWebsite())
                .enabled(user.isEnabled())
                .walkthrough(new ObjectMapper().readValue(Objects.nonNull(user.getWalkthrough())?user.getWalkthrough():EMPTY_ARRAY, List.class))
                .build();
    }

    public UserResponse resetPassword(String token, String password) throws Exception {
        if(token == null || token.isEmpty())
            throw new ErrorException("The token is invalid");
        Optional<ConfirmationToken> optConfirmationToken = confirmationTokenRepo.findByToken(token);
        if(optConfirmationToken.isEmpty())
            throw new ErrorException("The token is not found");
        ConfirmationToken confirmationTokens = optConfirmationToken.get();
        if(confirmationTokens.isResetPasswordTokenExpired())
            throw new ErrorException("The Token is expired !");

        Optional<User> userResult = userRepository.findById(confirmationTokens.getUser().getId());
        if (userResult.isEmpty())
            throw new ErrorException("The user not found !");
        User user = userResult.get();
        user.setPassword(passwordEncoder.encode(password));
        user = userRepository.save(user);

        // save the new password
        return UserResponse.builder()
                .email(user.getEmail())
                .website(user.getWebsite())
                .enabled(user.isEnabled())
                .walkthrough(new ObjectMapper().readValue(Objects.nonNull(user.getWalkthrough())?user.getWalkthrough():EMPTY_ARRAY, List.class))
                .build();
    }

    public UserResponse updateWalkthrough(User user, String walkthrough) throws ErrorException {
        if(user == null)
            throw new ErrorException("User not found !");
        try{
            user.setWalkthrough(walkthrough);
            user = userRepository.save(user);
            return UserResponse.builder()
                    .email(user.getEmail())
                    .website(user.getWebsite())
                    .enabled(user.isEnabled())
                    .walkthrough(new ObjectMapper().readValue(Objects.nonNull(user.getWalkthrough())?user.getWalkthrough():EMPTY_ARRAY, List.class))
                    .build();
        }catch (Exception e){
            throw new ErrorException("failed to update user walkthrough !");
        }
    }
}
