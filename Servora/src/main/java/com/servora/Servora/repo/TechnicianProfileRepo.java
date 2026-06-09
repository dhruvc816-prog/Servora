package com.servora.Servora.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.servora.Servora.entity.TechnicianProfile;

@Repository
public interface TechnicianProfileRepo extends JpaRepository<TechnicianProfile, Long> {

    Optional<TechnicianProfile> findByUserId(String userId);

}
