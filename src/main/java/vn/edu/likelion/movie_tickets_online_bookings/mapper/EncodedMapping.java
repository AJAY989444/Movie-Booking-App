package vn.edu.likelion.movie_tickets_online_bookings.mapper;

import org.mapstruct.Qualifier;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Qualifier // org.mapstruct.Qualifier
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface EncodedMapping {
}