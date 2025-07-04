package com.visiplus.portfolio.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ProjectNotFoundException extends RuntimeException {

  public ProjectNotFoundException() {
    super("Projet associé non trouvé.");
  }

  public ProjectNotFoundException(String message) {
    super(message);
  }

  public ProjectNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}
