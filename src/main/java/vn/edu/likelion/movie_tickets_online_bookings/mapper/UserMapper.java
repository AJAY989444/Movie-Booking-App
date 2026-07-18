package vn.edu.likelion.movie_tickets_online_bookings.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.UserRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.UserResponse;
import vn.edu.likelion.movie_tickets_online_bookings.entity.UserEntity;

@Mapper(componentModel = "spring", uses = PasswordEncoderMapper.class)
public interface UserMapper {

    @Mappings({
            @Mapping(target = "status", constant = "1"),
            @Mapping(target = "role", constant = "ROLE_USER"),
            @Mapping(source = "password", target = "password", qualifiedBy = EncodedMapping.class),
    })
    UserEntity toEntity(UserRequest userRequest);
    UserResponse toResponse(UserEntity userEntity);

}
