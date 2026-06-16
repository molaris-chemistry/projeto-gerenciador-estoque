package com.reagentes.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reagentes.dto.UserDTO;
import com.reagentes.infra.exception.ApiException;
import com.reagentes.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping()
@RequiredArgsConstructor
public class UserController {
  
  private final UserService userService;

  @GetMapping("/me")
  public ResponseEntity<UserDTO> getProfileById(Authentication authentication){
    if(authentication == null || authentication.getName() == null){
      throw ApiException.unauthorized("Usuário não está autenticado");
    }

    return ResponseEntity.ok(UserDTO.from(userService.getProfileByEmail(authentication.getName())));
  }
}
