package vn.edu.likelion.movie_tickets_online_bookings.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SeatRequestDTO {

    @NotBlank(message = "Seat number cannot be blank")
    private String seatNumber;

    @NotNull(message = "Hall ID cannot be null")
    private Integer hallId;
}
