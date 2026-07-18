package vn.edu.likelion.movie_tickets_online_bookings.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HallResponseDTO {

    private int id;

    private String name;

    private int capacity;
}
