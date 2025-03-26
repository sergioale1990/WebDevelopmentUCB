package org.example.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {
    private final Path rootLocation = Paths.get("src/main/resources/static/uploads");

    public String storeFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new RuntimeException("Archivo vacío");

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path destination = this.rootLocation.resolve(fileName);

        Files.createDirectories(rootLocation);
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
}