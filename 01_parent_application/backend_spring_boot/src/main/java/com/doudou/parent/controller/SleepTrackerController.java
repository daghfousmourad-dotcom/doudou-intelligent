package com.doudou.parent.controller;

import com.doudou.parent.model.SleepSummary;
import com.doudou.parent.service.SleepTrackerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/sleep")
public class SleepTrackerController {

    private final SleepTrackerService sleepTrackerService;

    public SleepTrackerController(SleepTrackerService sleepTrackerService) {
        this.sleepTrackerService = sleepTrackerService;
    }

    @GetMapping("/summary")
    public ResponseEntity<SleepSummary> getSummary() {
        return ResponseEntity.ok(sleepTrackerService.getSleepSummary());
    }

    @PostMapping("/log")
    public ResponseEntity<Map<String, String>> logSession(@RequestParam double latencyMin, @RequestParam(defaultValue = "false") boolean comfortNeeded) {
        sleepTrackerService.logSleepSession(latencyMin, comfortNeeded);
        return ResponseEntity.ok(Map.of("status", "recorded"));
    }
}
