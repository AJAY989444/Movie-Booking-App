package vn.edu.likelion.movie_tickets_online_bookings.service;

import vn.edu.likelion.movie_tickets_online_bookings.dto.request.ShowtimeRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.ShowtimeResponse;

import java.util.List;

public interface ShowtimeService extends BaseService<ShowtimeRequest, ShowtimeResponse>{
    ShowtimeResponse createShowtime(int movie_id, ShowtimeRequest showtimeRequest);
    List<ShowtimeResponse> findByMovieId(int movieId);
}

