package com.doudou.parent.controller;

import com.doudou.parent.model.ChildProfile;
import com.doudou.parent.service.ChildProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
public class ChildProfileController {

    private final ChildProfileService profileService;

    public ChildProfileController(ChildProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ChildProfile> getDefaultProfile() {
        return ResponseEntity.ok(profileService.getProfile("default"));
    }

    @PutMapping
    public ResponseEntity<ChildProfile> updateProfile(@RequestBody ChildProfile updatedProfile) {
        return ResponseEntity.ok(profileService.updateProfile("default", updatedProfile));
    }
}
