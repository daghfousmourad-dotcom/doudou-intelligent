package com.doudou.parent.controller;

import com.doudou.parent.model.GatewayStatus;
import com.doudou.parent.service.GatewayBridgeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/gateway")
public class GatewayBridgeController {

    private final GatewayBridgeService gatewayService;

    public GatewayBridgeController(GatewayBridgeService gatewayService) {
        this.gatewayService = gatewayService;
    }

    @GetMapping("/status")
    public ResponseEntity<GatewayStatus> getStatus() {
        return ResponseEntity.ok(gatewayService.getStatus());
    }

    @PostMapping("/open")
    public ResponseEntity<Map<String, Object>> openChannel() {
        boolean opened = gatewayService.openEphemeralChannel();
        return ResponseEntity.ok(Map.of("channelOpen", opened));
    }

    @PostMapping("/close")
    public ResponseEntity<Map<String, Object>> closeChannel() {
        gatewayService.closeChannel();
        return ResponseEntity.ok(Map.of("channelOpen", false));
    }
}
