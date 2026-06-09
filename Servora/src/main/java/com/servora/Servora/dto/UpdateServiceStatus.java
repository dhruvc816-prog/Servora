package com.servora.Servora.dto;

import com.servora.Servora.enums.ServiceStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateServiceStatus {

    private ServiceStatus status;

}
