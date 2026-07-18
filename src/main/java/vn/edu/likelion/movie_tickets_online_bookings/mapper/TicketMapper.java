package vn.edu.likelion.movie_tickets_online_bookings.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.TicketRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.TicketResponse;
import vn.edu.likelion.movie_tickets_online_bookings.entity.TicketEntity;

@Mapper(componentModel = "spring")
public interface TicketMapper {

    @Mapping( target = "price", constant = "90000")
    TicketEntity toEntity(TicketRequest ticketRequest);

    @Mapping( source = "createdAt", target = "bookingTime")
    TicketResponse toResponse(TicketEntity ticketEntity);

}
