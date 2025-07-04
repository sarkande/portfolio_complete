package com.visiplus.portfolio.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {


    @GetMapping("/")
    public Map<String, Object> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Backend up & running 🚀");
        response.put("ping", Instant.now().toString());
        return response;
    }
}
