package vn.edu.likelion.movie_tickets_online_bookings.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.likelion.movie_tickets_online_bookings.entity.TicketEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepo extends JpaRepository<TicketEntity, Integer> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM TicketEntity t WHERE t.seat.id = :seatId AND t.showtime.id = :showtimeId AND t.status <> vn.edu.likelion.movie_tickets_online_bookings.entity.enums.TicketStatus.CANCELED")
    Optional<TicketEntity> findActiveTicketForSeatAndShowtimeForUpdate(@Param("seatId") int seatId, @Param("showtimeId") int showtimeId);

    List<TicketEntity> findByUserId(int userId);
}