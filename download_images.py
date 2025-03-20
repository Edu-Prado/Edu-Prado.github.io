import os
import requests
from PIL import Image
from io import BytesIO
import time

def create_directories():
    dirs = [
        'public/images',
        'public/images/blog',
        'public/images/projects',
        'public/images/icons'
    ]
    for dir in dirs:
        os.makedirs(dir, exist_ok=True)

def download_and_save_image(url, save_path, size=None):
    try:
        # Adiciona parâmetros para obter a imagem no tamanho desejado
        if size:
            url = f"{url}?w={size[0]}&h={size[1]}&fit=crop"
        
        response = requests.get(url)
        if response.status_code == 200:
            img = Image.open(BytesIO(response.content))
            if size:
                img = img.resize(size, Image.Resampling.LANCZOS)
            img.save(save_path)
            print(f"Imagem salva em: {save_path}")
            time.sleep(1)  # Espera 1 segundo entre as requisições
        else:
            print(f"Erro ao baixar imagem de {url}")
    except Exception as e:
        print(f"Erro ao processar imagem de {url}: {str(e)}")

def main():
    create_directories()
    
    # Blog images - URLs atualizadas
    blog_images = {
        'ai-trends.jpg': 'https://images.unsplash.com/photo-1677442136019-21780ecad995',  # Nova URL para AI
        'web-dev.jpg': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
        'cloud-computing.jpg': 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba'
    }
    
    for filename, url in blog_images.items():
        download_and_save_image(url, f'public/images/blog/{filename}', (800, 450))
    
    # Project images - URLs atualizadas
    project_images = {
        'ai-assistant.jpg': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
        'smart-analytics.jpg': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',  # Nova URL para analytics
        'cloud-platform.jpg': 'https://images.unsplash.com/photo-1579567761406-4684ee0c75b6'
    }
    
    for filename, url in project_images.items():
        download_and_save_image(url, f'public/images/projects/{filename}', (800, 450))
    
    # Icon images
    icon_images = {
        'web.png': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        'ai.png': 'https://images.unsplash.com/photo-1527474305487-b87b222841cc',
        'cloud.png': 'https://images.unsplash.com/photo-1527474305487-b87b222841cc'
    }
    
    for filename, url in icon_images.items():
        download_and_save_image(url, f'public/images/icons/{filename}', (64, 64))
    
    # Profile images
    profile_images = {
        'profile.jpg': 'https://images.unsplash.com/photo-1581092921461-eab62e97a780',
        'about.jpg': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2'
    }
    
    for filename, url in profile_images.items():
        size = (400, 400) if filename == 'profile.jpg' else (800, 600)
        download_and_save_image(url, f'public/images/{filename}', size)

if __name__ == '__main__':
    main() 