FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    CROP_DOCTOR_MODEL_DIR=/home/cropdoctor/.cache/ai-crop-doctor \
    PORT=8080

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN python -m pip install --upgrade pip \
    && python -m pip install torch==2.6.0 torchvision==0.21.0 --index-url https://download.pytorch.org/whl/cpu \
    && python -m pip install -r requirements.txt

RUN useradd --create-home --uid 10001 cropdoctor
COPY --chown=cropdoctor:cropdoctor . .
USER cropdoctor

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=5s --start-period=180s --retries=3 \
    CMD python -c "import os,urllib.request; urllib.request.urlopen('http://127.0.0.1:'+os.getenv('PORT','8080')+'/api/health', timeout=3)"
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 1 --threads 2 --timeout 180 --access-logfile - --error-logfile - app:app"]
