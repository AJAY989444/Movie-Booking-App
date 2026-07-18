package vn.edu.likelion.movie_tickets_online_bookings.service;

import vn.edu.likelion.movie_tickets_online_bookings.dto.request.SeatRequestDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.SeatResponseDTO;

import java.util.List;

public interface SeatService {
    SeatResponseDTO create(SeatRequestDTO dto);
    List<SeatResponseDTO> findAll();
    List<SeatResponseDTO> findAllByHall(int hallId);
    SeatResponseDTO update(SeatRequestDTO dto, int id);
    void delete(int id);
    SeatResponseDTO findById(int id);
}
