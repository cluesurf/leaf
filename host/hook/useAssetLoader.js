import { useEffect, useState } from 'react';
import IS_SERVER from '../utility/isServer';
export default function useAssetLoader({ images = [], fonts = [], }) {
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        let remaining = images.length;
        const handleLoad = () => {
            remaining--;
            if (remaining === 0) {
                setIsLoaded(true);
            }
        };
        const watchedImages = images.map(path => {
            const image = new Image();
            image.addEventListener('load', handleLoad);
            image.addEventListener('error', handleLoad);
            image.src = path;
            return image;
        });
        return () => {
            watchedImages.forEach(image => {
                image.removeEventListener('load', handleLoad);
                image.removeEventListener('error', handleLoad);
            });
        };
    }, [images, fonts]);
    if (IS_SERVER) {
        return true;
    }
    return isLoaded;
}
//# sourceMappingURL=useAssetLoader.js.map