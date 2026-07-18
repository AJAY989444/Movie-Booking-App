package vn.edu.likelion.movie_tickets_online_bookings.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.ShowtimeRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.ShowtimeResponse;
import vn.edu.likelion.movie_tickets_online_bookings.entity.ShowtimeEntity;

@Mapper( componentModel = "spring" )
public interface ShowtimeMapper {

    ShowtimeEntity toEntity(ShowtimeRequest showtimeRequest);

    @Mapping( source = "createdAt", target = "createdAt")
    ShowtimeResponse toResponse(ShowtimeEntity showtimeEntity);
}
