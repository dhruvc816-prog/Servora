package com.servora.Servora.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.servora.Servora.dto.APiResponse;
import com.servora.Servora.dto.AssignedTechnician;
import com.servora.Servora.dto.ServiceRequestDto;
import com.servora.Servora.dto.ServiceRequestResponse;
import com.servora.Servora.dto.UpdateServiceStatus;
import com.servora.Servora.service.ServiceRequestService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class ServiceRequestController {
    private final ServiceRequestService serviceRequestService;

    @PostMapping
    public ResponseEntity<APiResponse<ServiceRequestResponse>> create(@Valid @RequestBody ServiceRequestDto dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(new APiResponse<>("Request created", serviceRequestService.create(dto, email)));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<APiResponse<ServiceRequestResponse>> assign(
            @PathVariable String id,
            @RequestBody AssignedTechnician dto) {
        return ResponseEntity
                .ok(new APiResponse<>("Technician assigned", serviceRequestService.assignTechnician(id, dto)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<APiResponse<ServiceRequestResponse>> updateStatus(
            @PathVariable String id, @RequestBody UpdateServiceStatus dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity
                .ok(new APiResponse<>("Status updated", serviceRequestService.updateStatus(id, dto, email)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<APiResponse<ServiceRequestResponse>> cancel(@PathVariable String id) {
        return ResponseEntity.ok(new APiResponse<>("Request cancelled", serviceRequestService.cancel(id)));
    }

    @GetMapping
    public ResponseEntity<APiResponse<List<ServiceRequestResponse>>> getAll() {
        return ResponseEntity.ok(new APiResponse<>("All requests", serviceRequestService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<APiResponse<ServiceRequestResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(new APiResponse<>("Request fetched", serviceRequestService.findById(id)));
    }

    @GetMapping("/my")
    public ResponseEntity<APiResponse<List<ServiceRequestResponse>>> getMyJobs() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(new APiResponse<>("My jobs", serviceRequestService.getByTechnician(email)));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<APiResponse<String>> getSummary(@PathVariable String id) {
        return ResponseEntity.ok(new APiResponse<>("Issue summary",
                serviceRequestService.summarizeIssue(id)));
    }

    @PostMapping("/customer")
    public ResponseEntity<APiResponse<ServiceRequestResponse>> customerCreate(
            @Valid @RequestBody ServiceRequestDto dto) {
        ServiceRequestResponse sr = serviceRequestService.customerCreate(dto);
        return ResponseEntity.ok(new APiResponse<>("Request submitted", sr));
    }

}
