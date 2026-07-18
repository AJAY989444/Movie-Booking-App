package vn.edu.likelion.movie_tickets_online_bookings.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

    @NotNull
    @NotBlank
    @NotEmpty // Validation
    private String name;

    @NotNull
    @NotBlank
    @NotEmpty
    @Email // Validation
    private String email;

    @NotNull
    @Pattern(regexp = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}") // Validation
    private String password;
    //  At least one digit (0-9) must be present in the string.
    //  At least one lowercase letter (a-z) must be present in the string.
    //  At least one uppercase letter (A-Z) must be present in the string.
    //  At least one special character from the set @#$%^&+= must be present in the string.
    //  No whitespace is allowed in the entire string
    //  The string must be at least 8 characters long.

    @NotNull
    @NotBlank
    @NotEmpty
    @Size(min = 10) // Validation
    private String phoneNumber;

}
