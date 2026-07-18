package vn.edu.likelion.movie_tickets_online_bookings.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.edu.likelion.movie_tickets_online_bookings.entity.MovieEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepo extends JpaRepository<MovieEntity, Integer> {
    Optional<MovieEntity> findByIdAndDeletedIsFalse(int id);
    Optional<MovieEntity> findByNameAndDeletedIsFalse(String name);
    long countByDeleted(boolean deleted);
    List<MovieEntity> findAllByDeleted(boolean deleted, Sort sort);
    @Query("SELECT m FROM MovieEntity m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :name, '%')) AND m.deleted = false")
    List<MovieEntity> findAllByNameContainingIgnoreCaseAndDeletedIsFalse(@Param("name") String name);
}
