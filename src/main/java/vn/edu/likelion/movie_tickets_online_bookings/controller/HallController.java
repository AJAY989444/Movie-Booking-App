package vn.edu.likelion.movie_tickets_online_bookings.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.HallRequestDTO;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.HallResponseDTO;
import vn.edu.likelion.movie_tickets_online_bookings.service.HallService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/halls")
@CrossOrigin
public class HallController {

    private final HallService hallService;

    @Autowired
    public HallController(HallService hallService) {
        this.hallService = hallService;
    }

    private ResponseEntity<Map<String, Object>> createResponse(String status, Object data, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", status);
        response.put("data", data);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    // Create a new hall
    @PostMapping
    public ResponseEntity<Map<String, Object>> createHall(@Validated @RequestBody HallRequestDTO hallRequestDTO) {
        HallResponseDTO createdHall = hallService.create(hallRequestDTO);
        return createResponse("success", createdHall, "Hall created successfully.");
    }

    // Retrieve a specific hall by ID
    @GetMapping("/id")
    public ResponseEntity<Map<String, Object>> getHallById(@Validated @RequestParam int id) {
        HallResponseDTO hall = hallService.findById(id);
        return createResponse("success", hall, "Hall retrieved successfully.");
    }

    // Retrieve all halls with pagination and sorting
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllHalls(@Validated
                                                           @RequestParam(value = "status", required = false, defaultValue = "false") boolean statusInDBOfHall,
                                                           @RequestParam(value = "page", required = false, defaultValue = "0") int pageNo,
                                                           @RequestParam(value = "size", required = false, defaultValue = "10") int pageSize,
                                                           @RequestParam(value = "sortBy", required = false, defaultValue = "id") String sortBy,
                                                           @RequestParam(value = "sortDir", required = false, defaultValue = "asc") String sortDir) {
        List<HallResponseDTO> halls = hallService.findAll(statusInDBOfHall, pageNo, pageSize, sortBy, sortDir);
        return createResponse("success", halls, "Halls retrieved successfully.");
    }

    // Update an existing hall
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateHall(@Validated @RequestParam int id, @Validated @RequestBody HallRequestDTO hallRequestDTO) {
        HallResponseDTO updatedHall = hallService.update(hallRequestDTO, id);
        return createResponse("success", updatedHall, "Hall updated successfully.");
    }

    // Soft delete a hall by ID
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteHall(@Validated @RequestParam int id) {
        hallService.delete(id);
        return createResponse("success", null, "Hall deleted successfully.");
    }
}