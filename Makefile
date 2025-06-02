

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

run:
	docker compose -f docker-compose.yaml up -d && \
	source .venv/bin/activate && \
	cd backend && \
	uvicorn app.main:app --reload --host 0.0.0.0