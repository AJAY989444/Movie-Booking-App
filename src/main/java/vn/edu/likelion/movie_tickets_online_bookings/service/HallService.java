package vn.edu.likelion.movie_tickets_online_bookings.service;

import vn.edu.likelion.movie_tickets_online_bookings.dto.request.HallRequestDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.HallResponseDTO;

import java.util.List;

public interface HallService extends BaseService<HallRequestDTO, HallResponseDTO> {
    List<HallResponseDTO> findAll(boolean statusInDBOfHall, int pageNo, int pageSize, String sortBy, String sortDir);
    HallResponseDTO update(HallRequestDTO dto, int id);
}
