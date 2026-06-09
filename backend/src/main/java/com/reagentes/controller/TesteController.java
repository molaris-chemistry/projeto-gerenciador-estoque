package com.reagentes.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")  // ← IMPORTANTE!
public class TesteController {

    @GetMapping
    public String test() {
        return "✅ API Test - Funcionando!";
    }
}