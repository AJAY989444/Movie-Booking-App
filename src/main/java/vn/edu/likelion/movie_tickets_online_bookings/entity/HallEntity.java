package vn.edu.likelion.movie_tickets_online_bookings.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Table(name = "halls")
@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HallEntity extends BaseEntity {

    @Column(name = "name", nullable = false)
    String name;

    @Column(name = "capacity", nullable = false)
    int capacity;
}
