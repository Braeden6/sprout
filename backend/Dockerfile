FROM python:3.13-slim AS builder
RUN pip install --no-cache-dir uv
WORKDIR /app
COPY pyproject.toml /app/
RUN uv pip install --system -e .

FROM python:3.13-slim AS prod

WORKDIR /app
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY app /app/app
COPY .env .env
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]