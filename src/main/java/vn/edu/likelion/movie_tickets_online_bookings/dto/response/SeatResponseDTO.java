package vn.edu.likelion.movie_tickets_online_bookings.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SeatResponseDTO {

    private int id;
    private String seatNumber;
    private int hallId;
}
