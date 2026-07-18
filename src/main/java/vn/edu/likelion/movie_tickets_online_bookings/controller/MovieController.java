package vn.edu.likelion.movie_tickets_online_bookings.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.MovieRequestDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.MovieListResponseDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.MovieResponseDTO;
import vn.edu.likelion.movie_tickets_online_bookings.service.MovieService;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin
public class MovieController {

    private final MovieService movieService;

    @Autowired
    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    private ResponseEntity<Map<String, Object>> createResponse(String status, Object data, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        response.put("data", data);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    // Create a new movie
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createMovie(
            @Validated
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("releaseDate") String releaseDate,
            @RequestParam("rating") Double rating,
            @RequestParam("trailer") String trailer,
            @RequestParam(value = "posterImage", required = false) MultipartFile posterImage,
            @RequestParam(value = "bannerImage", required = false) MultipartFile bannerImage,
            @RequestParam("cast") String cast) {

        MovieRequestDTO movieRequestDTO = new MovieRequestDTO();
        movieRequestDTO.setName(name);
        movieRequestDTO.setDescription(description);
        movieRequestDTO.setReleaseDate(LocalDate.parse(releaseDate));
        movieRequestDTO.setRating(rating);
        movieRequestDTO.setTrailer(trailer);
        movieRequestDTO.setCast(cast);

        MovieResponseDTO createdMovie = movieService.create(movieRequestDTO, posterImage, bannerImage);
        return createResponse("success", createdMovie, "Movie created successfully.");
    }

    // Retrieve a specific movie by ID
    @GetMapping("/id")
    public ResponseEntity<Map<String, Object>> getMovieById(@Validated @RequestParam int id) {
        MovieResponseDTO movie = movieService.findById(id);
        return createResponse("success", movie, "Movie retrieved successfully.");
    }

    // Retrieve a specific movie by title
    @GetMapping("/title")
    public ResponseEntity<Map<String, Object>> getMovieByTitle(@Validated @RequestParam String title) {
        List<MovieResponseDTO> movies = movieService.findByName(title);
        return createResponse("success", movies, "Movies retrieved successfully.");
    }

    // New endpoint for finding all movies without pagination
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllMovie(@Validated @RequestParam(value = "status", required = false, defaultValue = "false") boolean statusInDBOfMovie,
                                                           @Validated @RequestParam(value = "sortBy", required = false, defaultValue = "id") String sortBy,
                                                           @Validated @RequestParam(value = "sortDir", required = false, defaultValue = "asc") String sortDir) {
        MovieListResponseDTO movies = movieService.findAll(statusInDBOfMovie, sortBy, sortDir);
        return createResponse("success", movies, "Movies retrieved successfully.");
    }

    // Update an existing movie
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateMovie(
            @RequestParam int id,
            @Validated @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("releaseDate") String releaseDate,
            @RequestParam("rating") Double rating,
            @RequestParam("trailer") String trailer,
            @RequestParam(value = "posterImage", required = false) MultipartFile posterImage,
            @RequestParam(value = "bannerImage", required = false) MultipartFile bannerImage,
            @RequestParam("cast") String cast) {

        MovieRequestDTO movieRequestDTO = new MovieRequestDTO();
        movieRequestDTO.setName(name);
        movieRequestDTO.setDescription(description);
        movieRequestDTO.setReleaseDate(LocalDate.parse(releaseDate));
        movieRequestDTO.setRating(rating);
        movieRequestDTO.setTrailer(trailer);
        movieRequestDTO.setCast(cast);

        try {
            MovieResponseDTO updatedMovie = movieService.update(movieRequestDTO, id, posterImage, bannerImage);
            return createResponse("success", updatedMovie, "Movie updated successfully.");
        } catch (IOException e) {
            return createResponse("error", null, "Failed to upload image. Please try again.");
        }
    }

    // Soft delete a movie by ID
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteMovie(@Validated @RequestParam int id) {
        movieService.delete(id);
        return createResponse("success", null, "Movie deleted successfully.");
    }
}