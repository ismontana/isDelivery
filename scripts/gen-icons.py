from PIL import Image, ImageDraw

PRIMARY = (10, 42, 67, 255)  # #0A2A43
ACCENT = (79, 163, 209, 255)  # #4FA3D1

def make_icon(size, maskable=False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    pad = int(size * 0.12) if maskable else 0
    draw.rounded_rectangle(
        [pad, pad, size - pad, size - pad],
        radius=int(size * (0.22 if maskable else 0.22)),
        fill=PRIMARY,
    )

    # Water droplet shape, centered: a circle with a triangular tip
    cx = size / 2
    cy = size * 0.56
    r = size * 0.17

    circle_box = [cx - r, cy - r, cx + r, cy + r]
    draw.ellipse(circle_box, fill=(255, 255, 255, 255))

    tip_y = size * 0.20
    base_half = r * 0.92
    base_y = cy - r * 0.15
    draw.polygon(
        [(cx, tip_y), (cx - base_half, base_y), (cx + base_half, base_y)],
        fill=(255, 255, 255, 255),
    )

    return img

for size in [72, 96, 128, 144, 152, 192, 384, 512]:
    make_icon(size).save(f"/home/claude/isdelivery/public/icons/icon-{size}.png")

make_icon(512, maskable=True).save("/home/claude/isdelivery/public/icons/icon-maskable-512.png")

# Apple touch icon (no transparency, solid background)
apple = Image.new("RGBA", (180, 180), PRIMARY)
icon180 = make_icon(180)
apple.paste(icon180, (0, 0), icon180)
apple.convert("RGB").save("/home/claude/isdelivery/public/icons/apple-touch-icon.png")

print("done")
