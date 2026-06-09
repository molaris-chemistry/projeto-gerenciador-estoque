package com.reagentes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.reagentes")
public class ReagentesApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(ReagentesApiApplication.class, args);
	}
}