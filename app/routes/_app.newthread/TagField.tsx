import { useFormFieldsContext } from '@components/Form';
import Label from '@components/Label';
import { cn } from '@lib/utils';
import clsx from 'clsx';
import { forwardRef, useEffect, useState } from 'react';
import {
  TextField as AriaTextField,
  Text,
  type TextFieldProps,
} from 'react-aria-components';
import { SwitchTransition } from 'transition-hook';
import { use } from 'i18next';
import TagBuilder from './TagBuilder';
import type { Tag } from 'react-tag-input';
import Input from '@components/Input';

interface Props extends TextFieldProps {
  name: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  inputClassName?: string;
  suggestion?: Tag[] | undefined;
}

const TagField = forwardRef<HTMLInputElement, Props>(function TextFieldEditTool(
  {
    label,
    labelClassName,
    inputClassName,
    description,
    errorMessage,
    suggestion,
    ...props
  }: Props,
  ref
) {
  const { [props.name]: field } = useFormFieldsContext() ?? {};
  const [errorDisplay, setErrorDisplay] = useState(
    errorMessage ?? field?.error
  );
  const [tags, setTags] = useState<any>([]);
  const [values, setValues] = useState<any>();

  const invalid = !!errorMessage || !!field?.error;

  useEffect(() => {
    setValues(tags.map((tag: Tag) => tag.text).join(', '));
  }, [tags]);
  useEffect(() => {
    if (!errorMessage && !field?.error) {
      return;
    }
    setErrorDisplay(errorMessage ?? field?.error);
  }, [errorMessage, field?.error]);
  const handleInputChange = (event: any) => {
    setValues(event.target.value);
    const tagArray = event.target.value
      .split(',')
      .map((tagText: any) => tagText.trim())
      .filter(Boolean) // Remove empty strings
      .map((tagText: any, index: any) => ({
        id: `id-${index}`,
        text: tagText,
      })); // Assuming each new tag gets an ID
    setTags(tagArray);
  };

  return (
    <AriaTextField
      {...props}
      isInvalid={!!props.isInvalid || invalid}
      value={tags}
    >
      <Label className={cn('mb-0.5', labelClassName)}>{label}</Label>
      <TagBuilder suggestion={suggestion} tags={tags} setTags={setTags} />
      <Input
        ref={ref}
        required={!!props.isRequired}
        value={values}
        name={props.name}
        onChange={handleInputChange}
        className={cn('hidden', {
          'peer border-negative-500': invalid,
        })}
      />
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
                {errorDisplay + (errorDisplay?.at(-1) === '.' ? '' : '.')}
              </Text>
            ) : description ? (
              <Text slot="description" className="text-primary-700">
                {description + (description.at(-1) === '.' ? '' : '.')}
              </Text>
            ) : null}
          </div>
        )}
      </SwitchTransition>
    </AriaTextField>
  );
});

export default TagField;
