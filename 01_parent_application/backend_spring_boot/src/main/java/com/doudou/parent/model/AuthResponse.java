package com.doudou.parent.model;

public record AuthResponse(
    String token,
    String email,
    String status,
    long expiresInSeconds
) {}
