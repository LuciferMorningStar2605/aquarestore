import io, torch
from PIL import Image
from torchvision import transforms
from model.generator import UNetGenerator

try:
    device = "cpu"
    generator = UNetGenerator().to(device)
    generator.load_state_dict(torch.load("weights/generator.pth", map_location=device, weights_only=True))
    generator.eval()

    img = Image.new('RGB', (500, 500), color = 'red')
    original_size = img.size

    IMG_SIZE = 256
    preprocess = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize([0.5]*3, [0.5]*3)
    ])

    tensor = preprocess(img).unsqueeze(0).to(device)
    with torch.no_grad():
        restored_tensor = generator(tensor)

    def to_pil(tensor):
        t = (tensor.squeeze(0).clamp(-1, 1) + 1) / 2
        t = (t * 255).byte().permute(1, 2, 0).cpu().numpy()
        return Image.fromarray(t)

    restored_img = to_pil(restored_tensor)
    restored_img = restored_img.resize(original_size, Image.LANCZOS)
    print("SUCCESS!")
except Exception as e:
    import traceback
    traceback.print_exc()
