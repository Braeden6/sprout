install:
	brew install python@3.13 && \
	brew install uv

setup:
	uv venv && \
	source .venv/bin/activate && \
	uv sync && \
	cd backend && uv sync && \
	cd .. && \
	docker compose -f docker-compose.yaml up -d

run-backend:
	docker compose -f docker-compose.yaml up -d && \
	source .venv/bin/activate && \
	cd backend && \
	uvicorn app.main:app --reload --host 0.0.0.0

build-backend-docker:
	cd backend && docker build -t sprout-backend .

run-backend-docker:
	docker run -p 8000:8000 sprout-backend

sdk:
	cd frontend && pnpm run generate-api

run-frontend:
	cd frontend && pnpm run dev

build-frontend-docker:
	cd frontend && docker build --target production -t sprout-frontend .

run-frontend-docker:
	docker run -p 80:80 sprout-frontend


db-generate:
	source .venv/bin/activate && \
	cd backend && \
	alembic revision --autogenerate -m "message"

db-migrate:
	source .venv/bin/activate && \
	cd backend && \
	alembic upgrade head