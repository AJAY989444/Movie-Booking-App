package vn.edu.likelion.movie_tickets_online_bookings.service.implement;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.edu.likelion.movie_tickets_online_bookings.config.SecurityConstant;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.LoginRequest;
import vn.edu.likelion.movie_tickets_online_bookings.entity.UserEntity;
import vn.edu.likelion.movie_tickets_online_bookings.exception.UserException;
import vn.edu.likelion.movie_tickets_online_bookings.repository.UserRepo;
import vn.edu.likelion.movie_tickets_online_bookings.service.AuthService;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    UserRepo userRepo;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public String userLogin(LoginRequest loginRequest) {
        System.out.println("========= login =========");
        UserEntity userEntity = userRepo.findByEmail(loginRequest.getEmail()).orElseThrow(
                () -> new UserException("Email Not Found ...!")
        );

        if( !userEntity.getRole().toString().equals("ROLE_USER") ){
            throw new UserException("Access Denied ...!");
        }

        if(!passwordEncoder.matches(loginRequest.getPassword(), userEntity.getPassword())){
            throw new UserException("Password incorrect ...!");
        }

        SecretKey key = Keys.hmacShaKeyFor(SecurityConstant.JWT_KEY.getBytes());

//        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
//        System.out.println("authorities" + authorities);

        // Thời gian hết hạn (3 ngày tính bằng milliseconds)
        Date expirationDate = new Date((new Date()).getTime() + 3 * 24 * 60 * 60 * 1000);
        System.out.println("expirationDate" + expirationDate);

        SimpleGrantedAuthority sga = new SimpleGrantedAuthority(userEntity.getRole().toString());
        System.out.println("userEntity.getRole().toString()" + userEntity.getRole().toString());

        System.out.println(userEntity + " userEntity");

        return Jwts.builder()
                .setSubject(userEntity.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(expirationDate)
                .signWith(key)
                .claim("authorities", sga.toString())
                .compact();
    }

    @Override
    public String adminLogin(LoginRequest loginRequest) {
        System.out.println("========= login =========");
        UserEntity userEntity = userRepo.findByEmail(loginRequest.getEmail()).orElseThrow(
                () -> new UserException("Email Not Found ...!")
        );

        if( !userEntity.getRole().toString().equals("ROLE_ADMIN") ){
            throw new UserException("Access Denied ...!");
        }

        if(!passwordEncoder.matches(loginRequest.getPassword(), userEntity.getPassword())){
            throw new UserException("Password incorrect ...!");
        }

        SecretKey key = Keys.hmacShaKeyFor(SecurityConstant.JWT_KEY.getBytes());

//        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
//        System.out.println("authorities" + authorities);

        // Thời gian hết hạn (3 ngày tính bằng milliseconds)
        Date expirationDate = new Date((new Date()).getTime() + 3 * 24 * 60 * 60 * 1000);
        System.out.println("expirationDate" + expirationDate);

        SimpleGrantedAuthority sga = new SimpleGrantedAuthority(userEntity.getRole().toString());
        System.out.println("userEntity.getRole().toString()" + userEntity.getRole().toString());

        System.out.println(userEntity + " userEntity");

        return Jwts.builder()
                .setSubject(userEntity.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(expirationDate)
                .signWith(key)
                .claim("authorities", sga.toString())
                .compact();
    }
}
