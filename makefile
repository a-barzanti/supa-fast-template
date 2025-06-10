# Variables
FRONTEND_DIR=frontend
BACKEND_DIR=backend

.PHONY: dev frontend backend build format lint test clean envupdate

## Run both frontend and backend (dev mode)
dev:
	@echo "Starting frontend and backend in dev mode..."
	make -j 2 frontend backend

## Run frontend only
frontend:
	@echo "Running frontend..."
	cd $(FRONTEND_DIR) && npm run dev

## Run backend only
backend:
	@echo "Running backend..."
	cd $(BACKEND_DIR) && uvicorn app.main:app --reload

## Build frontend
build:
	@echo "Building frontend..."
	cd $(FRONTEND_DIR) && npm run build

## Format all code
format:
	@echo "Formatting code (frontend)..."
	cd $(FRONTEND_DIR) && npm run format
	@echo "Formatting code (backend)..."
	cd $(BACKEND_DIR) && uv isort . && uv black .

## Lint all code
lint:
	@echo "Linting frontend..."
	cd $(FRONTEND_DIR) && npm run lint
	@echo "Linting backend..."
	cd $(BACKEND_DIR) && uv ruff .

## Run tests
test:
	@echo "Running backend tests..."
	cd $(BACKEND_DIR) && uv pytest
	@echo "Frontend tests not implemented."

## Clean build artifacts
clean:
	@echo "Cleaning up..."
	rm -rf $(FRONTEND_DIR)/dist
	find $(BACKEND_DIR) -type d -name "__pycache__" -exec rm -r {} +

## Update environment
envupdate:
	cd $(BACKEND_DIR) && bash scripts/update-env.sh