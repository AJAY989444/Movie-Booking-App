package vn.edu.likelion.movie_tickets_online_bookings.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePasswordRequest {

    @NotNull
    private String newPassword;

    @NotNull
    private String currentPassword;

}
