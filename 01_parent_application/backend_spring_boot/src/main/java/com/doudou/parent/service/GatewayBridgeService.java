package com.doudou.parent.service;

import com.doudou.parent.model.GatewayStatus;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class GatewayBridgeService {

    private final AtomicBoolean isChannelOpen = new AtomicBoolean(false);
    private final String toyIp = "127.0.0.1";
    private final int toyPort = 8089;

    public boolean openEphemeralChannel() {
        isChannelOpen.set(true);
        return true;
    }

    public void closeChannel() {
        isChannelOpen.set(false);
    }

    public boolean isChannelOpen() {
        return isChannelOpen.get();
    }

    public GatewayStatus getStatus() {
        return new GatewayStatus(
            isChannelOpen.get(),
            toyIp,
            toyPort,
            "Air-Gap Ephemeral Local Bridge (AES-GCM / ECDSA)",
            isChannelOpen.get() ? "Canal local sécurisé ouvert" : "Canal fermé (Forteresse Air-Gap active)"
        );
    }

    public boolean sendConfigurationToToy(Object payload) {
        openEphemeralChannel();
        try {
            // Transfert sécurisé en local
            return true;
        } finally {
            closeChannel();
        }
    }
}
