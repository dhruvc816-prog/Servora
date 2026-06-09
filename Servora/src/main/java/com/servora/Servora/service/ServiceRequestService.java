package com.servora.Servora.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.servora.Servora.dto.AssignedTechnician;
import com.servora.Servora.dto.ServiceRequestDto;
import com.servora.Servora.dto.ServiceRequestResponse;
import com.servora.Servora.dto.UpdateServiceStatus;
import com.servora.Servora.entity.ServiceRequest;
import com.servora.Servora.entity.User;
import com.servora.Servora.enums.Priority;
import com.servora.Servora.enums.ServiceStatus;
import com.servora.Servora.exception.ResourceNotFoundException;
import com.servora.Servora.repo.ServiceRequestRepo;
import com.servora.Servora.repo.UserRepo;
import com.servora.Servora.util.AiService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceRequestService {

    private final ServiceRequestRepo requestRepo;
    private final UserRepo userRepo;
    private final AiService aiService;

    public ServiceRequestResponse create(ServiceRequestDto dto, String adminEmail) {
        User admin = userRepo.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        Priority priority = dto.getPriority() != null
                ? dto.getPriority()
                : suggestPriority(dto.getIssueDescription());

        ServiceRequest sr = new ServiceRequest();
        sr.setCustomerName(dto.getCustomerName());
        sr.setCustomerPhone(dto.getCustomerPhone());
        sr.setIssueDescription(dto.getIssueDescription());
        sr.setPriority(priority);
        sr.setCreatedBy(admin);

        return toResponse(requestRepo.save(sr));
    }

    public ServiceRequestResponse customerCreate(ServiceRequestDto dto) {
        Priority priority = dto.getPriority() != null
                ? dto.getPriority()
                : suggestPriority(dto.getIssueDescription());

        ServiceRequest sr = new ServiceRequest();
        sr.setCustomerName(dto.getCustomerName());
        sr.setCustomerPhone(dto.getCustomerPhone());
        sr.setIssueDescription(dto.getIssueDescription());
        sr.setPriority(priority);
        // createdBy null — customer ne banaya

        return toResponse(requestRepo.save(sr));
    }

    public ServiceRequestResponse assignTechnician(String requestId, AssignedTechnician dto) {
        ServiceRequest sr = requestRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        User tech = userRepo.findById(dto.getTechnicianUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));

        sr.setAssignedTo(tech);
        sr.setStatus(ServiceStatus.ASSIGNED);

        return toResponse(requestRepo.save(sr));
    }

    public ServiceRequestResponse updateStatus(String requestId, UpdateServiceStatus dto, String techEmail) {
        ServiceRequest sr = requestRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        User tech = userRepo.findByEmail(techEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (dto.getStatus() == ServiceStatus.IN_PROGRESS) {
            long activeJobs = requestRepo.countByAssignedToAndStatus(tech, ServiceStatus.IN_PROGRESS);
            if (activeJobs >= 1)
                throw new RuntimeException("You can only have 1 job in progress at a time");
        }

        sr.setStatus(dto.getStatus());
        return toResponse(requestRepo.save(sr));
    }

    public ServiceRequestResponse cancel(String requestId) {
        ServiceRequest sr = requestRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        sr.setStatus(ServiceStatus.CANCELLED);
        return toResponse(requestRepo.save(sr));
    }

    public List<ServiceRequestResponse> getAll() {
        return requestRepo.findAll().stream().map(this::toResponse).toList();
    }

    public ServiceRequestResponse findById(String id) {
        return toResponse(requestRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest not found: " + id)));
    }

    public List<ServiceRequestResponse> getByTechnician(String techEmail) {
        User tech = userRepo.findByEmail(techEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));
        return requestRepo.findByAssignedTo(tech).stream().map(this::toResponse).toList();
    }

    public String summarizeIssue(String requestId) {
        ServiceRequest sr = requestRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        String system = "You are a technical assistant. Summarize the issue in 2-3 lines for a technician. Be concise and technical.";
        return aiService.ask(system, sr.getIssueDescription());
    }

    private Priority suggestPriority(String description) {
        String system = "You are a service operations assistant. Based on the issue description, return ONLY one word: LOW, MEDIUM, HIGH, or URGENT. Nothing else.";
        String response = aiService.ask(system, description).trim().toUpperCase();
        try {
            return Priority.valueOf(response);
        } catch (Exception e) {
            return Priority.MEDIUM;
        }
    }

    private ServiceRequestResponse toResponse(ServiceRequest sr) {
        return ServiceRequestResponse.builder()
                .id(sr.getId())
                .customerName(sr.getCustomerName())
                .customerPhone(sr.getCustomerPhone())
                .issueDescription(sr.getIssueDescription())
                .priority(sr.getPriority())
                .status(sr.getStatus())
                .createdBy(
                        sr.getCreatedBy() != null
                                ? sr.getCreatedBy().getEmail()
                                : null)
                .assignedTo(
                        sr.getAssignedTo() != null
                                ? sr.getAssignedTo().getEmail()
                                : null)
                .createdAt(sr.getCreatedAt())
                .updatedAt(sr.getUpdatedAt())
                .build();
    }
}
