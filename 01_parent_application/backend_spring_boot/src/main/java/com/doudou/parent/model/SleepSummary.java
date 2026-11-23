package com.doudou.parent.model;

public record SleepSummary(
    String status,
    double averageTimeToSleepMin,
    SleepLog latestLog,
    String privacyNotice
) {}
