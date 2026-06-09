package com.servora.Servora.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.servora.Servora.dto.APiResponse;
import com.servora.Servora.dto.TechnicianProfileDto;
import com.servora.Servora.entity.TechnicianProfile;
import com.servora.Servora.service.TechnicianProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/find")
@RequiredArgsConstructor
public class TechnicianProfileController {
    private final TechnicianProfileService profileService;

    @PostMapping("/create")
    public ResponseEntity<APiResponse<TechnicianProfile>> create(@RequestBody TechnicianProfileDto dto) {
        TechnicianProfile profile = profileService.create(dto);
        return ResponseEntity.ok(new APiResponse<>("Technician Profile created successfully", profile));
    }

    @GetMapping("/all")
    public ResponseEntity<APiResponse<List<TechnicianProfile>>> findAll() {
        List<TechnicianProfile> profiles = profileService.findAll();
        return ResponseEntity.ok(new APiResponse<>("Technician Profiles fetched successfully", profiles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<APiResponse<TechnicianProfile>> findById(@PathVariable Long id) {
        TechnicianProfile profile = profileService.findById(id);
        return ResponseEntity.ok(new APiResponse<>("Technician Profile fetched successfully", profile));
    }

    @PutMapping("/{id}")
    public ResponseEntity<APiResponse<TechnicianProfile>> update(@PathVariable Long id,
            @RequestBody TechnicianProfileDto dto) {
        TechnicianProfile profile = profileService.update(id, dto);
        return ResponseEntity.ok(new APiResponse<>("Technician Profile updated successfully", profile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APiResponse<Void>> delete(@PathVariable Long id) {
        profileService.delete(id);
        return ResponseEntity.ok(new APiResponse<>("Technician Profile deleted successfully", null));

    }
}
