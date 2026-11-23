.PHONY: all test test-java test-all build-ui help

help:
	@echo "Commandes disponibles pour Doudou Intelligent v2.0 :"
	@echo "  make test        : Lance le banc d'homologation officiel des 300 scénarios (Python)"
	@echo "  make test-java   : Lance la suite de tests unitaires JUnit 5 Spring Boot (Java)"
	@echo "  make build-ui    : Compile l'application React + Vite des parents"
	@echo "  make test-all    : Exécute l'ensemble des validations (Java + UI + Python 300)"

test:
	@echo "Exécution du grand banc de qualification des 300 tests..."
	@python3 05_toy_firmware_and_ota_updater/qualification_300/run_qualification_300.py

test-java:
	@echo "Exécution des tests Spring Boot (JUnit 5)..."
	@cd 01_parent_application/backend_spring_boot && mvn test -q

build-ui:
	@echo "Compilation de l'interface React + Vite..."
	@cd 01_parent_application/frontend && npm run build --silent

test-all: test-java build-ui test
	@echo "✓ Toutes les suites de validation sont validées à 100% !"

