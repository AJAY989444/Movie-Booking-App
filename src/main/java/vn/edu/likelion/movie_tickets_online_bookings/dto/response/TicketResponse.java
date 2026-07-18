package vn.edu.likelion.movie_tickets_online_bookings.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.likelion.movie_tickets_online_bookings.entity.SeatEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.ShowtimeEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.UserEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.enums.TicketStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketResponse {

    private BigDecimal price;
    private TicketStatus status;
    private UserEntity user;
    private SeatEntity seat;
    private ShowtimeEntity showtime;
    private UserEntity staff;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime bookingTime;

}
