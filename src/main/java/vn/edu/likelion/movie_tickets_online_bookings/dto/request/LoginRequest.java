package vn.edu.likelion.movie_tickets_online_bookings.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {

    @NotNull @NotBlank @NotEmpty @Email // Validation
    private String email;

    @NotNull
    private String password;
}
