import torch
import torch.nn as nn

bce  = nn.BCEWithLogitsLoss()
l1   = nn.L1Loss()

LAMBDA_L1 = 100   # Strong L1 = visible restoration quality


def disc_loss(fake_pred, real_pred):
    real_loss = bce(real_pred, torch.ones_like(real_pred))
    fake_loss = bce(fake_pred, torch.zeros_like(fake_pred))
    return (real_loss + fake_loss) / 2


def gen_loss(fake_pred, fake_img, target_img):
    adv  = bce(fake_pred, torch.ones_like(fake_pred))
    pix  = l1(fake_img, target_img)
    return adv + LAMBDA_L1 * pix
