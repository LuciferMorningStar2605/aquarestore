import torch.nn as nn

class PatchGANDiscriminator(nn.Module):
    """
    70×70 PatchGAN — classifies overlapping 70×70 patches as real/fake
    Input: concatenated [input_image, target_or_generated] → 6 channels
    """
    def __init__(self, in_channels=6, features=[64, 128, 256, 512]):
        super().__init__()
        layers = [
            nn.Conv2d(in_channels, features[0], 4, 2, 1),
            nn.LeakyReLU(0.2)
        ]
        in_f = features[0]
        for f in features[1:]:
            stride = 2 if f != features[-1] else 1
            layers += [
                nn.Conv2d(in_f, f, 4, stride, 1, bias=False),
                nn.BatchNorm2d(f),
                nn.LeakyReLU(0.2)
            ]
            in_f = f
        layers.append(nn.Conv2d(in_f, 1, 4, 1, 1))
        self.model = nn.Sequential(*layers)

    def forward(self, x, y):
        import torch
        return self.model(torch.cat([x, y], 1))
