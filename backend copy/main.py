"""
FastAPI Backend — serves the trained GAN generator.
- POST /restore  → accepts image, returns restored image (base64)
- GET  /health   → health check
"""

import io, base64, torch
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

# ----- Model Loading -----
device = "cpu"   # Free tier: CPU only
generator = UNetGenerator().to(device)

try:
    generator.load_state_dict(
        torch.load("weights/generator.pth", map_location=device)
    )
    generator.eval()
    print("✓ Generator loaded")
except FileNotFoundError:
    print("⚠ weights/generator.pth not found — train first")

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
    t = (t * 255).byte().permute(1, 2, 0).cpu().numpy()
    return Image.fromarray(t)

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
        restored_img = restored_img.resize(original_size, Image.LANCZOS)

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
