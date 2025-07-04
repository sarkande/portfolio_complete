package com.visiplus.portfolio.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class BadLoginException extends RuntimeException {

  public BadLoginException() {
    super("Erreur dans le l'adresse mail ou le mot de passe.");
  }

  public BadLoginException(String message) {
    super(message);
  }

  public BadLoginException(String message, Throwable cause) {
    super(message, cause);
  }
}
