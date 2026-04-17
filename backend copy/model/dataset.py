import os
from PIL import Image
from torch.utils.data import Dataset
from torchvision import transforms

IMG_SIZE = 256

transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)   # → [-1, 1] for Tanh output
])


class UIEBDataset(Dataset):
    def __init__(self, raw_dir, ref_dir):
        self.raw_dir = raw_dir
        self.ref_dir = ref_dir
        self.files   = sorted([
            f for f in os.listdir(raw_dir)
            if os.path.exists(os.path.join(ref_dir, f))
        ])

    def __len__(self):
        return len(self.files)

    def __getitem__(self, idx):
        name = self.files[idx]
        raw = Image.open(os.path.join(self.raw_dir, name)).convert("RGB")
        ref = Image.open(os.path.join(self.ref_dir, name)).convert("RGB")
        return transform(raw), transform(ref)
