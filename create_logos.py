from PIL import Image, ImageDraw, ImageFont
import os

def create_logo(text, color, size=(200, 50), bg_color=(255, 255, 255, 0)):
    # Criar uma imagem com fundo transparente
    img = Image.new('RGBA', size, bg_color)
    draw = ImageDraw.Draw(img)
    
    try:
        # Tentar carregar uma fonte moderna
        font = ImageFont.truetype("arial.ttf", 32)
    except:
        # Se não encontrar a fonte, usar a fonte padrão
        font = ImageFont.load_default()
    
    # Calcular a posição do texto para centralizá-lo
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    x = (size[0] - text_width) // 2
    y = (size[1] - text_height) // 2
    
    # Desenhar o texto
    draw.text((x, y), text, font=font, fill=color)
    
    return img

def main():
    # Criar diretório se não existir
    os.makedirs('public/images', exist_ok=True)
    
    # Criar logo principal (preto)
    logo = create_logo("EduPrado.me", (0, 0, 0))
    logo.save('public/images/logo.png')
    print("Logo principal criado em public/images/logo.png")
    
    # Criar logo branco
    logo_white = create_logo("EduPrado.me", (255, 255, 255))
    logo_white.save('public/images/logo-white.png')
    print("Logo branco criado em public/images/logo-white.png")

if __name__ == '__main__':
    main() 