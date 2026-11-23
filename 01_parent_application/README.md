# Pilier 1 — Application des Parents (`01_parent_application`)

> **Tableau de Bord & Microservices Parentaux**  
> *Backend : Java 21/25 & Spring Boot 3 RESTful • Frontend : React 18, Vite & Tailwind CSS • Conformité : COPPA & RGPD-K*

---

## 🌟 Rôle & Mission du Pilier 1

Ce pilier constitue l'interface de contrôle et de paramétrage mise à disposition des parents sur leur smartphone ou tablette :
1. **Sécurité & Authentification** : Seuls les parents légitimes peuvent administrer la peluche ou consulter les bilans.
2. **Personnalisation Pédiatrique** : Réglage du prénom de l'enfant, de son âge précis, de l'heure cible du coucher et de ses thèmes d'aventure favoris.
3. **Bibliothèque de Contes** : Catalogue interactif permettant d'installer ou de retirer des histoires dans la mémoire interne du doudou.
4. **Journal du Sommeil COPPA** : Suivi statistique de l'apaisement nocturne (temps d'endormissement moyen, qualité du sommeil) dans le respect absolu de la vie privée (aucun micro d'ambiance de la chambre n'est jamais enregistré).
5. **Passerelle Éphémère Air-Gap** : Ouvre un canal local temporaire (Wi-Fi direct ou Bluetooth BLE sécurisé) pour synchroniser les données avec la peluche, puis le referme aussitôt pour sanctuariser le jouet.

---

## 📁 Architecture Détaillée du Dossier

```
01_parent_application/
├── backend_spring_boot/            # Backend d'Entreprise Java Spring Boot 3 RESTful
│   ├── pom.xml                     # Définition Maven (Spring Boot Web, Validation, JUnit 5)
│   ├── src/main/java/com/doudou/parent/
│   │   ├── DoudouParentApplication.java  # Classe principale Spring Boot
│   │   ├── config/
│   │   │   └── WebSecurityCorsConfig.java # Configuration CORS pour React Vite
│   │   ├── model/ (DTOs & Records immutables)
│   │   │   ├── AuthRequest.java & AuthResponse.java
│   │   │   ├── ChildProfile.java
│   │   │   ├── StoryBook.java
│   │   │   ├── SleepLog.java & SleepSummary.java
│   │   │   └── GatewayStatus.java
│   │   ├── service/ (Logique métier des microservices)
│   │   │   ├── AuthService.java          # Gestion des sessions et jetons Bearer
│   │   │   ├── ChildProfileService.java  # Profil enfant (Léa, 4.5 ans)
│   │   │   ├── StoryCatalogService.java  # Bibliothèque de contes interactifs
│   │   │   ├── SleepTrackerService.java  # Agrégation COPPA du sommeil
│   │   │   └── GatewayBridgeService.java # Gestion du pont-levis local Air-Gap
│   │   └── controller/ (Contrôleurs RESTful)
│   │       ├── AuthController.java          # /api/v1/auth
│   │       ├── ChildProfileController.java  # /api/v1/profile
│   │       ├── StoryCatalogController.java  # /api/v1/catalog
│   │       ├── SleepTrackerController.java  # /api/v1/sleep
│   │       └── GatewayBridgeController.java # /api/v1/gateway
│   └── src/test/java/com/doudou/parent/     # Tests unitaires JUnit 5 & MockMvc (10/10 succès)
│
└── frontend/                       # Application Web Réactive
    ├── package.json & vite.config.js
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── LoginPage.jsx                # Connexion parentale sécurisée
    │   │   ├── DashboardPage.jsx            # Accueil parents (profil, histoires, sommeil)
    │   │   └── AdminDashboardPage.jsx       # Paramétrage avancé et passerelle
    │   └── main.jsx
    └── dist/                                # Build de production optimisé
```

---

## 🌐 Spécification des Endpoints RESTful

| Méthode | URL | Description | Payload / Réponse |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/auth/login` | Authentification parent | `{ email, password }` → `{ token, status }` |
| **GET** | `/api/v1/auth/verify` | Vérification du jeton | Header `Authorization: Bearer <tok>` → `{ valid: true }` |
| **GET** | `/api/v1/profile` | Lecture du profil enfant | Renvoie `{ firstName: "Léa", ageYears: 4.5, ... }` |
| **PUT** | `/api/v1/profile` | Mise à jour du profil | Met à jour l'âge ou l'heure du coucher |
| **GET** | `/api/v1/catalog` | Liste des contes | Renvoie la liste des livres et leur état d'installation |
| **POST** | `/api/v1/catalog/{id}/toggle` | Activer/Désactiver un conte | Bascule l'état `installedOnToy` |
| **GET** | `/api/v1/sleep/summary` | Bilan du sommeil | Renvoie `{ status, averageTimeToSleepMin, latestLog }` |
| **POST** | `/api/v1/sleep/log` | Enregistrer un rituel | `{ latencyMin, comfortNeeded }` |
| **GET** | `/api/v1/gateway/status` | État du pont local | `{ channelOpen, toyIp, toyPort, securityProtocol }` |
| **POST** | `/api/v1/gateway/open` | Ouvrir le canal temporaire | Ouvre le pont Wi-Fi/Bluetooth vers la peluche |
| **POST** | `/api/v1/gateway/close` | Fermer le canal | Coupe la liaison pour sanctuariser l'Air-Gap |

---

## 🧪 Tests & Exécution

### 1. Lancer les tests unitaires Java Spring Boot (10/10 succès)
```bash
cd backend_spring_boot
mvn test
```

### 2. Démarrer le backend Spring Boot en local (Port 8080)
```bash
cd backend_spring_boot
mvn spring-boot:run
```

### 3. Compiler l'interface React + Vite
```bash
cd frontend
npm run build
```

### 4. Démarrer l'interface React en mode développement (Port 5173)
```bash
cd frontend
npm run dev
```
