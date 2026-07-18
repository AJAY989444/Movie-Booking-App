package vn.edu.likelion.movie_tickets_online_bookings.controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.likelion.movie_tickets_online_bookings.dto.request.TicketRequest;
import vn.edu.likelion.movie_tickets_online_bookings.dto.response.TicketResponse;
import vn.edu.likelion.movie_tickets_online_bookings.service.TicketService;

@RestController
@RequestMapping("/api/tickets")
@AllArgsConstructor
@CrossOrigin("*")
public class TicketController {

    @Autowired
    TicketService ticketService;

    @PostMapping("/{movie_id}")
    private ResponseEntity<TicketResponse> bookingTicket(@PathVariable int movie_id,
                                                         @RequestBody TicketRequest ticketRequest ){
        TicketResponse ticketResponse = ticketService.createTicket(movie_id, ticketRequest);
        System.out.println(ticketResponse);
        return new ResponseEntity<>(ticketResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{ticket_id}")
    private ResponseEntity<TicketResponse> findTicketById(@PathVariable int ticket_id){
        TicketResponse ticketResponse = ticketService.findById(ticket_id);
        System.out.println(ticketResponse);
        return new ResponseEntity<>(ticketResponse, HttpStatus.OK);
    }

    @GetMapping("/user/{user_id}")
    private ResponseEntity<java.util.List<TicketResponse>> findTicketsByUserId(@PathVariable int user_id){
        return new ResponseEntity<>(ticketService.findByUserId(user_id), HttpStatus.OK);
    }

    @GetMapping
    private ResponseEntity<Iterable<TicketResponse>> findAll(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "1000", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "asc", required = false) String sortDir
    ) {
        return new ResponseEntity<>(ticketService.findAll(pageNo, pageSize, sortBy, sortDir), HttpStatus.OK);
    }

    @DeleteMapping("/{ticket_id}")
    private ResponseEntity<Void> deleteTicket(@PathVariable int ticket_id){
        ticketService.delete(ticket_id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

