package vn.edu.likelion.movie_tickets_online_bookings.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.edu.likelion.movie_tickets_online_bookings.entity.HallEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.MovieEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowtimeResponse {

    private int id;
    private LocalDate showtimeDate;
    private LocalTime startTime;
    private int duration;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    private LocalDateTime createdAt;

    private HallEntity hall;
    private MovieEntity movie;

}
