package vn.edu.likelion.movie_tickets_online_bookings.mapper;

import org.mapstruct.*;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.MovieRequestDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.MovieResponseDTO;
import vn.edu.likelion.movie_tickets_online_bookings.entity.MovieEntity;

@Mapper(componentModel = "spring")
public interface MovieMapper {

    MovieEntity toEntity(MovieRequestDTO dto);

    //    @Mapping(source = "createdAt", target = "createdAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    //    @Mapping(source = "updatedAt", target = "updatedAt", dateFormat = "yyyy-MM-dd HH:mm:ss")
    MovieResponseDTO toResponseDTO(MovieEntity entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(MovieRequestDTO dto, @MappingTarget MovieEntity entity);
}
