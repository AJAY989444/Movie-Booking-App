package vn.edu.likelion.movie_tickets_online_bookings.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "movies")
@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieEntity extends BaseEntity {

    @Column(name = "name", unique = true, nullable = false)
    String name;

    @Column(name = "description")
    String description;

    @Column(name = "release_date")
    LocalDate releaseDate;

    @Column(name = "cast", nullable = false)
    String cast;

    @Column(name = "trailer_url")
    String trailer;

    @Column(name = "poster_image_url")
    String posterImageUrl;

    @Column(name = "banner_image_url")  
    String bannerImageUrl;

    @Column(name = "rating")
    Double rating;
}
