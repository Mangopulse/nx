package com.mangox.newsletterx.helper;

import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.spec.KeySpec;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

public class AuthenticationHelper {
    private static final String TRANSFORMATION = "AES/ECB/PKCS5Padding";
    public static String encrypt(String input, SecretKey secretKey) throws Exception {
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        byte[] encryptedBytes = cipher.doFinal(input.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public static SecretKey generateKeyString() throws Exception {
        String keyString = "CX@NEWSLETTERX.SECRET.LB";
        byte[] keyBytes = keyString.getBytes();
        return deriveKey(keyBytes);
    }

    public static SecretKey deriveKey(byte[] keyBytes) throws Exception {
        // Use PBKDF2 to derive a key from the keyBytes
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        KeySpec spec = new PBEKeySpec(new String(keyBytes, "UTF-8").toCharArray(), new byte[16], 65536, 256);
        SecretKey tmp = factory.generateSecret(spec);
        return new SecretKeySpec(tmp.getEncoded(), "AES");
    }

    public static String decrypt(String input, SecretKey secretKey) throws Exception {
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(input));
        return new String(decryptedBytes, StandardCharsets.UTF_8);
    }

    public static boolean hasExceededOneMinute(String inputDate) {
        LocalDateTime generatedDateTime = LocalDateTime.parse(inputDate, DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        LocalDateTime currentDateTime = LocalDateTime.now();
        long minutesDifference = ChronoUnit.MINUTES.between(generatedDateTime, currentDateTime);
        return minutesDifference > 5;
    }
}
