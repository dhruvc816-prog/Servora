package com.servora.Servora.controller;

import com.servora.Servora.dto.APiResponse;
import com.servora.Servora.dto.ServiceRequestResponse;
import com.servora.Servora.service.ServiceRequestService;
import com.servora.Servora.util.AiService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final AiService aiService;
    private final ServiceRequestService serviceRequestService;

    @Data
    static class ChatRequest {
        private String requestId;
        private String question;
    }

    @PostMapping("/status")
    public ResponseEntity<APiResponse<String>> chat(@RequestBody ChatRequest req) {
        ServiceRequestResponse sr = serviceRequestService.findById(req.getRequestId());

        String context = String.format(
                "Service Request Info:\nCustomer: %s\nIssue: %s\nStatus: %s\nPriority: %s\nCreated: %s",
                sr.getCustomerName(),
                sr.getIssueDescription(),
                sr.getStatus(),
                sr.getPriority(),
                sr.getCreatedAt());

        String system = "You are a helpful customer service assistant for Servora. " +
                "Answer customer questions about their service request. Be polite and concise.";

        String reply = aiService.ask(system, context + "\n\nCustomer Question: " + req.getQuestion());
        return ResponseEntity.ok(new APiResponse<>("Chat response", reply));
    }
}
