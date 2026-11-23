package com.doudou.parent;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application principale Spring Boot pour le Backend Parents du Doudou Intelligent.
 * Expose l'ensemble des API RESTful pour l'authentification, le profil enfant,
 * la bibliothèque de contes, le suivi du sommeil et la passerelle Air-Gap.
 */
@SpringBootApplication
public class DoudouParentApplication {

    public static void main(String[] args) {
        SpringApplication.run(DoudouParentApplication.class, args);
    }
}
