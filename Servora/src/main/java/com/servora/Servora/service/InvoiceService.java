package com.servora.Servora.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.servora.Servora.dto.CreateInvoiceDto;
import com.servora.Servora.dto.InvoiceResponse;
import com.servora.Servora.entity.Invoice;
import com.servora.Servora.entity.ServiceRequest;
import com.servora.Servora.enums.InvoiceStatus;
import com.servora.Servora.enums.ServiceStatus;
import com.servora.Servora.exception.ResourceNotFoundException;
import com.servora.Servora.repo.InvoiceRepo;
import com.servora.Servora.repo.ServiceRequestRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final ServiceRequestRepo requestRepo;
    private final InvoiceRepo invoiceRepo;

    public InvoiceResponse create(String requestId, CreateInvoiceDto dto) {
        ServiceRequest sr = requestRepo.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceRequest not found"));

        if (sr.getStatus() != ServiceStatus.COMPLETED)
            throw new RuntimeException("Invoice only for COMPLETED requests");

        if (invoiceRepo.findByServiceRequest(sr).isPresent())
            throw new RuntimeException("Invoice already exists for this request");

        Invoice invoice = new Invoice();
        invoice.setServiceRequest(sr);
        invoice.setAmount(dto.getAmount());

        return toResponse(invoiceRepo.save(invoice));
    }

    public InvoiceResponse markPaid(String invoiceId) {
        Invoice invoice = findEntityById(invoiceId);
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());
        invoice.getServiceRequest().setStatus(ServiceStatus.PAID);
        requestRepo.save(invoice.getServiceRequest());
        return toResponse(invoiceRepo.save(invoice));
    }

    public InvoiceResponse markUnpaid(String invoiceId) {
        Invoice invoice = findEntityById(invoiceId);
        invoice.setStatus(InvoiceStatus.UNPAID);
        invoice.getServiceRequest().setStatus(ServiceStatus.UNPAID);
        requestRepo.save(invoice.getServiceRequest());
        return toResponse(invoiceRepo.save(invoice));
    }

    public InvoiceResponse findById(String id) {
        return toResponse(findEntityById(id));
    }

    public List<InvoiceResponse> getAll() {
        return invoiceRepo.findAll().stream().map(this::toResponse).toList();
    }

    private Invoice findEntityById(String id) {
        return invoiceRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + id));
    }

    private InvoiceResponse toResponse(Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .serviceRequestId(invoice.getServiceRequest().getId())
                .amount(invoice.getAmount())
                .status(invoice.getStatus())
                .generatedAt(invoice.getGeneratedAt())
                .paidAt(invoice.getPaidAt())
                .build();
    }
}