package vn.edu.likelion.movie_tickets_online_bookings.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import vn.edu.likelion.movie_tickets_online_bookings.entity.*;
import vn.edu.likelion.movie_tickets_online_bookings.entity.enums.Role;
import vn.edu.likelion.movie_tickets_online_bookings.repository.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private HallRepo hallRepo;

    @Autowired
    private SeatRepo seatRepo;

    @Autowired
    private MovieRepo movieRepo;

    @Autowired
    private ShowtimeRepo showtimeRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("====== Running Data Initializer ======");

        // 1. Seed Admin User
        if (!userRepo.findByEmail("admin@moviebooking.com").isPresent()) {
            UserEntity admin = new UserEntity();
            admin.setName("Admin User");
            admin.setEmail("admin@moviebooking.com");
            admin.setPassword(passwordEncoder.encode("Admin@12345"));
            admin.setPhoneNumber("0123456789");
            admin.setRole(Role.ROLE_ADMIN);
            admin.setStatus(1);
            userRepo.save(admin);
            System.out.println("Admin User seeded successfully.");
        }

        // 2. Seed Customer User
        if (!userRepo.findByEmail("user@moviebooking.com").isPresent()) {
            UserEntity user = new UserEntity();
            user.setName("John Doe");
            user.setEmail("user@moviebooking.com");
            user.setPassword(passwordEncoder.encode("User@12345"));
            user.setPhoneNumber("0987654321");
            user.setRole(Role.ROLE_USER);
            user.setStatus(1);
            userRepo.save(user);
            System.out.println("Customer User seeded successfully.");
        }

        // 3. Seed Halls
        List<HallEntity> halls = new ArrayList<>();
        if (hallRepo.count() == 0) {
            HallEntity screenA = new HallEntity();
            screenA.setName("Screen A");
            screenA.setCapacity(30);
            halls.add(hallRepo.save(screenA));

            HallEntity screenB = new HallEntity();
            screenB.setName("Screen B");
            screenB.setCapacity(20);
            halls.add(hallRepo.save(screenB));
            System.out.println("Halls seeded successfully.");
        } else {
            halls = hallRepo.findAll();
        }

        // 4. Seed Seats
        if (seatRepo.count() == 0 && !halls.isEmpty()) {
            for (HallEntity hall : halls) {
                int capacity = hall.getCapacity();
                char row = 'A';
                int seatCol = 1;
                for (int i = 0; i < capacity; i++) {
                    SeatEntity seat = new SeatEntity();
                    seat.setSeatNumber(String.valueOf(row) + seatCol);
                    seat.setHall(hall);
                    seatRepo.save(seat);

                    seatCol++;
                    if (seatCol > 10) {
                        seatCol = 1;
                        row++;
                    }
                }
            }
            System.out.println("Seats seeded successfully.");
        }

        // 5. Seed Movies
        List<MovieEntity> movies = new ArrayList<>();
        if (movieRepo.count() == 0) {
            MovieEntity movie1 = new MovieEntity();
            movie1.setName("Inception");
            movie1.setDescription("A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.");
            movie1.setCast("Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page");
            movie1.setTrailer("https://www.youtube.com/embed/YoHD9XEInc0");
            movie1.setPosterImageUrl("https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80");
            movie1.setBannerImageUrl("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80");
            movie1.setRating(8.8);
            movie1.setReleaseDate(LocalDate.of(2010, 7, 16));
            movies.add(movieRepo.save(movie1));

            MovieEntity movie2 = new MovieEntity();
            movie2.setName("Interstellar");
            movie2.setDescription("A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.");
            movie2.setCast("Matthew McConaughey, Anne Hathaway, Jessica Chastain");
            movie2.setTrailer("https://www.youtube.com/embed/zSWdZVtXT7E");
            movie2.setPosterImageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80");
            movie2.setBannerImageUrl("https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80");
            movie2.setRating(8.6);
            movie2.setReleaseDate(LocalDate.of(2014, 11, 7));
            movies.add(movieRepo.save(movie2));
            System.out.println("Movies seeded successfully.");
        } else {
            movies = movieRepo.findAll();
        }

        // 6. Seed Showtimes
        if (showtimeRepo.count() == 0 && !movies.isEmpty() && !halls.isEmpty()) {
            // Seeding for movie 1 in Hall A
            ShowtimeEntity showtime1 = new ShowtimeEntity();
            showtime1.setMovie(movies.get(0));
            showtime1.setHall(halls.get(0));
            showtime1.setShowtimeDate(LocalDate.now().plusDays(1));
            showtime1.setStartTime(LocalTime.of(14, 30, 0));
            showtime1.setDuration(148);
            showtimeRepo.save(showtime1);

            // Seeding for movie 2 in Hall B
            ShowtimeEntity showtime2 = new ShowtimeEntity();
            showtime2.setMovie(movies.get(1));
            showtime2.setHall(halls.get(1));
            showtime2.setShowtimeDate(LocalDate.now().plusDays(2));
            showtime2.setStartTime(LocalTime.of(18, 0, 0));
            showtime2.setDuration(169);
            showtimeRepo.save(showtime2);
            System.out.println("Showtimes seeded successfully.");
        }

        System.out.println("====== Data Initialization Completed ======");
    }
}
