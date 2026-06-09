package com.servora.Servora.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.servora.Servora.entity.ServiceRequest;
import com.servora.Servora.entity.User;
import com.servora.Servora.enums.ServiceStatus;

import java.util.List;

public interface ServiceRequestRepo extends JpaRepository<ServiceRequest, String> {
    List<ServiceRequest> findByCreatedBy(User user);

    List<ServiceRequest> findByAssignedTo(User user);

    long countByAssignedToAndStatus(User user, ServiceStatus status);

    List<ServiceRequest> findByStatus(ServiceStatus status);

}
