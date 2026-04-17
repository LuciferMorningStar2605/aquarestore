"""
Training Script — Run locally before deployment.
Produces weights/generator.pth used by the API.

Usage:
    python -m model.train \
        --raw_dir  data/uieb/raw-890 \
        --ref_dir  data/uieb/reference-890 \
        --epochs   100 \
        --batch    4

Expected training time:
    GPU (T4/V100): ~1–2 hours for 100 epochs
    CPU: not recommended (use Google Colab free tier)

Tips for visible results:
    - 50 epochs minimum; 100 for strong output
    - LAMBDA_L1=100 ensures structural restoration dominates
    - Save checkpoints every 10 epochs
"""

import os, argparse, torch
from torch.utils.data import DataLoader, random_split
from model.generator      import UNetGenerator
from model.discriminator  import PatchGANDiscriminator
from model.losses         import disc_loss, gen_loss
from model.dataset        import UIEBDataset

def train(args):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Training on: {device}")

    dataset = UIEBDataset(args.raw_dir, args.ref_dir)
    n_val   = max(1, int(0.1 * len(dataset)))
    train_ds, val_ds = random_split(dataset, [len(dataset) - n_val, n_val])
    loader  = DataLoader(train_ds, batch_size=args.batch, shuffle=True, num_workers=2)

    G = UNetGenerator().to(device)
    D = PatchGANDiscriminator().to(device)

    opt_G = torch.optim.Adam(G.parameters(), lr=2e-4, betas=(0.5, 0.999))
    opt_D = torch.optim.Adam(D.parameters(), lr=2e-4, betas=(0.5, 0.999))

    os.makedirs("weights", exist_ok=True)

    for epoch in range(1, args.epochs + 1):
        G.train(); D.train()
        g_total = d_total = 0.0

        for raw, ref in loader:
            raw, ref = raw.to(device), ref.to(device)

            # --- Train Discriminator ---
            fake = G(raw).detach()
            d_real = D(raw, ref)
            d_fake = D(raw, fake)
            loss_D = disc_loss(d_fake, d_real)
            opt_D.zero_grad(); loss_D.backward(); opt_D.step()

            # --- Train Generator ---
            fake = G(raw)
            d_fake = D(raw, fake)
            loss_G = gen_loss(d_fake, fake, ref)
            opt_G.zero_grad(); loss_G.backward(); opt_G.step()

            g_total += loss_G.item()
            d_total += loss_D.item()

        n = len(loader)
        print(f"Epoch [{epoch:03d}/{args.epochs}] "
              f"G: {g_total/n:.4f}  D: {d_total/n:.4f}")

        if epoch % 10 == 0:
            torch.save(G.state_dict(), f"weights/generator_ep{epoch}.pth")

    torch.save(G.state_dict(), "weights/generator.pth")
    print("✓ Saved weights/generator.pth")


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--raw_dir",  required=True)
    p.add_argument("--ref_dir",  required=True)
    p.add_argument("--epochs",   type=int, default=100)
    p.add_argument("--batch",    type=int, default=4)
    train(p.parse_args())
