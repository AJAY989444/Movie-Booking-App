package vn.edu.likelion.movie_tickets_online_bookings.service.implement;


import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.LoginRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.UpdatePasswordRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.UserRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.UserResponse;
import vn.edu.likelion.movie_tickets_online_bookings.entity.UserEntity;
import vn.edu.likelion.movie_tickets_online_bookings.exception.UserException;
import vn.edu.likelion.movie_tickets_online_bookings.mapper.UserMapper;
import vn.edu.likelion.movie_tickets_online_bookings.repository.UserRepo;
import vn.edu.likelion.movie_tickets_online_bookings.service.UserService;

import java.util.regex.Pattern;

@Service
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserResponse create(UserRequest userRequest) {
        log.info("Performing email validation");
        if (isEmailExists(userRequest.getEmail())) {
            throw new UserException("User is already exist ...!");
        }

        log.info("validating password");
        if (!matchesRegex(userRequest.getPassword())) {
            throw new UserException("Invalid Password!");
        }

        UserEntity userEntity = userMapper.toEntity(userRequest);
        System.out.println(userEntity);
        userRepo.save(userEntity);

        log.info("Registration successfully");
        return userMapper.toResponse(userEntity);

    }

    @Override
    public Iterable<UserResponse> findAll(int pageNo, int pageSize, String sortBy, String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        return userRepo.findAll(pageable).getContent().stream()
                .map(userMapper::toResponse).toList();
    }

    @Override
    public UserResponse update(UserRequest userRequest) {

        UserEntity userEntity = userMapper.toEntity(userRequest);
        userRepo.save(userEntity);

        log.info("Update successfully");
        return userMapper.toResponse(userEntity);
    }

    @Override
    public void delete(int id) {

    }

    @Override
    public UserResponse findById(int id) {
        UserEntity userEntity = userRepo.findById(id).orElseThrow(
                () -> new UserException("User Not Found ...!")
        );
        return userMapper.toResponse(userEntity);
    }

    @Override
    public UserResponse findByEmail(String email) {
        UserEntity userEntity = userRepo.findByEmail(email).orElseThrow(
                () -> new UserException("Invalid Email ...!")
        );
        return userMapper.toResponse(userEntity);
    }

    @Override
    public String updatePassword(String email, UpdatePasswordRequest updatePasswordRequest) {
        int in = userRepo.updatePasswordByEmail(email, passwordEncoder.encode(updatePasswordRequest.getNewPassword()));
        System.out.println(in + "=========test");
        return "Update Password Successfully ...!";
    }

    // custom validation
    private boolean isEmailExists(String email) {
        return userRepo.findByEmail(email).isPresent();
    }

    private boolean matchesRegex(String input) {
        if (input.length() < 8)
            return false;
        String regex = "(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}";
        return Pattern.compile(regex).matcher(input).matches();
    }
}
