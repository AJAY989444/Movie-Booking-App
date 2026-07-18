package vn.edu.likelion.movie_tickets_online_bookings.mapper;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoderMapper {

    private final PasswordEncoder passwordEncoder;

    public PasswordEncoderMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @EncodedMapping
    public String encode(String value) {
        return passwordEncoder.encode(value);
    }
}