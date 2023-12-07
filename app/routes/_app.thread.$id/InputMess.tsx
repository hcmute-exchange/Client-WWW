import React, { forwardRef, useEffect, useRef, useState } from 'react';
import Input from '@components/Input';
import Upload from './Upload';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-aria-components';
import { useFormFieldsContext } from '@components/Form';
import { SwitchTransition } from 'transition-hook';
import clsx from 'clsx';

type Props = {
  isOk: boolean | undefined;
};
const InputMess = forwardRef<HTMLInputElement, Props>(function InputMess(
  { isOk }: Props,
  ref
) {
  const { ['body']: field } = useFormFieldsContext() ?? {};
  const invalid = !!field.error;

  const { t } = useTranslation('newthread');
  const refFile = useRef<HTMLInputElement>(null);
  const refInput = useRef<HTMLInputElement>(null);
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
  useEffect(() => {
    if (isOk && refInput.current) {
      refInput.current.value = ''; // Assign value directly after null check
    }
  }, [isOk, refInput]);

  const handleOpenFileinput = () => {
    refFile.current?.click();
  };

  return (
    <div className="flex flex-col">
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
        <Input
          className="w-full border-none"
          name="body"
          type="text"
          ref={refInput}
        />

        {selectedImages.length > 0 && (
          <div className="absolute z-30 -top-36 left-0 w-full">
            <Upload images={selectedImages} />
          </div>
        )}
      </div>
      <SwitchTransition state={invalid} timeout={200} mode="out-in">
        {(invalid, stage) => (
          <div
            className={clsx(
              'transition-opacity duration-200 text-sm',
              {
                from: 'opacity-0 ease-in',
                enter: '',
                leave: 'opacity-0 ease-out',
              }[stage]
            )}
          >
            {invalid ? (
              <Text slot="errorMessage" className="text-negative-500">
                {field.error + (field.error?.at(-1) === '.' ? '' : '.')}
              </Text>
            ) : (
              ''
            )}
          </div>
        )}
      </SwitchTransition>
    </div>
  );
});

export default InputMess;
