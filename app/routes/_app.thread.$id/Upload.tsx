import React from 'react';

interface UploadProps {
  images: string[];
}

const Upload: React.FC<UploadProps> = ({ images }) => {
  return (
    <div className="h-[8.8rem] p-2 w-full border-b rounded absolute border border-solid bg-primary-0 border-primary-200 z-30 flex overflow-x-auto">
      <div className="flex gap-4 overflow-x-auto">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Uploaded ${index + 1}`}
            className="w-2/3 h-full object-cover"
          />
        ))}
      </div>
    </div>
  );
};

export default Upload;
