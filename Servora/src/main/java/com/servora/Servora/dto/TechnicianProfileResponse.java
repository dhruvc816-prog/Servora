package com.servora.Servora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianProfileResponse {

    private Long id;
    private String userId;
    private String name;
    private String email;
    private String skills;
    private int experienceYears;
    private boolean isAvailable;
    private int maxActiveJobs;

}
