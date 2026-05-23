import whisper
import sys
import json
import warnings
import os

# Suppress all warnings and library chatter
warnings.filterwarnings("ignore")
os.environ["PYTHONWARNINGS"] = "ignore"

def transcribe(audio_path):
    try:
        # Load model quietly
        model = whisper.load_model("base")
        
        # Transcribe without printing progress
        result = model.transcribe(audio_path, verbose=False, fp16=False)
        
        output = {"text": result["text"].strip()}
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    # Disable stdout buffering to ensure JSON is sent cleanly
    sys.stdout.reconfigure(line_buffering=True)
    
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No audio file provided"}))
    else:
        transcribe(sys.argv[1])
