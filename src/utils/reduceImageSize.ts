import { USER_SETTINGS } from '@constants/settings';

const reduceImageSize = (objUrl: string) => {
  return new Promise<Blob>((resolve, reject) => {
    const maxSize = USER_SETTINGS.MAX_IMAGE_SIZE;
    const img = new Image();

    img.src = objUrl;
    img.crossOrigin = 'anonymous'; // CORS 정책 준수

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const { width, height } = img;
      let scaleFactor = 1;

      if (width * height > maxSize) {
        scaleFactor = Math.sqrt(maxSize / (width * height));
      }

      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;

      if (!ctx) reject(new Error('Failed to get 2d context'));
      ctx!.drawImage(img, 0, 0, width * scaleFactor, height * scaleFactor);
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Failed to reduce image size'))), 'image/jpeg');
    };

    img.onerror = (error) => {
      reject(error); // 이미지 로딩 오류
    };
  });
};

export default reduceImageSize;
