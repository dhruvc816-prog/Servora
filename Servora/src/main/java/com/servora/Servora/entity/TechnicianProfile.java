package com.servora.Servora.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "technician_profiles")
@Getter
@Setter
@NoArgsConstructor
public class TechnicianProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    private String skills;
    private int experienceYears;
    private boolean isAvailable = true;
    private int maxActiveJobs = 1;

}
