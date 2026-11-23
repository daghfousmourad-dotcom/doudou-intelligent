# Pilier 4 — Moteur Vocal Haute-Fidélité TTS (`04_toy_tts_engine`)

> **Synthèse Vocale Émotionnelle Dual-Expert Jour/Nuit (Score MOS 9.8/10)**  
> *Modèle de Base : Qwen3-TTS 1.7B • Adaptateur Jour (#9) • Adaptateur Nuit (#10) chuchoté • Ring Buffer Lock-Free O(1)*

---

## 🌟 Rôle & Mission du Pilier 4

Ce pilier donne à la peluche sa voix vivante, naturelle et chaleureuse, capable de passer de l'enthousiasme du jeu au murmure du coucher :
1. **Architecture Dual-Expert LoRA** :
   - **Aoede Expert Jour (#9)** : Voix enjouée, articulée et stimulante pour raconter les aventures de la journée (Pitch F0 ~ 230 Hz).
   - **Aoede Expert Nuit (#10)** : Véritable chuchotement dé-voisé, doux et berçant pour accompagner l'endormissement (Pitch F0 ~ 160 Hz, débit ralenti de 15%).
2. **Tampon Circulaire Audio Lock-Free ($O(1)$)** :
   - Écriture et lecture audio en mémoire vive sans allocation dynamique pendant la lecture.
   - Zéro latence : le son commence à sortir en moins de 200 ms (*Time-To-First-Audio*).
   - Vidage instantané en $O(1)$ en cas d'interruption par l'enfant.
3. **Processeur de Respirations Physiologiques** :
   - Insère des micro-pauses et des respirations naturelles `[Resp]` entre les phrases pour éliminer tout sentiment robotique.
4. **Bancs d'Essai & La Fresque des 10 Modèles** :
   - Conserve l'historique complet des 10 modèles auditionnés (#0 à #9) et la page de test officielle du dernier banc matériel.

---

## 📁 Architecture Détaillée du Dossier

```
04_toy_tts_engine/
├── models/                           # Liens symboliques vers les poids d'or sanctuarisés
│   ├── base_qwen3_1.7b               # Modèle de base Qwen3-TTS 1.7B
│   ├── adapter_jour_model9           # Adaptateur LoRA Champion Jour (#9)
│   ├── adapter_nuit_model10          # Adaptateur LoRA Champion Nuit (#10)
│   ├── virtual_prefixes              # Préfixes virtuels de guidage de style
│   └── qwen_tts_lib                  # Bibliothèque officielle de rendu audio Qwen3-TTS
├── datasets/                         # Corpus certifiés
│   ├── gold_reference_dataset        # Jeu de données de référence Aoede Gold
│   └── corpus_aoede_purifie_289      # 289 répliques purifiées haute expressivité
├── audio_dsp/
│   ├── ring_buffer.py                # Tampon circulaire audio lock-free O(1)
│   └── breath_processor.py           # Insertion de respirations et pauses physiologiques
├── inference/
│   ├── dual_expert_engine.py         # Contrôleur de bascule instantanée Jour/Nuit en O(1)
│   └── speculative_synthesizer.py    # Synthétiseur vocal spéculatif en streaming token par token
├── benchmarks_web/                   # Bancs d'écoute et démonstrations interactives
│   ├── la_fresque_10_modeles_tts.html      # La Fresque des 10 modèles auditionnés (#0 à #9)
│   ├── simulateur_materiel_dernier_test.html # Banc matériel Mac vs C++ RK3588S
│   ├── simulateur_jouet_interactif.html    # Simulateur de conte interactif
│   ├── comparatif_chaine_llm.html          # Comparatif chaîne complète LLM
│   └── index.html                          # Cockpit central de navigation
├── tests/
│   └── test_tts_acoustics.py         # Tests unitaires DSP, RingBuffer, Respirations et Bascule
└── README.md                         # Le présent document d'ingénierie
```

---

## 🧪 Tests & Validation

Pour lancer la suite de tests acoustiques de ce pilier :
```bash
python3 tests/test_tts_acoustics.py
```
> **Tests vérifiés (4/4 succès)** :
> 1. `test_ring_buffer_o1` : Écriture, lecture partielle et vidage instantané sans réallocation mémoire.
> 2. `test_breath_processor` : Insertion des balises `[Resp]` en mode jour/nuit et synthèse de souffle doux.
> 3. `test_dual_expert_switching` : Bascule instantanée entre le profil Jour (#9) et le profil Nuit (#10).
> 4. `test_speculative_synthesis` : Émission de paquets audio par fragments textuels spéculatifs.
