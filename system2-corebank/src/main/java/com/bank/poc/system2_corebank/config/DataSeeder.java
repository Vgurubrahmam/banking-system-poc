package com.bank.poc.system2_corebank.config;

import com.bank.poc.system2_corebank.entity.Card;
import com.bank.poc.system2_corebank.repository.CardRepository;
import com.bank.poc.system2_corebank.service.PinHashService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedData(CardRepository cardRepository,
                                      PinHashService pinHashService) {
        return args -> {
            if (cardRepository.existsById("4123456789012345")) return;

            Card c = new Card();
            c.setCardNumber("4123456789012345");
            c.setCustomerName("John Doe");
            c.setBalance(1000.0);
            c.setPinHash(pinHashService.hashPin("1234"));
            cardRepository.save(c);
        };
    }
}
