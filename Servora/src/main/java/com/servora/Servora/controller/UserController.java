package com.servora.Servora.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.servora.Servora.dto.APiResponse;
import com.servora.Servora.dto.UserDto;
import com.servora.Servora.entity.User;
import com.servora.Servora.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/all")
    public ResponseEntity<APiResponse<List<User>>> getAll() {

        List<User> users = userService.findAll();
        return ResponseEntity.ok(new APiResponse<>("Users fetched successfully", users));

    }

    @GetMapping("/{id}")
    public ResponseEntity<APiResponse<User>> getById(@PathVariable String id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(new APiResponse<>("User fetched successfully", user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<APiResponse<User>> update(@PathVariable String id, @RequestBody UserDto dto) {
        User user = userService.update(id, dto);

        return ResponseEntity.ok(new APiResponse<>("User updated Succesfully", user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APiResponse<Void>> delete(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.ok(new APiResponse<>("User deleted succesfully", null));
    }
}
