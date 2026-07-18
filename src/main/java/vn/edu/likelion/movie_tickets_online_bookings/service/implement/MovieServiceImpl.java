package vn.edu.likelion.movie_tickets_online_bookings.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.MovieRequestDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.MovieListResponseDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.MovieResponseDTO;
import vn.edu.likelion.movie_tickets_online_bookings.entity.MovieEntity;
import vn.edu.likelion.movie_tickets_online_bookings.exception.ResourceAlreadyExistsException;
import vn.edu.likelion.movie_tickets_online_bookings.exception.ResourceNotFoundException;
import vn.edu.likelion.movie_tickets_online_bookings.mapper.MovieMapper;
import vn.edu.likelion.movie_tickets_online_bookings.repository.MovieRepo;
import vn.edu.likelion.movie_tickets_online_bookings.service.CloudinaryService;
import vn.edu.likelion.movie_tickets_online_bookings.service.MovieService;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepo movieRepository;
    private final MovieMapper movieMapper;
    private final CloudinaryService cloudinaryService;

    @Autowired
    public MovieServiceImpl(MovieRepo movieRepository, MovieMapper movieMapper, CloudinaryService cloudinaryService) {
        this.movieRepository = movieRepository;
        this.movieMapper = movieMapper;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public MovieResponseDTO create(MovieRequestDTO dto, MultipartFile posterImageFile, MultipartFile bannerImageFile) {
        // Check if the movie name already exists
        if (movieRepository.findByNameAndDeletedIsFalse(dto.getName()).isPresent()) {
            throw new ResourceAlreadyExistsException("A movie with the name '" + dto.getName() + "' already exists.");
        }

        // Upload the images to Cloudinary and get the URLs
        if (posterImageFile != null && !posterImageFile.isEmpty()) {
            String posterImageUrl = cloudinaryService.uploadFile(posterImageFile);
            dto.setPosterImageUrl(posterImageUrl);
        }

        if (bannerImageFile != null && !bannerImageFile.isEmpty()) {
            String bannerImageUrl = cloudinaryService.uploadFile(bannerImageFile);
            dto.setBannerImageUrl(bannerImageUrl);
        }

        MovieEntity entity = movieMapper.toEntity(dto);
        MovieEntity savedEntity = movieRepository.save(entity);
        return movieMapper.toResponseDTO(savedEntity);
    }


    @Override
    public MovieResponseDTO create(MovieRequestDTO movieRequestDTO) {
        return null;
    }

    @Override
    public Iterable<MovieResponseDTO> findAll(int pageNo, int pageSize, String sortBy, String sortDir) {
        return null;
    }
    
    @Override
    public MovieResponseDTO update(MovieRequestDTO movieRequestDTO) {
        return null;
    }

    @Override
    public MovieResponseDTO update(MovieRequestDTO dto, int id, MultipartFile posterImageFile, MultipartFile bannerImageFile) throws IOException {
        MovieEntity entity = movieRepository.findByIdAndDeletedIsFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id " + id));

        // Check if the updated name is already taken by another movie
        Optional<MovieEntity> existingMovie = movieRepository.findByNameAndDeletedIsFalse(dto.getName());
        if (existingMovie.isPresent() && existingMovie.get().getId() != id) {
            throw new ResourceAlreadyExistsException("A movie with the name '" + dto.getName() + "' already exists.");
        }

        // Upload new images if provided and update the entity's image URLs
        if (posterImageFile != null && !posterImageFile.isEmpty()) {
            String posterImageUrl = cloudinaryService.uploadFile(posterImageFile);
            dto.setPosterImageUrl(posterImageUrl);
        }

        if (bannerImageFile != null && !bannerImageFile.isEmpty()) {
            String bannerImageUrl = cloudinaryService.uploadFile(bannerImageFile);
            dto.setBannerImageUrl(bannerImageUrl);
        }

        // Update other fields
        movieMapper.updateEntityFromDTO(dto, entity);
        MovieEntity updatedEntity = movieRepository.save(entity);
        return movieMapper.toResponseDTO(updatedEntity);
    }

    @Override
    public void delete(int id) {
        MovieEntity entity = movieRepository.findByIdAndDeletedIsFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id " + id));
        entity.setDeleted(true);
        movieRepository.save(entity);
    }

    @Override
    public MovieResponseDTO findById(int id) {
        MovieEntity entity = movieRepository.findByIdAndDeletedIsFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id " + id));
        return movieMapper.toResponseDTO(entity);
    }

    @Override
    public List<MovieResponseDTO> findByName(String name) {
        List<MovieEntity> entities = movieRepository.findAllByNameContainingIgnoreCaseAndDeletedIsFalse(name);
        if (entities.isEmpty()) {
            throw new ResourceNotFoundException("No movies found with name containing '" + name + "'");
        }
        return entities.stream().map(movieMapper::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    public MovieListResponseDTO findAll(boolean statusInDBOfMovie, String sortBy, String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        List<MovieEntity> movieEntities = movieRepository.findAllByDeleted(statusInDBOfMovie, sort);

        List<MovieResponseDTO> movies = movieEntities
                .stream()
                .map(movieMapper::toResponseDTO)
                .collect(Collectors.toList());

        long totalCount = movieRepository.countByDeleted(statusInDBOfMovie);

        return new MovieListResponseDTO(movies, totalCount);
    }
}