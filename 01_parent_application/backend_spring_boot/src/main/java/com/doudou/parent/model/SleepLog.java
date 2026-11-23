package com.doudou.parent.model;

public record SleepLog(
    String date,
    String storyRead,
    String timeStarted,
    String timeAsleep,
    double sleepLatencyMin,
    String nightQuality,
    boolean comfortNeeded
) {}
