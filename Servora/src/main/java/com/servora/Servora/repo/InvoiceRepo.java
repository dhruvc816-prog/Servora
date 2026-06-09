package com.servora.Servora.repo;

import com.servora.Servora.entity.Invoice;
import com.servora.Servora.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InvoiceRepo extends JpaRepository<Invoice, String> {
    Optional<Invoice> findByServiceRequest(ServiceRequest serviceRequest);
}
