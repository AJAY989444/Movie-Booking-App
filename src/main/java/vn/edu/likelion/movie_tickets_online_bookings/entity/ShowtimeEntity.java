package vn.edu.likelion.movie_tickets_online_bookings.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "showtimes")
@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowtimeEntity extends BaseEntity {

    @Column(name = "showtime_date", nullable = false)
    LocalDate showtimeDate;

    @Column(name = "start_time", nullable = false)
    LocalTime startTime;

    @Column(name = "duration", nullable = false)
    int duration;

    @ManyToOne(fetch = FetchType.EAGER)
    MovieEntity movie;

    @ManyToOne(fetch = FetchType.EAGER)
    HallEntity hall;

}
