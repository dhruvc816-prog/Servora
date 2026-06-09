package com.servora.Servora.dto;

import java.time.LocalDateTime;

import com.servora.Servora.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private LocalDateTime createdAt;

}
