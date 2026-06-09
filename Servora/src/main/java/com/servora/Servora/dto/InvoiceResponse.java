package com.servora.Servora.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.servora.Servora.enums.InvoiceStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {

    private String id;
    private String serviceRequestId;
    private BigDecimal amount;
    private InvoiceStatus status;
    private LocalDateTime generatedAt;
    private LocalDateTime paidAt;

}
