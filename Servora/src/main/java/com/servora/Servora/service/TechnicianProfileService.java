package com.servora.Servora.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.servora.Servora.dto.TechnicianProfileDto;
import com.servora.Servora.entity.TechnicianProfile;
import com.servora.Servora.entity.User;
import com.servora.Servora.enums.Role;
import com.servora.Servora.repo.TechnicianProfileRepo;
import com.servora.Servora.repo.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TechnicianProfileService {

    private final TechnicianProfileRepo profileRepo;
    private final UserRepo userRepo;

    public TechnicianProfile create(TechnicianProfileDto dto) {
        User user = findTechnicianUser(dto.getEmail());

        TechnicianProfile profile = new TechnicianProfile();
        profile.setUser(user);
        profile.setSkills(dto.getSkills());
        profile.setExperienceYears(dto.getExperienceYears());
        return profileRepo.save(profile);

    }

    public List<TechnicianProfile> findAll() {
        return profileRepo.findAll();
    }

    public TechnicianProfile findById(Long id) {
        return profileRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Technician not found"));
    }

    private User findTechnicianUser(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User Not Found" + email));

        if (user.getRole() != Role.TECHNICIAN) {
            throw new RuntimeException("User is not a technician" + email);
        }
        return user;
    }

    public TechnicianProfile update(Long id, TechnicianProfileDto dto) {
        TechnicianProfile profile = findById(id);

        profile.setSkills(dto.getSkills());
        profile.setExperienceYears(dto.getExperienceYears());

        return profileRepo.save(profile);

    }

    public void delete(Long id) {
        profileRepo.deleteById(id);
    }

}
