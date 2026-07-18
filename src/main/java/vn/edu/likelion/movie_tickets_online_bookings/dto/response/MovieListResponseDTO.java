package vn.edu.likelion.movie_tickets_online_bookings.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieListResponseDTO {
    private List<MovieResponseDTO> movies;
    private long totalCount;
}
