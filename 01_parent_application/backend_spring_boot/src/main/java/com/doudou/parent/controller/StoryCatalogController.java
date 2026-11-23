package com.doudou.parent.controller;

import com.doudou.parent.model.StoryBook;
import com.doudou.parent.service.StoryCatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog")
public class StoryCatalogController {

    private final StoryCatalogService catalogService;

    public StoryCatalogController(StoryCatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public ResponseEntity<List<StoryBook>> listBooks() {
        return ResponseEntity.ok(catalogService.listBooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoryBook> getBook(@PathVariable String id) {
        StoryBook book = catalogService.getBook(id);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(book);
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<StoryBook> toggleBook(@PathVariable String id) {
        StoryBook updated = catalogService.toggleBookInstallation(id);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}
