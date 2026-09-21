import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { quality } from '@cloudinary/url-gen/actions/delivery';
import { format } from '@cloudinary/url-gen/actions/delivery';

// Initialize Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: 'pxz965s7'
  }
});

interface CloudinaryImageComponentProps {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function CloudinaryImageComponent({
  publicId,
  alt,
  width = 600,
  height = 600,
  className = '',
}: CloudinaryImageComponentProps) {
  // Extract public ID from full URL if needed
  const extractPublicId = (url: string) => {
    if (url.includes('cloudinary.com')) {
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/);
      return match ? match[1] : url;
    }
    return url;
  };

  const img = cld.image(extractPublicId(publicId));

  // Apply transformations
  img.resize(fill().width(width).height(height));
  img.delivery(quality('auto'));
  img.delivery(format('auto'));

  return (
    <AdvancedImage
      cldImg={img}
      alt={alt}
      className={className}
    />
  );
}
