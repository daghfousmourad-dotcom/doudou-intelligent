package com.doudou.parent.service;

import com.doudou.parent.model.ChildProfile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChildProfileService {

    private final ConcurrentHashMap<String, ChildProfile> profiles = new ConcurrentHashMap<>();

    public ChildProfileService() {
        profiles.put("default", new ChildProfile(
            "child_lea_01",
            "Léa",
            4.5,
            "20:30",
            List.of("Étoiles", "Animaux de la forêt", "Aventures douces")
        ));
    }

    public ChildProfile getProfile(String id) {
        return profiles.getOrDefault(id, profiles.get("default"));
    }

    public ChildProfile updateProfile(String id, ChildProfile updated) {
        ChildProfile current = getProfile(id);
        ChildProfile merged = new ChildProfile(
            current.id(),
            updated.firstName() != null ? updated.firstName() : current.firstName(),
            updated.ageYears() > 0 ? updated.ageYears() : current.ageYears(),
            updated.bedtimeHour() != null ? updated.bedtimeHour() : current.bedtimeHour(),
            updated.favoriteThemes() != null ? updated.favoriteThemes() : current.favoriteThemes()
        );
        profiles.put(id, merged);
        return merged;
    }
}
