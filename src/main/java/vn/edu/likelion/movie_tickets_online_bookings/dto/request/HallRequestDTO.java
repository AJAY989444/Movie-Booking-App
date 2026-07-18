package vn.edu.likelion.movie_tickets_online_bookings.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HallRequestDTO {

    @NotBlank(message = "Hall name cannot be blank")
    private String name;

    @NotNull(message = "Hall capacity cannot be null")
    private int capacity;
}
