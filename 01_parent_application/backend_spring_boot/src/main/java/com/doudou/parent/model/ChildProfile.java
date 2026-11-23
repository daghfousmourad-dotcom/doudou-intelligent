package com.doudou.parent.model;

import java.util.List;

public record ChildProfile(
    String id,
    String firstName,
    double ageYears,
    String bedtimeHour,
    List<String> favoriteThemes
) {}
