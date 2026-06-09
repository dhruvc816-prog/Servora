package com.servora.Servora.dto;

import java.time.LocalDateTime;

import com.servora.Servora.enums.Priority;
import com.servora.Servora.enums.ServiceStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequestResponse {

    private String id;
    private String customerName;
    private String customerPhone;
    private String customerDescription;
    private String issueDescription;
    private Priority priority;
    private ServiceStatus status;
    private String createdBy;
    private String assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
