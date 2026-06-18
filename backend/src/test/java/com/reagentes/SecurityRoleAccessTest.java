package com.reagentes;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityRoleAccessTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  @WithMockUser(roles = "PROFESSOR")
  void professorCannotCreateReagente() throws Exception {
    mockMvc
      .perform(
        post("/api/reagentes")
          .contentType(APPLICATION_JSON)
          .content("""
            {"nome":"Teste","quantidade":1,"unidade":"g"}
            """)
      )
      .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(roles = "TECNICO")
  void tecnicoCanAttemptCreateReagente() throws Exception {
    mockMvc
      .perform(
        post("/api/reagentes")
          .contentType(APPLICATION_JSON)
          .content("""
            {"nome":"Teste","quantidade":1,"unidade":"g"}
            """)
      )
      .andExpect(notForbidden());
  }

  @Test
  @WithMockUser(roles = "PROFESSOR")
  void professorCannotAccessRelatorios() throws Exception {
    mockMvc
      .perform(get("/api/relatorios/geral"))
      .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(roles = "TECNICO")
  void tecnicoCanAccessRelatorios() throws Exception {
    mockMvc
      .perform(get("/api/relatorios/geral"))
      .andExpect(notForbidden());
  }

  @Test
  @WithMockUser(roles = "PROFESSOR")
  void professorCanListReagentes() throws Exception {
    mockMvc
      .perform(get("/api/reagentes"))
      .andExpect(status().isOk());
  }

  @Test
  @WithMockUser(roles = "PROFESSOR")
  void professorCannotDeleteMovimentacao() throws Exception {
    mockMvc
      .perform(delete("/api/movimentacoes/1"))
      .andExpect(status().isForbidden());
  }

  @Test
  @WithMockUser(roles = "TECNICO")
  void tecnicoCanAttemptDeleteMovimentacao() throws Exception {
    mockMvc
      .perform(delete("/api/movimentacoes/1"))
      .andExpect(notForbidden());
  }

  private static org.springframework.test.web.servlet.ResultMatcher notForbidden() {
    return result -> {
      int status = result.getResponse().getStatus();
      if (status == 403) {
        throw new AssertionError("Expected status other than 403 but got 403");
      }
    };
  }
}
