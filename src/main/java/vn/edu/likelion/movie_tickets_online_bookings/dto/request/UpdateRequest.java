package vn.edu.likelion.movie_tickets_online_bookings.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRequest {

    @NotNull
    @NotEmpty
    @NotBlank
    private String field;

    @NotNull
    private String password;

}
