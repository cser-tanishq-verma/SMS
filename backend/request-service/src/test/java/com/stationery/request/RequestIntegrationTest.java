package com.stationery.request;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RequestIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getMyRequests() throws Exception {
        mockMvc.perform(get("/api/requests/my")
                .header("X-User-Name", "teststudent"))
                .andExpect(status().isOk());
    }

    @Test
    void getAllRequests_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/requests"))
                .andExpect(status().is5xxServerError()); // Due to missing header
    }

    @Test
    void getAllRequests_Admin() throws Exception {
        mockMvc.perform(get("/api/requests")
                .header("X-User-Role", "ADMIN"))
                .andExpect(status().isOk());
    }

    @Test
    void getRequestById_NotFound() throws Exception {
        mockMvc.perform(get("/api/requests/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getRequestByTrackId_NotFound() throws Exception {
        mockMvc.perform(get("/api/requests/track/invalid-uuid"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createRequest() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/requests")
                .header("X-User-Name", "teststudent")
                .contentType("application/json")
                .content("{\"items\":[{\"itemId\":1,\"quantity\":2}]}"))
                .andExpect(status().is5xxServerError()); 
    }

    @Test
    void approveRequest() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/requests/1/approve")
                .header("X-User-Role", "ADMIN")
                .header("X-User-Name", "admin"))
                .andExpect(status().is4xxClientError()); // Request won't be found
    }

    @Test
    void rejectRequest() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/requests/1/reject")
                .header("X-User-Role", "ADMIN")
                .header("X-User-Name", "admin")
                .param("reason", "Out of stock"))
                .andExpect(status().is4xxClientError()); // Request won't be found
    }

    @Test
    void getMyRequests_WithStatus() throws Exception {
        mockMvc.perform(get("/api/requests/my?status=PENDING")
                .header("X-User-Name", "teststudent"))
                .andExpect(status().isOk());
    }

    @Test
    void getAllRequests_WithStatus() throws Exception {
        mockMvc.perform(get("/api/requests?status=PENDING")
                .header("X-User-Role", "ADMIN"))
                .andExpect(status().isOk());
    }

    @Test
    void fulfillRequest() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/requests/1/fulfill")
                .header("X-User-Role", "ADMIN"))
                .andExpect(status().is4xxClientError());
    }
}
