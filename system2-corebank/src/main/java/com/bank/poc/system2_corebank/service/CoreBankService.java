package com.bank.poc.system2_corebank.service;
import com.bank.poc.system2_corebank.dto.TransactionRequest;
import com.bank.poc.system2_corebank.dto.TransactionResponse;
import com.bank.poc.system2_corebank.repository.CardRepository;

import com.bank.poc.system2_corebank.repository.TransactionRepository;
import com.bank.poc.system2_corebank.entity.Card;
import com.bank.poc.system2_corebank.entity.Transaction;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
@Service
public class CoreBankService {

    private final CardRepository cardRepository;
    private final TransactionRepository transactionRepository;
    private final PinHashService pinHashService;
    
    public CoreBankService(CardRepository cardRepository,TransactionRepository transactionRepository , PinHashService pinHashService){
        this.cardRepository=cardRepository;
        this.transactionRepository=transactionRepository;
        this.pinHashService=pinHashService;
    }
    @Transactional
    public TransactionResponse process(TransactionRequest req) {

        Optional<Card> cardOpt = cardRepository.findById(req.getCardNumber());
        if (cardOpt.isEmpty()) {
            saveLog(req, "FAILED", "Invalid card");
            return new TransactionResponse("FAILED", "Invalid card", null);
        }

        Card card = cardOpt.get();

        String inputHash = pinHashService.hashPin(req.getPin());
        if (!inputHash.equals(card.getPinHash())) {
            saveLog(req, "FAILED", "Invalid PIN");
            return new TransactionResponse("FAILED", "Invalid PIN", null);
        }

        if (req.getAmount() <= 0) {
            saveLog(req, "FAILED", "Amount must be > 0");
            return new TransactionResponse("FAILED", "Amount must be > 0", card.getBalance());
        }

        String type = req.getType().toLowerCase();

        if ("withdraw".equals(type)) {
            if (card.getBalance() < req.getAmount()) {
                saveLog(req, "FAILED", "Insufficient balance");
                return new TransactionResponse("FAILED", "Insufficient balance", card.getBalance());
            }
            card.setBalance(card.getBalance() - req.getAmount());
        } else if ("topup".equals(type)) {
            card.setBalance(card.getBalance() + req.getAmount());
        } else {
            saveLog(req, "FAILED", "Invalid type");
            return new TransactionResponse("FAILED", "Invalid type", card.getBalance());
        }

        cardRepository.save(card);
        saveLog(req, "SUCCESS", "Transaction successful");

        return new TransactionResponse("SUCCESS", "Transaction successful", card.getBalance());
    }

    private void saveLog(TransactionRequest req, String status, String reason) {
        Transaction t = new Transaction();
        t.setCardNumber(req.getCardNumber());
        t.setType(req.getType());
        t.setAmount(req.getAmount());
        t.setTimestamp(LocalDateTime.now());
        t.setStatus(status);
        t.setReason(reason);
        transactionRepository.save(t);
    }
        public java.util.List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public java.util.List<Transaction> getTransactionsForCard(String cardNumber) {
        return transactionRepository.findByCardNumberOrderByTimestampDesc(cardNumber);
    }

}

