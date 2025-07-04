package com.visiplus.portfolio.controllers;

import com.visiplus.portfolio.DTO.AuthRequest;
import com.visiplus.portfolio.DTO.AuthResponse;
import com.visiplus.portfolio.models.User;
import com.visiplus.portfolio.repository.UserRepository;
import com.visiplus.portfolio.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private  AuthenticationManager authenticationManager;

    @Autowired
    private  JwtService jwtService;

    @Autowired
    private  UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Ici on suppose que l'utilisateur existe déjà
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwt = jwtService.generateToken(user.getUsername());

        return ResponseEntity.ok(new AuthResponse(jwt));
    }
}
