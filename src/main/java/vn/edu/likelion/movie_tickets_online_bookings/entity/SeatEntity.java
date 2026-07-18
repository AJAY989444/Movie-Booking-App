package vn.edu.likelion.movie_tickets_online_bookings.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "seats")
@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatEntity extends BaseEntity {

    @Column(name = "seat_number", nullable = false, length = 10)
    String seatNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    HallEntity hall;
}
