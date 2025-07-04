package com.visiplus.portfolio.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class EntityAlreadyExistException extends RuntimeException {
    public EntityAlreadyExistException(){
        super("Entity already exist"); // ✅ Message par défaut
    }
    public EntityAlreadyExistException(String message) {
        super(message); // ✅ Message personnalisé
    }
}