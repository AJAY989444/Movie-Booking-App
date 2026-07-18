package vn.edu.likelion.movie_tickets_online_bookings.service;

import vn.edu.likelion.movie_tickets_online_bookings.dto.request.LoginRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.UpdatePasswordRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.UserRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.UserResponse;

public interface UserService extends BaseService<UserRequest, UserResponse> {
    UserResponse findByEmail(String email);
    String updatePassword(String email, UpdatePasswordRequest updatePasswordRequest);
}
