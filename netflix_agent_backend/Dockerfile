FROM python:3.12-slim

WORKDIR /app
COPY . /app

ENV PIP_NO_CACHE_DIR=1
ENV TMPDIR=/app/tmp

RUN apt-get update && apt-get install -y build-essential && \
    mkdir -p /app/tmp && \
    pip install --upgrade pip && \
    pip install -r requirements.txt && \
    apt-get remove -y build-essential && \
    apt-get autoremove -y && \
    apt-get clean

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
