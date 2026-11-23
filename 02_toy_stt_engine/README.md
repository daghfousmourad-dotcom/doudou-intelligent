# Pilier 2 — Moteur STT d'Écoute Pédiatrique (`02_toy_stt_engine`)

> **Système d'Acquisition Vocale & Détection de Parole pour Enfants**  
> *Traitement Temps Réel • Échantillonnage : 16 kHz • Détection d'Activité Vocale (VAD) • Robustesse aux Bruits de Chambre*

---

## 🌟 Rôle & Mission du Pilier 2

Le moteur STT (*Speech-To-Text*) donne à la peluche la capacité d'entendre et de comprendre l'enfant dans un contexte réel (chambre à coucher, jeux au sol, bruits de jouets, chuchotements) :
1. **Flux Microphone Continu** : Capture les ondes sonores par tranches de 30 millisecondes (480 échantillons à 16 kHz) sans monopoliser le processeur.
2. **Détecteur d'Activité Vocale Pédiatrique (VAD)** : Filtre les respirations, les frottements de drap et le silence de la nuit pour n'enclencher la transcription que lorsque l'enfant s'exprime réellement.
3. **Transcription Spécialisée Voix d'Enfants** : Module adapté à la prosodie aiguë (F0 entre 250 et 450 Hz) et aux spécificités articulatoires des jeunes enfants (3 à 8 ans).

---

## 📁 Architecture Détaillée du Dossier

```
02_toy_stt_engine/
├── audio_capture/
│   ├── __init__.py
│   └── microphone_stream.py          # Capture micro en streaming continu par paquets de 30ms
├── vad/
│   ├── __init__.py
│   └── voice_activity_detector.py    # Détecteur d'activité vocale (Pediatric VAD) basé sur l'énergie et la fréquence
├── transcription/
│   ├── __init__.py
│   └── pediatric_transcriber.py      # Transcripteur vocal vers texte adapté aux phonèmes enfantins
├── tests/
│   ├── __init__.py
│   └── test_stt_engine.py            # Suite de tests unitaires automatisée (capture, VAD, transcription)
└── README.md                         # Le présent document d'ingénierie
```

---

## ⚙️ Spécifications Techniques

* **Fréquence d'Échantillonnage** : 16 000 Hz (Mono, 16 bits PCM / Float32).
* **Taille de Trame** : 480 échantillons = 30 millisecondes.
* **Seuil d'Énergie VAD** : Énergie RMS adaptative calibrée pour ignorer le bruit de fond (< 0.01) et réagir immédiatement à la parole (> 0.02).
* **Consommation Mémoire** : < 15 Mo en RAM active.

---

## 🧪 Tests & Validation

Pour lancer la suite de tests unitaires de ce pilier :
```bash
python3 tests/test_stt_engine.py
```
> **Tests vérifiés** :
> 1. `test_microphone_stream` : Démarre le flux, lit une trame de 480 échantillons à 16kHz, arrête le flux proprement.
> 2. `test_vad_detection` : Vérifie l'ignorance du silence pur et la détection infaillible d'une parole simulée.
> 3. `test_transcription` : Valide la génération d'un texte valide à partir d'un segment audio.
