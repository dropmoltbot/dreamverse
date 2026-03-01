# MusicGen AI Service - Docker
# Uses Meta's Audiocraft (Apache 2 License)

FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir \
    audiocraft \
    einops \
    scipy \
    torch \
    torchaudio \
    flask \
    flask-cors \
    gunicorn

# Copy application
COPY inference.py .

# Expose port
EXPOSE 7860

# Run with gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:7860", "inference:app"]
