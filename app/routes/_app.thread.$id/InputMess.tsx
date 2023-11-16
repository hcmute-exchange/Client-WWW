import React, { forwardRef, useRef, useState } from 'react';
import Input from '@components/Input';
import Upload from './Upload';
import { PlusCircleIcon } from '@heroicons/react/20/solid';

const InputMess = forwardRef<HTMLInputElement>((props, ref) => {
  const refFile = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (files) {
      const imagesArray: string[] = [];
      const readers: FileReader[] = [];

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          imagesArray.push(reader.result as string);

          if (imagesArray.length === files.length) {
            setSelectedImages(imagesArray);
          }
        };
        reader.readAsDataURL(files[i]);
        readers.push(reader);
      }
    }
  };

  const handleOpenFileinput = () => {
    refFile.current?.click();
  };

  return (
    <div className="w-full flex gap-2 relative border border-primary-300 bg-primary-50 py-0.5 rounded transition-[background-color_outline] ease-in-out">
      <div>
        <Input
          type="file"
          className="w-5 hidden outline-none"
          ref={refFile}
          name="file"
          multiple
          onChange={handleFileInputChange}
        />
        <PlusCircleIcon
          className="w-8 aspect-square cursor-pointer"
          onClick={handleOpenFileinput}
        />
      </div>
      <Input className="w-full border-none" placeholder="Enter something" />
      {selectedImages.length > 0 && (
        <div className="absolute z-30 -top-36 left-0 w-full">
          <Upload images={selectedImages} />
        </div>
      )}
    </div>
  );
});

export default InputMess;
