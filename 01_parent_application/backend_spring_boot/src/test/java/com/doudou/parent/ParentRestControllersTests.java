package com.doudou.parent;

import com.doudou.parent.controller.*;
import com.doudou.parent.model.*;
import com.doudou.parent.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest({
    AuthController.class,
    ChildProfileController.class,
    StoryCatalogController.class,
    SleepTrackerController.class,
    GatewayBridgeController.class
})
@DisplayName("Tests des Contrôleurs RESTful Spring Boot")
class ParentRestControllersTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private ChildProfileService profileService;

    @MockBean
    private StoryCatalogService catalogService;

    @MockBean
    private SleepTrackerService sleepTrackerService;

    @MockBean
    private GatewayBridgeService gatewayService;

    @Test
    @DisplayName("POST /api/v1/auth/login retourne 200 OK avec token")
    void testAuthEndpoint() throws Exception {
        AuthResponse mockResp = new AuthResponse("PARENT_BEARER_XYZ", "parent@doudou.ai", "AUTHENTICATED", 86400L);
        when(authService.login(any(AuthRequest.class))).thenReturn(mockResp);

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new AuthRequest("parent@doudou.ai", "pwd123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("PARENT_BEARER_XYZ"))
                .andExpect(jsonPath("$.status").value("AUTHENTICATED"));
    }

    @Test
    @DisplayName("GET /api/v1/profile retourne 200 OK avec le profil enfant")
    void testProfileEndpoint() throws Exception {
        ChildProfile mockProfile = new ChildProfile("child_01", "Léa", 4.5, "20:30", List.of("Étoiles"));
        when(profileService.getProfile("default")).thenReturn(mockProfile);

        mockMvc.perform(get("/api/v1/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Léa"))
                .andExpect(jsonPath("$.ageYears").value(4.5));
    }

    @Test
    @DisplayName("GET /api/v1/catalog retourne 200 OK avec la liste des livres")
    void testCatalogEndpoint() throws Exception {
        when(catalogService.listBooks()).thenReturn(List.of(
            new StoryBook("b1", "Livre 1", "Aventure", "3-5", 5, true)
        ));

        mockMvc.perform(get("/api/v1/catalog"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Livre 1"));
    }

    @Test
    @DisplayName("GET /api/v1/sleep/summary retourne 200 OK avec les données COPPA")
    void testSleepEndpoint() throws Exception {
        when(sleepTrackerService.getSleepSummary()).thenReturn(
            new SleepSummary("Dodo paisible", 12.0, null, "COPPA OK")
        );

        mockMvc.perform(get("/api/v1/sleep/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Dodo paisible"));
    }

    @Test
    @DisplayName("POST /api/v1/gateway/open ouvre le canal éphémère")
    void testGatewayEndpoint() throws Exception {
        when(gatewayService.openEphemeralChannel()).thenReturn(true);

        mockMvc.perform(post("/api/v1/gateway/open"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.channelOpen").value(true));
    }
}
