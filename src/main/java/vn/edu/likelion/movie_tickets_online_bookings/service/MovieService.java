package vn.edu.likelion.movie_tickets_online_bookings.service;

import org.springframework.web.multipart.MultipartFile;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.MovieRequestDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.MovieListResponseDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.MovieResponseDTO;

import java.io.IOException;
import java.util.List;

public interface MovieService extends BaseService<MovieRequestDTO, MovieResponseDTO> {
    MovieResponseDTO update(MovieRequestDTO dto, int id, MultipartFile posterImageFile, MultipartFile bannerImageFile) throws IOException;
    MovieResponseDTO create(MovieRequestDTO dto, MultipartFile posterImageFile, MultipartFile bannerImageFile);
    List<MovieResponseDTO> findByName(String name);
    MovieListResponseDTO findAll(boolean statusInDBOfMovie, String sortBy, String sortDir);
}
