package com.bank.poc.system1_gateway.controller;

import com.bank.poc.system1_gateway.dto.TransactionRequest;
import com.bank.poc.system1_gateway.dto.TransactionResponse;
import com.bank.poc.system1_gateway.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/system1")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/transaction")
    public ResponseEntity<TransactionResponse> create(@RequestBody TransactionRequest req) {
        TransactionResponse response = transactionService.handle(req);
        return ResponseEntity.ok(response);
    }
}
