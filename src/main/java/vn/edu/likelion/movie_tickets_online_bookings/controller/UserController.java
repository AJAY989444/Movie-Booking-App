package vn.edu.likelion.movie_tickets_online_bookings.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.UpdatePasswordRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.UserRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.UserResponse;
import vn.edu.likelion.movie_tickets_online_bookings.entity.UserEntity;
import vn.edu.likelion.movie_tickets_online_bookings.service.UserService;
import vn.edu.likelion.movie_tickets_online_bookings.utils.AppConstants;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping
    private ResponseEntity<UserResponse> registerUser(@RequestBody UserRequest userRequest) {
        UserResponse userResponse = userService.create(userRequest);
        return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
    }

    @GetMapping
    private Iterable<UserResponse> findAll(
            @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY, required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION, required = false) String sortDir,
            @RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER, required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE, required = false) int pageSize

    ) {
        return userService.findAll(pageNo, pageSize, sortBy, sortDir);
    }

    @GetMapping("/me")
    private ResponseEntity<UserResponse> getProfile(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getPrincipal().toString();

        UserResponse userResponse = userService.findByEmail(auth.getPrincipal().toString());

        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @PutMapping("/updatePassword")
    private String updatePassword(@RequestBody UpdatePasswordRequest updatePasswordRequest){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        System.out.println(auth + updatePasswordRequest.toString());

        return userService.updatePassword(auth.getPrincipal().toString(), updatePasswordRequest);
    }

    @GetMapping("/{user_id}")
    private ResponseEntity<?> getDetailsUser(@PathVariable int user_id){
        UserResponse userResponse = userService.findById(user_id);
        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }
}
