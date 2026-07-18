package vn.edu.likelion.movie_tickets_online_bookings.service;

import vn.edu.likelion.movie_tickets_online_bookings.dto.request.TicketRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.TicketResponse;

import java.util.List;

public interface TicketService extends BaseService<TicketRequest, TicketResponse>{
    TicketResponse createTicket(int movie_id, TicketRequest ticketRequest);
    List<TicketResponse> findByUserId(int userId);
}

