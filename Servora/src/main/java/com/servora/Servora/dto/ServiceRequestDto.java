package com.servora.Servora.dto;

import com.servora.Servora.enums.Priority;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequestDto {

    @NotBlank(message = "Customer Name is Required")
    private String customerName;

    @NotBlank(message = "Customer Phone is Required")
    private String customerPhone;

    @NotBlank(message = "Issue Description is Required")
    private String issueDescription;

    private Priority priority;

}
