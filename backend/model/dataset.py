import os
import glob
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
        
        # Find images recursively to handle any hidden subfolders
        raw_files = glob.glob(os.path.join(raw_dir, '**', '*.*'), recursive=True)
        raw_files = [f for f in raw_files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        ref_files = glob.glob(os.path.join(ref_dir, '**', '*.*'), recursive=True)
        ref_files = [f for f in ref_files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        self.ref_map = {}
        for f in ref_files:
            base_name = os.path.splitext(os.path.basename(f))[0]
            self.ref_map[base_name] = f
            
        self.pairs = []
        for raw_f in raw_files:
            base_name = os.path.splitext(os.path.basename(raw_f))[0]
            if base_name in self.ref_map:
                self.pairs.append((raw_f, self.ref_map[base_name]))
                
        print(f"Dataset loaded: Found {len(self.pairs)} matching image pairs.")

    def __len__(self):
        return len(self.pairs)

    def __getitem__(self, idx):
        raw_path, ref_path = self.pairs[idx]
        raw = Image.open(raw_path).convert("RGB")
        ref = Image.open(ref_path).convert("RGB")
        return transform(raw), transform(ref)
