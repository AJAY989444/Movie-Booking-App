package vn.edu.likelion.movie_tickets_online_bookings.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.HallRequestDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.HallResponseDTO;
import vn.edu.likelion.movie_tickets_online_bookings.entity.HallEntity;
import vn.edu.likelion.movie_tickets_online_bookings.exception.ResourceAlreadyExistsException;
import vn.edu.likelion.movie_tickets_online_bookings.exception.ResourceNotFoundException;
import vn.edu.likelion.movie_tickets_online_bookings.mapper.HallMapper;
import vn.edu.likelion.movie_tickets_online_bookings.repository.HallRepo;
import vn.edu.likelion.movie_tickets_online_bookings.service.HallService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HallServiceImpl implements HallService {

    private final HallRepo hallRepository;
    private final HallMapper hallMapper;

    @Autowired
    public HallServiceImpl(HallRepo hallRepository, HallMapper hallMapper) {
        this.hallRepository = hallRepository;
        this.hallMapper = hallMapper;
    }

    @Override
    public HallResponseDTO create(HallRequestDTO dto) {
        if (hallRepository.findByNameAndDeletedIsFalse(dto.getName()).isPresent()) {
            throw new ResourceAlreadyExistsException("A hall with the name '" + dto.getName() + "' already exists.");
        }

        HallEntity entity = hallMapper.toEntity(dto);
        HallEntity savedEntity = hallRepository.save(entity);
        return hallMapper.toResponseDTO(savedEntity);
    }

    @Override
    public Iterable<HallResponseDTO> findAll(int pageNo, int pageSize, String sortBy, String sortDir) {
        return null;
    }

    @Override
    public List<HallResponseDTO> findAll(boolean statusInDBOfHall, int pageNo, int pageSize, String sortBy, String sortDir) {
        PageRequest pageRequest = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.fromString(sortDir), sortBy));
        Page<HallEntity> pagedResult = hallRepository.findAllByDeleted(pageRequest, statusInDBOfHall);

        return pagedResult
                .stream()
                .map(hallMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public HallResponseDTO update(HallRequestDTO hallRequestDTO) {
        return null;
    }

    @Override
    public HallResponseDTO update(HallRequestDTO dto, int id) {
        HallEntity entity = hallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hall not found with id " + id));

        // Check if the updated name is already taken by another hall
        Optional<HallEntity> existingHall = hallRepository.findByNameAndDeletedIsFalse(dto.getName());
        if (existingHall.isPresent() && existingHall.get().getId() != id) {
            throw new ResourceAlreadyExistsException("A hall with the name '" + dto.getName() + "' already exists.");
        }

        hallMapper.updateEntityFromDTO(dto, entity);
        HallEntity updatedEntity = hallRepository.save(entity);
        return hallMapper.toResponseDTO(updatedEntity);
    }

    @Override
    public void delete(int id) {
        HallEntity entity = hallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hall not found with id " + id));
        entity.setDeleted(true);
        hallRepository.save(entity);
    }

    @Override
    public HallResponseDTO findById(int id) {
        HallEntity entity = hallRepository.findByIdAndDeletedIsFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hall not found with id " + id));
        return hallMapper.toResponseDTO(entity);
    }
}