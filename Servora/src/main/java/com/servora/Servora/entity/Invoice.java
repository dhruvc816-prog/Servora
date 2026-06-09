package com.servora.Servora.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.servora.Servora.enums.InvoiceStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
public class Invoice {

    @Id
    private String id = UUID.randomUUID().toString();

    @OneToOne
    @JoinColumn(name = "service_request_id", unique = true)
    private ServiceRequest serviceRequest;

    private BigDecimal amount;
    private InvoiceStatus status = InvoiceStatus.GENERATED;

    private LocalDateTime generatedAt = LocalDateTime.now();
    private LocalDateTime paidAt;

}
