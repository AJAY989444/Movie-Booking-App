package vn.edu.likelion.movie_tickets_online_bookings.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.likelion.movie_tickets_online_bookings.entity.enums.TicketStatus;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketRequest {

    private TicketStatus status;

    private int user_id;

    private int seat_id;

    private int showtime_id;

    private int staff_id;
}
