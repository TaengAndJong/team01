package com.example.team01.common.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.WebRequest;

import java.util.Map;

@RestController
@RequestMapping("/error")
public class GlobalErrorController implements ErrorController {

    private final ErrorAttributes errorAttributes;

    public GlobalErrorController(ErrorAttributes errorAttributes) {
        this.errorAttributes = errorAttributes;
    }

    @RequestMapping
    public ResponseEntity<Map<String, Object>> handleError(WebRequest webRequest) {
        Map<String, Object> errors = errorAttributes.getErrorAttributes(webRequest, ErrorAttributeOptions.defaults());
        int status = (int) errors.getOrDefault("status", 500);
        return ResponseEntity.status(status).body(errors);
    }
}



/*
*
*
*
*
*
* */