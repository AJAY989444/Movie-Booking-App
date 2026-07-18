package vn.edu.likelion.movie_tickets_online_bookings.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.SeatRequestDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.SeatResponseDTO;
import vn.edu.likelion.movie_tickets_online_bookings.entity.HallEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.SeatEntity;
import vn.edu.likelion.movie_tickets_online_bookings.exception.ResourceAlreadyExistsException;
import vn.edu.likelion.movie_tickets_online_bookings.exception.ResourceNotFoundException;
import vn.edu.likelion.movie_tickets_online_bookings.mapper.SeatMapper;
import vn.edu.likelion.movie_tickets_online_bookings.repository.SeatRepo;
import vn.edu.likelion.movie_tickets_online_bookings.repository.HallRepo;
import vn.edu.likelion.movie_tickets_online_bookings.service.SeatService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SeatServiceImpl implements SeatService {

    private final SeatRepo seatRepository;
    private final HallRepo hallRepository;
    private final SeatMapper seatMapper;

    @Autowired
    public SeatServiceImpl(SeatRepo seatRepository, HallRepo hallRepository, SeatMapper seatMapper) {
        this.seatRepository = seatRepository;
        this.hallRepository = hallRepository;
        this.seatMapper = seatMapper;
    }

    @Override
    public SeatResponseDTO create(SeatRequestDTO dto) {
        // Check if the seat number already exists in the hall
        if (seatRepository.findBySeatNumberAndHallId(dto.getSeatNumber(), dto.getHallId()).isPresent()) {
            throw new ResourceAlreadyExistsException("A seat with the number '" + dto.getSeatNumber() + "' already exists in the hall.");
        }

        SeatEntity entity = seatMapper.toEntity(dto);
        entity.setHall(hallRepository.findById(dto.getHallId())
                .orElseThrow(() -> new ResourceNotFoundException("Hall not found with id " + dto.getHallId())));
        SeatEntity savedEntity = seatRepository.save(entity);
        return seatMapper.toResponseDTO(savedEntity);
    }

    @Override
    public List<SeatResponseDTO> findAll() {
        return seatRepository.findAll()
                .stream()
                .map(seatMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

//    @Override
//    public SeatResponseDTO update(SeatRequestDTO dto, int id) {
//        SeatEntity entity = seatRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id " + id));
//
//        // Check if the updated seat number is already taken by another seat in the same hall
//        Optional<SeatEntity> existingSeat = seatRepository.findBySeatNumberAndHallId(dto.getSeatNumber(), dto.getHallId());
//        if (existingSeat.isPresent() && existingSeat.get().getId() != id) {
//            throw new ResourceAlreadyExistsException("A seat with the number '" + dto.getSeatNumber() + "' already exists in the hall.");
//        }
//
//        seatMapper.updateEntityFromDTO(dto, entity);
//        SeatEntity updatedEntity = seatRepository.save(entity);
//        return seatMapper.toResponseDTO(updatedEntity);
//    }

    @Override
    public SeatResponseDTO update(SeatRequestDTO dto, int id) {
        // Fetch the existing SeatEntity by ID
        SeatEntity entity = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id " + id));

        // Check if the updated seat number is already taken by another seat in the same hall
        Optional<SeatEntity> existingSeat = seatRepository.findBySeatNumberAndHallId(dto.getSeatNumber(), dto.getHallId());
        if (existingSeat.isPresent() && existingSeat.get().getId() != id) {
            throw new ResourceAlreadyExistsException("A seat with the number '" + dto.getSeatNumber() + "' already exists in the hall.");
        }

        // Find the new HallEntity based on the provided hallId
        HallEntity newHall = hallRepository.findById(dto.getHallId())
                .orElseThrow(() -> new ResourceNotFoundException("Hall not found with id " + dto.getHallId()));

        // Update the HallEntity reference
        entity.setHall(newHall);

        // Update other fields in the SeatEntity
        seatMapper.updateEntityFromDTO(dto, entity);

        // Save the updated SeatEntity
        SeatEntity updatedEntity = seatRepository.save(entity);

        // Return the updated DTO
        return seatMapper.toResponseDTO(updatedEntity);
    }

    @Override
    public void delete(int id) {
        SeatEntity entity = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id " + id));
        seatRepository.delete(entity);
    }

    @Override
    public SeatResponseDTO findById(int id) {
        SeatEntity entity = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id " + id));
        return seatMapper.toResponseDTO(entity);
    }

    @Override
    public List<SeatResponseDTO> findAllByHall(int hallId) {  // New method implementation
        return seatRepository.findAllByHallId(hallId)
                .stream()
                .map(seatMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}