package com.doudou.parent.service;

import com.doudou.parent.model.StoryBook;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class StoryCatalogService {

    private final List<StoryBook> catalog = new CopyOnWriteArrayList<>();

    public StoryCatalogService() {
        catalog.add(new StoryBook("book_01", "Le Petit Lapin et les Carottes Dorées", "Jour / Aventure", "3-6 ans", 8, true));
        catalog.add(new StoryBook("book_02", "Le Mystère des Étoiles Scintillantes", "Nuit / Sommeil", "3-7 ans", 12, true));
        catalog.add(new StoryBook("book_03", "La Cabane Magique au Fond du Jardin", "Jour / Découverte", "4-8 ans", 10, false));
    }

    public List<StoryBook> listBooks() {
        return new ArrayList<>(catalog);
    }

    public StoryBook getBook(String id) {
        return catalog.stream()
                .filter(b -> b.id().equals(id))
                .findFirst()
                .orElse(null);
    }

    public StoryBook toggleBookInstallation(String id) {
        for (int i = 0; i < catalog.size(); i++) {
            StoryBook b = catalog.get(i);
            if (b.id().equals(id)) {
                StoryBook updated = new StoryBook(
                    b.id(), b.title(), b.category(), b.targetAge(), b.durationMinutes(), !b.installedOnToy()
                );
                catalog.set(i, updated);
                return updated;
            }
        }
        return null;
    }
}
