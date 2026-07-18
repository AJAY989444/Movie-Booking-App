package vn.edu.likelion.movie_tickets_online_bookings.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.ShowtimeRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.ShowtimeResponse;
import vn.edu.likelion.movie_tickets_online_bookings.entity.HallEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.MovieEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.ShowtimeEntity;
import vn.edu.likelion.movie_tickets_online_bookings.exception.ShowtimeException;
import vn.edu.likelion.movie_tickets_online_bookings.mapper.ShowtimeMapper;
import vn.edu.likelion.movie_tickets_online_bookings.repository.HallRepo;
import vn.edu.likelion.movie_tickets_online_bookings.repository.MovieRepo;
import vn.edu.likelion.movie_tickets_online_bookings.repository.ShowtimeRepo;
import vn.edu.likelion.movie_tickets_online_bookings.service.ShowtimeService;

import java.util.Optional;

@Service
public class ShowtimeServiceImpl implements ShowtimeService {

    @Autowired
    ShowtimeRepo showtimeRepo;
    @Autowired
    ShowtimeMapper showtimeMapper;
    @Autowired
    MovieRepo movieRepo;
    @Autowired
    HallRepo hallRepo;

    @Override
    public ShowtimeResponse createShowtime(int movie_id, ShowtimeRequest showtimeRequest) {

        System.out.println("Test ======== " + showtimeRequest);

        Optional<MovieEntity> movieEntity = movieRepo.findByIdAndDeletedIsFalse(movie_id);
        System.out.println(movieEntity + " movieEntity");
        System.out.println(showtimeRequest.getHall_id() + "================");
        int hall_id = showtimeRequest.getHall_id();
        System.out.println(hall_id);
        Optional<HallEntity> hallEntity = hallRepo.findById(hall_id);
        System.out.println(hallEntity + " hallEntity");

        ShowtimeEntity showtimeEntity = showtimeMapper.toEntity(showtimeRequest);

        showtimeEntity.setMovie(movieEntity.get());
        showtimeEntity.setHall(hallEntity.get());

        showtimeRepo.save(showtimeEntity);

        System.out.println(showtimeEntity + " showtimeEntity");

        return showtimeMapper.toResponse(showtimeEntity);
    }

    @Override
    public ShowtimeResponse create(ShowtimeRequest showtimeRequest) {
        return null;
    }

    @Override
    public Iterable<ShowtimeResponse> findAll(int pageNo, int pageSize, String sortBy, String sortDir) {
        org.springframework.data.domain.Sort sort = sortDir.equalsIgnoreCase(org.springframework.data.domain.Sort.Direction.ASC.name())
                ? org.springframework.data.domain.Sort.by(sortBy).ascending()
                : org.springframework.data.domain.Sort.by(sortBy).descending();
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(pageNo, pageSize, sort);
        return showtimeRepo.findAll(pageable).getContent().stream()
                .map(showtimeMapper::toResponse).toList();
    }

    @Override
    public ShowtimeResponse update(ShowtimeRequest showtimeRequest) {
        return null;
    }

    @Override
    public void delete(int id) {
        showtimeRepo.deleteById(id);
    }

    @Override
    public ShowtimeResponse findById(int id) {
        ShowtimeEntity showtimeEntity = showtimeRepo.findById(id).orElseThrow(
                () -> new ShowtimeException("Invalid Showtime Id")
        );
        return showtimeMapper.toResponse(showtimeEntity);
    }

    @Override
    public java.util.List<ShowtimeResponse> findByMovieId(int movieId) {
        return showtimeRepo.findByMovieId(movieId).stream()
                .map(showtimeMapper::toResponse).toList();
    }

}
