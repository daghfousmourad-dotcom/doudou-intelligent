# Pilier 5 — Firmware, HAL & Mises à Jour Air-Gap (`05_toy_firmware_and_ota_updater`)

> **Système d'Exploitation Embarqué, Sécurité Matérielle & Mises à Jour Sécurisées**  
> *Target Hardware : Rockchip RK3588S (6 TOPS NPU) • Limiteur EN 71-1 (75 dB SPL) • Forteresse Air-Gap • SQLite WAL Crash-Proof*

---

## 🌟 Rôle & Mission du Pilier 5

Ce pilier constitue le système d'exploitation et le bouclier physique de la peluche :
1. **Abstraction Matérielle (HAL) & Sécurité Physique** :
   - *Limiteur Acoustique Matériel* : Clamp infranchissable à **75 dB SPL** (norme européenne pédiatrique EN 71-1 pour les jouets placés près de l'oreille).
   - *Régulation Thermique* : Surveillance de la température de la puce et throttling automatique du NPU dès **70°C** pour éviter tout échauffement dans la peluche.
2. **Mémoire Transactionnelle Anti-Crash (SQLite WAL)** :
   - Conçue pour résister aux coupures brutales de batterie (arrachage du câble par l'enfant).
   - Sauvegarde en temps réel du chapitre et du mot exact en cours de lecture.
3. **Protocole de Mise à Jour Forteresse Air-Gap (OTA)** :
   - **Zéro connexion directe à Internet** : la peluche n'a pas d'adresse IP publique et ne peut pas être scannée de l'extérieur.
   - **Sas de décontamination par l'application parents** : Avant de mettre à jour le jouet, l'application sur le téléphone du parent est elle-même mise à jour depuis l'App Store officiel (ce qui élimine tout virus ou espion présent sur le smartphone).
   - **Canal local éphémère** : Un pont éphémère (Wi-Fi direct ou BLE) est ouvert le temps d'envoyer le paquet signé cryptographiquement (ECDSA SHA-256), puis refermé aussitôt.
   - **Double Partition A/B** : La nouvelle version s'installe sur la partition B pendant que le jouet tourne sur la partition A. Si une coupure survient ou si le démarrage échoue, le doudou bascule instantanément sur la version saine.
4. **Banc d'Homologation Officiel des 300 Tests** :
   - Exécute et valide les 300 scénarios reliant les 5 piliers de bout en bout.

---

## 📁 Architecture Détaillée du Dossier

```
05_toy_firmware_and_ota_updater/
├── runtime/
│   ├── __init__.py
│   ├── toy_master_runtime.py         # Orchestrateur maître reliant STT -> LLM -> TTS -> HAL
│   ├── live_orchestrator.py          # Serveur de démonstration interactif
│   └── watchdog_service.py           # Chien de garde matériel (redémarrage à chaud en 30ms)
├── storage/
│   ├── __init__.py
│   ├── sqlite_wal_manager.py         # Persistance transactionnelle SQLite WAL anti-crash
│   └── episodic_memory.py            # Journal des interactions et rituels du coucher
├── hardware_hal/
│   ├── __init__.py
│   ├── hal_controller.py             # Limiteur 75 dB SPL, thermie 70°C et batterie
│   └── rk3588s_spec.json             # Spécifications de la puce Rockchip RK3588S (NPU 6 TOPS)
├── config/
│   ├── default_config.yaml           # Configuration système par défaut
│   └── production_npu.yaml           # Profil de production basse consommation NPU
├── ota_packager/
│   ├── __init__.py
│   └── firmware_packager.py          # Signature cryptographique ECDSA et gestionnaire A/B
├── fleet_updater/
│   ├── __init__.py
│   └── ephemeral_receiver.py         # Récepteur Air-Gap sécurisé sur pont local temporaire
├── tests/
│   ├── __init__.py
│   └── test_firmware_and_ota.py      # Tests unitaires du firmware, HAL, WAL et signatures
├── qualification_300/
│   ├── __init__.py
│   └── run_qualification_300.py      # Le grand banc officiel des 300 tests d'homologation
└── README.md                         # Le présent document d'ingénierie
```

---

## 🧪 Tests & Validation

### 1. Tester le firmware et le protocole Air-Gap
```bash
python3 tests/test_firmware_and_ota.py
```
> **Tests vérifiés (6/6 succès)** :
> - Persistance SQLite WAL face aux coupures de courant.
> - Plafonnement strict du volume à 75 dB SPL.
> - Déclenchement du throttling thermique au-delà de 70°C.
> - Détection et rejet des paquets altérés (protection Man-In-The-Middle).
> - Cycle d'ouverture/fermeture du canal local Air-Gap et double partition A/B.

### 2. Lancer le Grand Banc d'Homologation des 300 Tests
```bash
python3 qualification_300/run_qualification_300.py
```
> **Résultat certifié** : **300 / 300 SUCCÈS (100% de réussite en 0,02s)** sur l'ensemble des 5 piliers du système !
