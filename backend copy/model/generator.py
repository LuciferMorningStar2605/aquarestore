import torch
import torch.nn as nn

class ConvBlock(nn.Module):
    def __init__(self, in_ch, out_ch, down=True, use_dropout=False):
        super().__init__()
        layers = [
            nn.Conv2d(in_ch, out_ch, 4, 2, 1, bias=False) if down
            else nn.ConvTranspose2d(in_ch, out_ch, 4, 2, 1, bias=False),
            nn.BatchNorm2d(out_ch),
            nn.LeakyReLU(0.2) if down else nn.ReLU(),
        ]
        if use_dropout:
            layers.append(nn.Dropout(0.5))
        self.block = nn.Sequential(*layers)

    def forward(self, x):
        return self.block(x)


class UNetGenerator(nn.Module):
    """
    Lightweight U-Net Generator (256x256 input)
    Encoder: 256 → 128 → 64 → 32 → 16 → 8 → 4 → 2
    Decoder: 2 → 4 → 8 → 16 → 32 → 64 → 128 → 256
    Skip connections between matching encoder/decoder layers
    """
    def __init__(self, in_channels=3, features=64):
        super().__init__()

        # Encoder (no BN on first layer)
        self.e1 = nn.Sequential(
            nn.Conv2d(in_channels, features, 4, 2, 1),
            nn.LeakyReLU(0.2)
        )
        self.e2 = ConvBlock(features,     features * 2)
        self.e3 = ConvBlock(features * 2, features * 4)
        self.e4 = ConvBlock(features * 4, features * 8)
        self.e5 = ConvBlock(features * 8, features * 8)
        self.e6 = ConvBlock(features * 8, features * 8)
        self.e7 = ConvBlock(features * 8, features * 8)

        # Bottleneck
        self.bottleneck = nn.Sequential(
            nn.Conv2d(features * 8, features * 8, 4, 2, 1),
            nn.ReLU()
        )

        # Decoder (with skip connections → 2× channels)
        self.d1 = ConvBlock(features * 8,      features * 8, down=False, use_dropout=True)
        self.d2 = ConvBlock(features * 8 * 2,  features * 8, down=False, use_dropout=True)
        self.d3 = ConvBlock(features * 8 * 2,  features * 8, down=False, use_dropout=True)
        self.d4 = ConvBlock(features * 8 * 2,  features * 8, down=False)
        self.d5 = ConvBlock(features * 8 * 2,  features * 4, down=False)
        self.d6 = ConvBlock(features * 4 * 2,  features * 2, down=False)
        self.d7 = ConvBlock(features * 2 * 2,  features,     down=False)

        self.final = nn.Sequential(
            nn.ConvTranspose2d(features * 2, in_channels, 4, 2, 1),
            nn.Tanh()
        )

    def forward(self, x):
        e1 = self.e1(x)
        e2 = self.e2(e1)
        e3 = self.e3(e2)
        e4 = self.e4(e3)
        e5 = self.e5(e4)
        e6 = self.e6(e5)
        e7 = self.e7(e6)
        b  = self.bottleneck(e7)

        d1 = self.d1(b)
        d2 = self.d2(torch.cat([d1, e7], 1))
        d3 = self.d3(torch.cat([d2, e6], 1))
        d4 = self.d4(torch.cat([d3, e5], 1))
        d5 = self.d5(torch.cat([d4, e4], 1))
        d6 = self.d6(torch.cat([d5, e3], 1))
        d7 = self.d7(torch.cat([d6, e2], 1))
        return self.final(torch.cat([d7, e1], 1))
