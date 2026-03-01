"""
🎵 MusicGen Inference API
Open Source AI Music Generation
Based on Meta's Audiocraft (Apache 2 License)
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
import scipy
import os
import uuid
import tempfile
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write

app = Flask(__name__)
CORS(app)

# Model configuration
MODEL_NAME = os.getenv("MODEL_NAME", "facebook/musicgen-medium")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

print(f"🎵 Loading MusicGen model: {MODEL_NAME}")
print(f"🖥️  Device: {DEVICE}")

# Load model globally
model = None

def load_model():
    global model
    if model is None:
        print("Loading model...")
        model = MusicGen.get_pretrained(MODEL_NAME)
        model.set_max_length(30)  # Default 30 seconds
        model.to(DEVICE)
        print("✅ Model loaded!")
    return model

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model": MODEL_NAME,
        "device": DEVICE,
        "model_loaded": model is not None
    })

@app.route("/generate", methods=["POST"])
def generate():
    """Generate music from text prompt"""
    data = request.get_json()
    
    if not data or "prompt" not in data:
        return jsonify({"error": "prompt is required"}), 400
    
    prompt = data["prompt"]
    duration = data.get("duration", 30)  # seconds
    top_k = data.get("top_k", 250)
    top_p = data.get("top_p", 0)
    temperature = data.get("temperature", 1.0)
    
    print(f"🎵 Generating: '{prompt}' ({duration}s)")
    
    try:
        # Load model if not loaded
        m = load_model()
        
        # Set generation duration
        m.set_generation_duration(duration)
        
        # Generate
        with torch.no_grad():
            output = m.generate(
                descriptions=[prompt],
                progress=True
            )
        
        # Save to temporary file
        temp_dir = tempfile.gettempdir()
        track_id = str(uuid.uuid4())
        output_path = os.path.join(temp_dir, f"dreamverse_{track_id}")
        
        # Write audio (automatically creates .wav)
        audio_write(output_path, output[0].cpu(), m.sample_rate, format="wav")
        
        # Return file path (in production, upload to storage)
        audio_file = f"{output_path}.wav"
        
        return jsonify({
            "track_id": track_id,
            "status": "completed",
            "prompt": prompt,
            "duration": duration,
            "audio_file": audio_file,
            "message": "Generation complete! In production, this would return a URL."
        })
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/models", methods=["GET"])
def get_models():
    """Get available models"""
    return jsonify([
        {
            "id": "facebook/musicgen-small",
            "name": "MusicGen Small",
            "description": "Fast generation, lower quality",
            "max_duration": 15
        },
        {
            "id": "facebook/musicgen-medium",
            "name": "MusicGen Medium",
            "description": "Balanced quality and speed",
            "max_duration": 30
        },
        {
            "id": "facebook/musicgen-large",
            "name": "MusicGen Large",
            "description": "Highest quality, slower",
            "max_duration": 60
        },
        {
            "id": "facebook/musicgen-melody",
            "name": "MusicGen Melody",
            "description": "Generate from audio melody",
            "max_duration": 30
        }
    ])

@app.route("/presets", methods=["GET"])
def get_presets():
    """Get generation presets"""
    return jsonify([
        {"id": "lofi", "prompt": "lo-fi chill beats with piano and guitar"},
        {"id": "edm", "prompt": "energetic electronic dance music with heavy bass"},
        {"id": "classical", "prompt": "orchestral symphony with strings and brass"},
        {"id": "jazz", "prompt": "smooth jazz with saxophone and piano"},
        {"id": "rock", "prompt": "guitar rock with drums and bass"},
        {"id": "ambient", "prompt": "atmospheric ambient soundscapes"},
        {"id": "hiphop", "prompt": "hip hop beat with 808 and rap"},
        {"id": "synthwave", "prompt": "retro synthwave with neon sounds"}
    ])

if __name__ == "__main__":
    # Pre-load model on startup
    load_model()
    app.run(host="0.0.0.0", port=7860, debug=False)
