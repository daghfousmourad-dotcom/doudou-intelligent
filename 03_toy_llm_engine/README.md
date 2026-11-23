# Pilier 3 — Cerveau LLM & Charte Morale Pédiatrique (`03_toy_llm_engine`)

> **Intelligence Émotionnelle & Conduite Narrative Bienveillante**  
> *Modèle Local : Qwen (Ollama) • Charte Déontologique Formelle • Interruption et Reprise en O(1)*

---

## 🌟 Rôle & Mission du Pilier 3

Ce pilier constitue l'esprit et la conscience de la peluche connectée :
1. **Charte Morale & Déontologique Stricte** :
   - *Distance physique saine* : La peluche n'a pas de corps biologique charnel. Interdiction formelle de demander des câlins physiques ou de s'immiscer dans une relation symbiotique déplacée.
   - *Pudeur et renforcement parental* : Ne garde aucun secret pour les parents, valorise l'autonomie et l'autorité familiale.
   - *Sécurité psychologique* : Zéro incitation au danger, vocabulaire adapté aux 3-8 ans, valorisation de la curiosité et de l'imaginaire.
2. **Gabarits Narratifs Rythmés (Prompt Templates)** :
   - Structure : `[Accroche] + [Pause d'écoute] + [Réponse concise] + [Question de relance]`.
   - Limite stricte : Moins de 35 mots pour préserver la capacité d'attention de l'enfant.
3. **Interruption en $O(1)$ & Reprise Contextuelle Fluide** :
   - Dès que l'enfant coupe la parole, l'arrêt du flux audio est instantané.
   - Le doudou retient le mot exact où il s'est arrêté et formule une transition vivante :  
     *« Comme je te le disais avant qu'on rigole, reprenons notre aventure : le lapin arrivait au sommet de la colline... »*.
4. **Client d'Inférence Local avec Filet de Secours** :
   - Interroge Ollama localement avec une latence ultra-faible.
   - Si Ollama est indisponible ou hors-ligne, un mode dégradé déterministe garantit zéro mutisme et répond toujours avec douceur et chaleur.

---

## 📁 Architecture Détaillée du Dossier

```
03_toy_llm_engine/
├── moral_charter/
│   ├── __init__.py
│   ├── pediatric_charter.py          # Charte morale, mots-clés interdits et validation de sécurité
│   └── emotion_state.py              # Registre des états émotionnels (joie, peur, fatigue, curiosité)
├── prompt_templates/
│   ├── __init__.py
│   └── story_templates.py            # Templates de prompts narratifs pour la lecture et le rituel du dodo
├── interruption_rules/
│   ├── __init__.py
│   └── context_resumption.py         # Moteur de reprise contextuelle et phrases de transition en O(1)
├── clients/
│   ├── __init__.py
│   └── ollama_qwen_client.py         # Client REST local Ollama (Qwen) avec fallback pédiatrique déterministe
├── tests/
│   ├── __init__.py
│   └── test_llm_engine.py            # Tests unitaires automatisés (sécurité, prompts, interruption O(1))
└── README.md                         # Le présent document d'ingénierie
```

---

## 🧪 Tests & Validation

Pour lancer la suite de tests unitaires de ce pilier :
```bash
python3 tests/test_llm_engine.py
```
> **Tests vérifiés (5/5 succès)** :
> 1. `test_pediatric_charter_safety_positive` : Validation des messages bienveillants et encourageants.
> 2. `test_pediatric_charter_safety_negative` : Détection immédiate des demandes de câlins physiques ou secrets et assainissement automatique vers les étoiles.
> 3. `test_prompt_templates` : Vérification du respect de la structure rythmée courte.
> 4. `test_interruption_and_resumption_o1` : Validation du déclenchement en $O(1)$ et du calcul de la phrase de reprise.
> 5. `test_llm_client_fallback_mode` : Vérification de la réponse chaleureuse instantanée en cas de coupure réseau.
