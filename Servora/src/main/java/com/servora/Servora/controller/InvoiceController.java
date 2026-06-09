package com.servora.Servora.controller;

import com.servora.Servora.dto.APiResponse;
import com.servora.Servora.dto.CreateInvoiceDto;
import com.servora.Servora.dto.InvoiceResponse;
import com.servora.Servora.service.InvoiceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/{requestId}")
    public ResponseEntity<APiResponse<InvoiceResponse>> create(
            @PathVariable String requestId,
            @Valid @RequestBody CreateInvoiceDto dto) {
        return ResponseEntity.ok(new APiResponse<>("Invoice created",invoiceService.create(requestId, dto)));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<APiResponse<InvoiceResponse>> markPaid(@PathVariable String id) {
        return ResponseEntity.ok(new APiResponse<>("Invoice marked paid", invoiceService.markPaid(id)));
    }

    @PutMapping("/{id}/unpaid")
    public ResponseEntity<APiResponse<InvoiceResponse>> markUnpaid(@PathVariable String id) {
        return ResponseEntity.ok(new APiResponse<>("Invoice marked unpaid", invoiceService.markUnpaid(id)));
    }

    @GetMapping
    public ResponseEntity<APiResponse<List<InvoiceResponse>>> getAll() {
        return ResponseEntity.ok(new APiResponse<>("All invoices", invoiceService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<APiResponse<InvoiceResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(new APiResponse<>("Invoice fetched", invoiceService.findById(id)));
    }
}