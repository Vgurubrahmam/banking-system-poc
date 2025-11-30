package com.bank.poc.system1_gateway.service;

import com.bank.poc.system1_gateway.dto.TransactionRequest;
import com.bank.poc.system1_gateway.dto.TransactionResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TransactionService {

    private final RestTemplate restTemplate;

    // System2 URL
    private static final String SYSTEM2_URL = "https://banking-system-poc-backend-system2.onrender.com/api/process";

    public TransactionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public TransactionResponse handle(TransactionRequest req) {

        // basic null/empty checks
        if (req.getCardNumber() == null || req.getCardNumber().isEmpty()
                || req.getPin() == null || req.getPin().isEmpty()) {
            return new TransactionResponse("FAILED", "Card number and PIN are required", null);
        }

        if (req.getAmount() <= 0) {
            return new TransactionResponse("FAILED", "Amount must be greater than 0", null);
        }

        String type = req.getType() == null ? "" : req.getType().toLowerCase();
        if (!type.equals("withdraw") && !type.equals("topup")) {
            return new TransactionResponse("FAILED", "Type must be 'withdraw' or 'topup'", null);
        }

        // card range routing
        if (!req.getCardNumber().startsWith("4")) {
            return new TransactionResponse("FAILED", "Card range not supported", null);
        }

        // forward to System2
        try {
            TransactionResponse system2Response =
                    restTemplate.postForObject(SYSTEM2_URL, req, TransactionResponse.class);

            if (system2Response == null) {
                return new TransactionResponse("FAILED", "No response from System2", null);
            }
            return system2Response;

        } catch (Exception e) {
            return new TransactionResponse("FAILED", "Error contacting System2: " + e.getMessage(), null);
        }
    }
}
