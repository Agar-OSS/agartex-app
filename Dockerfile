FROM python:3.10-slim

RUN useradd -ms /bin/bash user
USER user
WORKDIR /app

COPY http_server.py .

EXPOSE 8080
ENTRYPOINT ["python3", "./http_server.py"]