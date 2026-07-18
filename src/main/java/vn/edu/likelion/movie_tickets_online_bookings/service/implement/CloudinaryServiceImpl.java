package vn.edu.likelion.movie_tickets_online_bookings.service.implement;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.edu.likelion.movie_tickets_online_bookings.service.CloudinaryService;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Autowired
    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadFile(MultipartFile multipartFile) {
        try {
            return cloudinary.uploader()
                    .upload(multipartFile.getBytes(),
                            Map.of("public_id", UUID.randomUUID().toString()))
                    .get("url")
                    .toString();
        } catch (IOException e) {
            // Handle the exception, e.g., log it or wrap it in a runtime exception
            throw new RuntimeException("Failed to upload file to Cloudinary", e);
        }
    }
}