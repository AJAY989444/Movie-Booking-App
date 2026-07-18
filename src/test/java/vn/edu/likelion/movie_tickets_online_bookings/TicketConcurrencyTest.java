package vn.edu.likelion.movie_tickets_online_bookings;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.TicketRequest;
import vn.edu.likelion.movie_tickets_online_bookings.entity.HallEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.MovieEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.SeatEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.ShowtimeEntity;
import vn.edu.likelion.movie_tickets_online_bookings.entity.enums.TicketStatus;
import vn.edu.likelion.movie_tickets_online_bookings.repository.*;
import vn.edu.likelion.movie_tickets_online_bookings.service.TicketService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class TicketConcurrencyTest {

    @Autowired
    private TicketService ticketService;
    @Autowired
    private HallRepo hallRepo;
    @Autowired
    private SeatRepo seatRepo;
    @Autowired
    private MovieRepo movieRepo;
    @Autowired
    private ShowtimeRepo showtimeRepo;
    @Autowired
    private TicketRepo ticketRepo;

    private int seatId;
    private int showtimeId;
    private int movieId;

    @BeforeEach
    void setUp() {
        HallEntity hall = new HallEntity();
        hall.setName("Concurrency Test Hall " + System.nanoTime());
        hall.setCapacity(10);
        hall = hallRepo.save(hall);

        SeatEntity seat = new SeatEntity();
        seat.setSeatNumber("C1");
        seat.setHall(hall);
        seat = seatRepo.save(seat);
        seatId = seat.getId();

        MovieEntity movie = new MovieEntity();
        movie.setName("Concurrency Test Movie " + System.nanoTime());
        movie.setDescription("test");
        movie.setReleaseDate(LocalDate.now());
        movie.setCast("test cast");
        movie.setRating(5.0);
        movie = movieRepo.save(movie);
        movieId = movie.getId();

        ShowtimeEntity showtime = new ShowtimeEntity();
        showtime.setShowtimeDate(LocalDate.now().plusDays(1));
        showtime.setStartTime(LocalTime.of(18, 0));
        showtime.setDuration(120);
        showtime.setHall(hall);
        showtime.setMovie(movie);
        showtime = showtimeRepo.save(showtime);
        showtimeId = showtime.getId();
    }

    @Test
    void onlyOneThreadShouldSuccessfullyBookTheSameSeat() throws InterruptedException {
        int threadCount = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch readyLatch = new CountDownLatch(threadCount);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threadCount);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        for (int i = 0; i < threadCount; i++) {
            final int userId = i + 1;
            executor.submit(() -> {
                try {
                    readyLatch.countDown();
                    startLatch.await(); // all threads block here until released together

                    TicketRequest request = new TicketRequest(
                            TicketStatus.AVAILABLE, userId, seatId, showtimeId, userId
                    );
                    ticketService.createTicket(movieId, request);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        readyLatch.await();           // wait until all threads are ready
        startLatch.countDown();       // release all threads at the exact same instant
        doneLatch.await();            // wait for all threads to finish
        executor.shutdown();

        System.out.println("Successes: " + successCount.get() + " | Failures: " + failureCount.get());

        assertEquals(1, successCount.get(), "Exactly one booking should succeed");
        assertEquals(threadCount - 1, failureCount.get(), "All other bookings should fail");

        long actualTicketsInDb = ticketRepo.findAll().stream()
                .filter(t -> t.getSeat().getId() == seatId && t.getShowtime().getId() == showtimeId)
                .count();
        assertEquals(1, actualTicketsInDb, "Only one ticket row should exist for this seat+showtime");
    }
}