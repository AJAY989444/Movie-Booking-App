package vn.edu.likelion.movie_tickets_online_bookings.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ShowtimeRequest {

    @NotNull @NotBlank @NotEmpty @JsonFormat( pattern = "yyyy-MM-dd" )
    LocalDate showtimeDate;

    @NotNull @NotBlank @NotEmpty @JsonFormat( pattern = "HH:mm:ss" )
    LocalTime startTime;

    @NotNull @NotBlank @NotEmpty
    int duration; // minutes

    @NotNull
    int hall_id;
}
