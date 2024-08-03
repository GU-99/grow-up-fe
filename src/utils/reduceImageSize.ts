const MAX_IMAGE_SIZE_MB = 1;

const reduceImageSize = (objUrl: string) => {
  return new Promise<Blob>((resolve, reject) => {
    const maxSize = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    const img = new Image();
    img.src = objUrl;
    img.crossOrigin = 'anonymous'; // CORS 정책 준수
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const { width } = img;
      const { height } = img;
      let scaleFactor = 1;

      if (width * height > maxSize) {
        scaleFactor = Math.sqrt(maxSize / (width * height));
      }

      canvas.width = width * scaleFactor;
      canvas.height = height * scaleFactor;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width * scaleFactor, height * scaleFactor);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to reduce image size'));
          }
        }, 'image/jpeg');
      } else {
        reject(new Error('Failed to get 2d context'));
      }
    };
    img.onerror = (error) => {
      reject(error); // 이미지 로딩 오류
    };
  });
};

export default reduceImageSize;
