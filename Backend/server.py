import torch
# --- FIX FOR PYTORCH 2.6+ LOADING ERROR ---
# This forces torch to load the model even if it thinks it's "unsafe"
torch.serialization.add_safe_globals = lambda *args, **kwargs: None 
if hasattr(torch, 'load'):
    original_load = torch.load
    torch.load = lambda *args, **kwargs: original_load(*args, **kwargs, weights_only=False)
# ------------------------------------------

from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

# Load Model
MODEL_PATH = "best_16.pt"
print(f"🚀 Loading AI Model: {MODEL_PATH}...")
try:
    model = YOLO(MODEL_PATH)
    print("✅ Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    exit()

CLASS_IDS = {
    "VEHICLES": [1, 3, 4, 9, 16, 17],
    "GREEN_LIGHT": 8, "RED_LIGHT": 11, "CROSSWALK": 5
}

@app.route('/detect', methods=['POST'])
def detect_frame():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read image
        file_bytes = np.frombuffer(file.read(), np.uint8)
        original_frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        
        if original_frame is None:
            return jsonify({"error": "Failed to decode image"}), 400

        # --- 1. RESIZE LOGIC (Fixing the Misalignment) ---
        original_h, original_w = original_frame.shape[:2]
        max_size = 1280
        scale_factor = 1.0
        
        frame = original_frame
        if original_w > max_size or original_h > max_size:
            scale_factor = max_size / max(original_w, original_h)
            new_w = int(original_w * scale_factor)
            new_h = int(original_h * scale_factor)
            frame = cv2.resize(original_frame, (new_w, new_h))
        
        # Update dims for the danger zone logic
        height, width = frame.shape[:2]

    except Exception as e:
        return jsonify({"error": f"Processing error: {str(e)}"}), 500

    # Dynamic Danger Zone (Calculated on the processed frame size)
    pts = np.array([
        [int(width * 0.20), height], 
        [int(width * 0.35), int(height * 0.65)], 
        [int(width * 0.65), int(height * 0.65)], 
        [int(width * 0.80), height]
    ], np.int32).reshape((-1, 1, 2))

    # Inference
    results = model(frame, conf=0.4, verbose=False)
    
    detections = []
    danger_detected = False
    traffic_status = "NONE"
    
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            confidence = float(box.conf[0])
            class_id = int(box.cls[0])
            class_name = model.names[class_id] if model.names else str(class_id)

            # Check Danger Zone (using resized coords)
            if class_id in CLASS_IDS["VEHICLES"]:
                cx, cy = (x1 + x2) // 2, y2
                if cv2.pointPolygonTest(pts, (cx, cy), False) >= 0:
                    danger_detected = True
            elif class_id == CLASS_IDS["RED_LIGHT"]:
                traffic_status = "RED"
            elif class_id == CLASS_IDS["GREEN_LIGHT"]:
                traffic_status = "GREEN"

            # --- 2. SCALE BOXES BACK TO ORIGINAL SIZE ---
            # We divide by scale_factor to get back to original resolution coordinates
            if scale_factor != 1.0:
                x1 = int(x1 / scale_factor)
                y1 = int(y1 / scale_factor)
                x2 = int(x2 / scale_factor)
                y2 = int(y2 / scale_factor)

            detections.append({
                "class": class_name,
                "confidence": confidence,
                "bbox": [x1, y1, x2, y2]
            })

    # Alert Logic
    alert_message = None
    if danger_detected:
        alert_message = "Stop! Vehicle ahead."
    elif traffic_status == "GREEN":
        alert_message = "Do not cross. Traffic light is green."
    elif traffic_status == "RED":
        alert_message = "Safe to cross. Light is red."

    return jsonify({
        "detections": detections,
        "alert_message": alert_message
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)