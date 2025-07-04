package com.visiplus.portfolio.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/me")
public class UserController {

    @GetMapping
    public Map<String, Object> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        return Map.of(
                "username", auth.getName(),
                "authorities", auth.getAuthorities()
        );
    }
}
