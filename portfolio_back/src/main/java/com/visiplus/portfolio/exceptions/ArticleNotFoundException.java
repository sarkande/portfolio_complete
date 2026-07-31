package com.visiplus.portfolio.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ArticleNotFoundException extends RuntimeException {

  public ArticleNotFoundException() {
    super("Article associé non trouvé.");
  }

  public ArticleNotFoundException(String message) {
    super(message);
  }

  public ArticleNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }
}
