package com.bank.poc.system1_gateway.dto;

public class TransactionResponse {

    private String status;   // SUCCESS / FAILED
    private String message;
    private Double balance;

    public TransactionResponse() { }

    public TransactionResponse(String status, String message, Double balance) {
        this.status = status;
        this.message = message;
        this.balance = balance;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }
}
