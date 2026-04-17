"""
FastAPI Backend — serves the trained GAN generator.
- POST /restore  → accepts image, returns restored image (base64)
- GET  /health   → health check
"""

import io, base64, torch, os, gdown
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from torchvision import transforms
from model.generator import UNetGenerator

app = FastAPI(title="AquaRestore API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Tighten to your Vercel domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Memory Optimizations for Free Tier -----
torch.set_num_threads(1)

# ----- Model Loading -----
device = "cpu"   # Free tier: CPU only
generator = UNetGenerator().to(device)

WEIGHTS_DIR = "weights"
WEIGHTS_PATH = os.path.join(WEIGHTS_DIR, "generator.pth")

os.makedirs(WEIGHTS_DIR, exist_ok=True)

if not os.path.exists(WEIGHTS_PATH):
    print("⬇️ Weights missing. Downloading from Google Drive...")
    FILE_ID = "140QaStpCqRW2-_IRy9aP3SnANHntxLlI"
    gdown.download(id=FILE_ID, output=WEIGHTS_PATH, quiet=False)

try:
    # Use mmap=True to prevent loading the entire 200MB file into RAM at once
    weights = torch.load(WEIGHTS_PATH, map_location=device, mmap=True)
    generator.load_state_dict(weights)
    del weights # Free memory immediately
    import gc; gc.collect()
    
    generator.eval()
    print("✓ Generator loaded successfully")
except Exception as e:
    print(f"⚠ Failed to load weights: {e}")

# ----- Transforms -----
IMG_SIZE = 256

preprocess = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)
])

def to_pil(tensor):
    """Denormalize [-1,1] tensor → PIL image"""
    t = (tensor.squeeze(0).clamp(-1, 1) + 1) / 2   # → [0,1]
    t = (t * 255).byte().permute(1, 2, 0).contiguous()
    byte_data = bytes(t.cpu().flatten().tolist())
    return Image.frombytes('RGB', (t.shape[1], t.shape[0]), byte_data)

# ----- Routes -----
@app.get("/health")
def health():
    return {"status": "ok", "model": "loaded"}


@app.post("/restore")
async def restore(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Upload must be an image")

    try:
        raw_bytes = await file.read()
        img = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
        original_size = img.size  # save for optional resize back

        tensor = preprocess(img).unsqueeze(0).to(device)

        with torch.no_grad():
            restored_tensor = generator(tensor)

        restored_img = to_pil(restored_tensor)
        restored_img = restored_img.resize(original_size, Image.Resampling.LANCZOS)

        buf = io.BytesIO()
        restored_img.save(buf, format="JPEG", quality=92)
        b64 = base64.b64encode(buf.getvalue()).decode()

        return JSONResponse({
            "restored": f"data:image/jpeg;base64,{b64}",
            "width": original_size[0],
            "height": original_size[1],
        })

    except Exception as e:
        raise HTTPException(500, f"Restoration failed: {str(e)}")
