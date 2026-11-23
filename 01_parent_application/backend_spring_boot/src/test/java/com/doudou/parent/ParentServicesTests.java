package com.doudou.parent;

import com.doudou.parent.model.*;
import com.doudou.parent.service.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Tests Unitaires des Microservices Backend Parents (Java)")
class ParentServicesTests {

    @Test
    @DisplayName("Authentification du parent avec mot de passe valide")
    void testAuthService() {
        AuthService authService = new AuthService();
        AuthResponse resp = authService.login(new AuthRequest("parent@doudou.ai", "ParentSecurise2026!"));

        assertNotNull(resp.token());
        assertEquals("AUTHENTICATED", resp.status());
        assertTrue(authService.verifyToken(resp.token()));
    }

    @Test
    @DisplayName("Gestion et mise à jour du profil enfant")
    void testChildProfileService() {
        ChildProfileService profileService = new ChildProfileService();
        ChildProfile profile = profileService.getProfile("default");

        assertNotNull(profile);
        assertEquals("Léa", profile.firstName());
        assertEquals(4.5, profile.ageYears());

        ChildProfile updated = profileService.updateProfile("default", new ChildProfile(
            "child_lea_01", "Léa", 5.0, "20:45", List.of("Étoiles", "Dinosaures")
        ));
        assertEquals(5.0, updated.ageYears());
    }

    @Test
    @DisplayName("Consultation et bascule d'état d'un conte de la bibliothèque")
    void testStoryCatalogService() {
        StoryCatalogService catalogService = new StoryCatalogService();
        List<StoryBook> books = catalogService.listBooks();

        assertTrue(books.size() >= 3);
        StoryBook b1 = catalogService.getBook("book_01");
        assertNotNull(b1);
        assertTrue(b1.installedOnToy());

        StoryBook toggled = catalogService.toggleBookInstallation("book_01");
        assertNotNull(toggled);
        assertFalse(toggled.installedOnToy());
    }

    @Test
    @DisplayName("Journal de sommeil et synthèse conforme COPPA")
    void testSleepTrackerService() {
        SleepTrackerService sleepService = new SleepTrackerService();
        sleepService.logSleepSession(14.0, false);
        SleepSummary summary = sleepService.getSleepSummary();

        assertNotNull(summary);
        assertEquals("Dodo paisible", summary.status());
        assertTrue(summary.averageTimeToSleepMin() > 0);
        assertTrue(summary.privacyNotice().contains("COPPA"));
    }

    @Test
    @DisplayName("Passerelle éphémère Air-Gap vers la peluche")
    void testGatewayBridgeService() {
        GatewayBridgeService gatewayService = new GatewayBridgeService();

        assertTrue(gatewayService.openEphemeralChannel());
        assertTrue(gatewayService.isChannelOpen());

        gatewayService.closeChannel();
        assertFalse(gatewayService.isChannelOpen());

        GatewayStatus status = gatewayService.getStatus();
        assertNotNull(status);
        assertFalse(status.channelOpen());
    }
}
