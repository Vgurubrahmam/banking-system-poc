package com.bank.poc.system2_corebank.controller;

import com.bank.poc.system2_corebank.dto.TransactionRequest;
import com.bank.poc.system2_corebank.dto.TransactionResponse;
import com.bank.poc.system2_corebank.entity.Transaction;
import com.bank.poc.system2_corebank.service.CoreBankService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProcessingController {

    private final CoreBankService coreBankService;

    public ProcessingController(CoreBankService coreBankService) {
        this.coreBankService = coreBankService;
    }

    @PostMapping("/process")
    public ResponseEntity<TransactionResponse> process(@RequestBody TransactionRequest req) {
        TransactionResponse response = coreBankService.process(req);
        return ResponseEntity.ok(response);
    }

    // NEW: all transactions (for admin)
    @GetMapping("/logs")
    public ResponseEntity<List<Transaction>> allLogs() {
        List<Transaction> logs = coreBankService.getAllTransactions();
        return ResponseEntity.ok(logs);
    }

    // NEW: transactions by card (for customer)
    @GetMapping("/logs/{cardNumber}")
    public ResponseEntity<List<Transaction>> logsByCard(@PathVariable String cardNumber) {
        List<Transaction> logs = coreBankService.getTransactionsForCard(cardNumber);
        return ResponseEntity.ok(logs);
    }
}
