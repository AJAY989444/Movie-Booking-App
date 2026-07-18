package vn.edu.likelion.movie_tickets_online_bookings.mapper;

import org.mapstruct.*;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.SeatRequestDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.SeatResponseDTO;
import vn.edu.likelion.movie_tickets_online_bookings.entity.SeatEntity;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface SeatMapper {

    @Mapping(source = "hallId", target = "hall.id")
    SeatEntity toEntity(SeatRequestDTO dto);

    @Mapping(source = "hall.id", target = "hallId")
    SeatResponseDTO toResponseDTO(SeatEntity entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "hallId", target = "hall.id")
    void updateEntityFromDTO(SeatRequestDTO dto, @MappingTarget SeatEntity entity);
}
