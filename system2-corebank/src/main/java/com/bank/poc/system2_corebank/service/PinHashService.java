package com.bank.poc.system2_corebank.service;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;


@Service
public class PinHashService {
    public String hashPin(String pin){
        try{
            MessageDigest digest=MessageDigest.getInstance("SHA-256");
            byte[] hash=digest.digest(pin.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex=new StringBuilder();
            for(byte b:hash){
                String h=Integer.toHexString(0xff & b);
                if(h.length()==1)hex.append('0');
                hex.append(h);
            }
            return hex.toString();
        }catch(NoSuchAlgorithmException e){
                throw new RuntimeException("Error hashing PIN",e);
        }
    }
	
}
