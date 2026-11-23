package com.doudou.parent.controller;

import com.doudou.parent.model.AuthRequest;
import com.doudou.parent.model.AuthResponse;
import com.doudou.parent.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        if (response.token() == null) {
            return ResponseEntity.status(401).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(@RequestHeader(value = "Authorization", required = false) String token) {
        boolean valid = authService.verifyToken(token);
        return ResponseEntity.ok(Map.of("valid", valid));
    }
}
