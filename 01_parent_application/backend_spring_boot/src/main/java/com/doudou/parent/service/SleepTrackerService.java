package com.doudou.parent.service;

import com.doudou.parent.model.SleepLog;
import com.doudou.parent.model.SleepSummary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SleepTrackerService {

    private final List<SleepLog> sleepLogs = new CopyOnWriteArrayList<>();

    public SleepTrackerService() {
        sleepLogs.add(new SleepLog(
            "Hier soir",
            "Le Mystère des Étoiles Scintillantes",
            "20:30",
            "20:42",
            12.0,
            "Très calme et apaisée",
            false
        ));
    }

    public SleepSummary getSleepSummary() {
        SleepLog latest = sleepLogs.isEmpty() ? null : sleepLogs.get(sleepLogs.size() - 1);
        double avgLatency = sleepLogs.stream().mapToDouble(SleepLog::sleepLatencyMin).average().orElse(12.0);
        return new SleepSummary(
            "Dodo paisible",
            avgLatency,
            latest,
            "Conforme COPPA & RGPD-K : Aucun enregistrement sonore n'est conservé."
        );
    }

    public void logSleepSession(double latencyMin, boolean comfortNeeded) {
        sleepLogs.add(new SleepLog(
            "Ce soir",
            "Conte du soir",
            "20:30",
            "20:45",
            latencyMin,
            "Calme et réparatrice",
            comfortNeeded
        ));
    }
}
