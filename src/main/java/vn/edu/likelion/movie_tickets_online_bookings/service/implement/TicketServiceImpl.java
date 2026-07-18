package vn.edu.likelion.movie_tickets_online_bookings.service.implement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.TicketRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.ShowtimeResponse;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.TicketResponse;
import vn.edu.likelion.movie_tickets_online_bookings.entity.SeatEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.ShowtimeEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.TicketEntity;
import vn.edu.likelion.movie_tickets_online_bookings.exception.SeatException;
import vn.edu.likelion.movie_tickets_online_bookings.exception.ShowtimeException;
import vn.edu.likelion.movie_tickets_online_bookings.exception.TicketException;
import vn.edu.likelion.movie_tickets_online_bookings.mapper.TicketMapper;
import vn.edu.likelion.movie_tickets_online_bookings.repository.SeatRepo;
import vn.edu.likelion.movie_tickets_online_bookings.repository.ShowtimeRepo;
import vn.edu.likelion.movie_tickets_online_bookings.repository.TicketRepo;
import vn.edu.likelion.movie_tickets_online_bookings.service.TicketService;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    TicketRepo ticketRepo;
    @Autowired
    ShowtimeRepo showtimeRepo;
    @Autowired
    SeatRepo seatRepo;
    @Autowired
    TicketMapper ticketMapper;

    @Override
    public TicketResponse create(TicketRequest ticketRequest) {
        return null;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public TicketResponse createTicket(int movie_id, TicketRequest ticketRequest) {
        ShowtimeEntity showtimeEntity = showtimeRepo.findById(ticketRequest.getShowtime_id()).orElseThrow(
                () -> new ShowtimeException("Showtime not found ...!")
        );
        SeatEntity seatEntity = seatRepo.findById(ticketRequest.getSeat_id()).orElseThrow(
                () -> new SeatException("Seat not found ...!")
        );

        // Lock and check: is this seat already booked for this showtime?
        ticketRepo.findActiveTicketForSeatAndShowtimeForUpdate(
                ticketRequest.getSeat_id(), ticketRequest.getShowtime_id()
        ).ifPresent(existing -> {
            throw new vn.edu.likelion.movie_tickets_online_bookings.exception.ResourceAlreadyExistsException(
                    "Seat " + seatEntity.getSeatNumber() + " is already booked for this showtime."
            );
        });

        TicketEntity ticketEntity = ticketMapper.toEntity(ticketRequest);
        ticketEntity.setSeat(seatEntity);
        ticketEntity.setShowtime(showtimeEntity);
        ticketEntity.setStatus(vn.edu.likelion.movie_tickets_online_bookings.entity.enums.TicketStatus.BOOKED);

        ticketRepo.save(ticketEntity);

        return ticketMapper.toResponse(ticketEntity);
    }

    @Override
    public Iterable<TicketResponse> findAll(int pageNo, int pageSize, String sortBy, String sortDir) {
        org.springframework.data.domain.Sort sort = sortDir.equalsIgnoreCase(org.springframework.data.domain.Sort.Direction.ASC.name())
                ? org.springframework.data.domain.Sort.by(sortBy).ascending()
                : org.springframework.data.domain.Sort.by(sortBy).descending();
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(pageNo, pageSize, sort);
        return ticketRepo.findAll(pageable).getContent().stream()
                .map(ticketMapper::toResponse).toList();
    }

    @Override
    public TicketResponse update(TicketRequest ticketRequest) {
        return null;
    }

    @Override
    public void delete(int id) {
        TicketEntity ticketEntity = ticketRepo.findById(id).orElseThrow(
                () -> new TicketException("Ticket not found ...!")
        );
        ticketEntity.setStatus(vn.edu.likelion.movie_tickets_online_bookings.entity.enums.TicketStatus.CANCELED);
        ticketRepo.save(ticketEntity);
    }

    @Override
    public TicketResponse findById(int id) {
        TicketEntity ticketEntity = ticketRepo.findById(id).orElseThrow(
                () -> new TicketException("Ticket not found ...!")
        );
        return ticketMapper.toResponse(ticketEntity);
    }

    @Override
    public java.util.List<TicketResponse> findByUserId(int userId) {
        return ticketRepo.findByUserId(userId).stream()
                .map(ticketMapper::toResponse).toList();
    }

}
