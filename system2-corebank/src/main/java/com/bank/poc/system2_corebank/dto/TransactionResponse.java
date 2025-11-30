package com.bank.poc.system2_corebank.dto;
public class TransactionResponse {
    private String status;
    private String message;
    private Double balance;

    public TransactionResponse(){}
    public TransactionResponse(String status,String message,Double balance){
        this.status=status;
        this.message=message;
        this.balance=balance;
    }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Double getBalance() { return balance; }
    public void setBalance(Double balance) { this.balance = balance; }
    
}

