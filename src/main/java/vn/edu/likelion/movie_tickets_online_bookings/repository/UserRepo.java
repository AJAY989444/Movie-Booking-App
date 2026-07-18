package vn.edu.likelion.movie_tickets_online_bookings.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.likelion.movie_tickets_online_bookings.entity.UserEntity;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByEmail(String email);

    @Modifying
    @Query("UPDATE UserEntity u SET u.password = :newPassword WHERE u.email = :email")
    int updatePasswordByEmail(String email, String newPassword);
}
