package com.servora.Servora.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TechnicianProfileDto {

    private String email;
    private String skills;
    private int experienceYears;

}
