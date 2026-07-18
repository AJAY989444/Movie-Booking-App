package vn.edu.likelion.movie_tickets_online_bookings.service;

import vn.edu.likelion.movie_tickets_online_bookings.dto.request.LoginRequest;

public interface AuthService {
    String userLogin(LoginRequest loginRequest);
    String adminLogin(LoginRequest loginRequest);
}
