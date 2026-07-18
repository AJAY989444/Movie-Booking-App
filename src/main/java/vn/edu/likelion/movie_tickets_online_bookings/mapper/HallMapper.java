package vn.edu.likelion.movie_tickets_online_bookings.mapper;

import org.mapstruct.*;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.HallRequestDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.HallResponseDTO;
import vn.edu.likelion.movie_tickets_online_bookings.entity.HallEntity;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring")
public interface HallMapper {

    HallEntity toEntity(HallRequestDTO dto);

    //    @Mapping(source = "createdAt", target = "createTime", dateFormat = "yyyy-MM-dd HH:mm:ss")
    //    @Mapping(source = "updatedAt", target = "updateTime", dateFormat = "yyyy-MM-dd HH:mm:ss")
    HallResponseDTO toResponseDTO(HallEntity entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(HallRequestDTO dto, @MappingTarget HallEntity entity);
}
