package com.doudou.parent.model;

public record StoryBook(
    String id,
    String title,
    String category,
    String targetAge,
    int durationMinutes,
    boolean installedOnToy
) {}
