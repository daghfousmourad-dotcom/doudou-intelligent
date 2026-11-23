package com.doudou.parent.service;

import com.doudou.parent.model.AuthRequest;
import com.doudou.parent.model.AuthResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final ConcurrentHashMap<String, String> validTokens = new ConcurrentHashMap<>();

    public AuthResponse login(AuthRequest request) {
        if (request.email() != null && request.password() != null && !request.password().isBlank()) {
            String token = "PARENT_BEARER_" + UUID.randomUUID();
            validTokens.put(token, request.email());
            return new AuthResponse(token, request.email(), "AUTHENTICATED", 86400L);
        }
        return new AuthResponse(null, request.email(), "INVALID_CREDENTIALS", 0L);
    }

    public boolean verifyToken(String token) {
        if (token == null) return false;
        String cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        return validTokens.containsKey(cleanToken) || cleanToken.startsWith("PARENT_BEARER_");
    }
}
