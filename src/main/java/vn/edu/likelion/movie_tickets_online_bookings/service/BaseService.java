package vn.edu.likelion.movie_tickets_online_bookings.service;

public interface BaseService<T, K> {
    K create(T t);

    Iterable<K> findAll(int pageNo, int pageSize, String sortBy, String sortDir);

    K update(T t);

    void delete(int id);

    K findById(int id);
}
