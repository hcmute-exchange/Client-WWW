import Button from '@components/Button';
import Form from '@components/Form';
import TextField from '@components/TextField';
import { parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { useNavigation } from '@remix-run/react';
import clsx from 'clsx';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Transition } from '@headlessui/react';
import ProgressCircle from '@components/ProgressCircle';
import TextFieldEditTool from './TextFieldEditTool.client';
import i18next from '@lib/i18n/index.server';
import type { ActionFunctionArgs } from '@remix-run/node';
import { ClientOnly } from 'remix-utils/client-only';

interface FieldValues {
  subject: string;
  body: string;
  tag: string;
}

function schema(t: TFunction) {
  return z.object({
    subject: z.string({ required_error: t('subject.required') }),
    tag: z.string({ required_error: t('tag.required') }),
    body: z.string({ required_error: t('body.required') }),
  });
}

export function handle() {
  return { i18n: 'newthread' };
}

function route() {
  const { t } = useTranslation('newthread');
  const { state } = useNavigation();
  return (
    <div className="px-[15rem] py-12 flex flex-col gap-8">
      <h1 className="font-semibold">Create new thread.</h1>
      <div>
        <Form<FieldValues>
          action="?"
          method="post"
          className="flex flex-col gap-6"
          config={{
            defaultValue: {
              subject: '',
              body: '',
              tag: '',
            },
            shouldValidate: 'onBlur',
            onValidate: ({ formData }) =>
              parseSubmission(formData, { schema: schema(t) }),
          }}
        >
          <TextField
            isRequired
            name="subject"
            type="text"
            label={t('subject.lable')}
            description={t('subject.desc')}
            className="grid"
            labelClassName="font-semibold text-primary-950"
            inputClassName="bg-primary-50"
          />
          <ClientOnly>
            {() => (
              <TextFieldEditTool
                isRequired
                name="body"
                type="text"
                label={t('body.lable')}
                description={t('body.desc')}
                className="grid"
                labelClassName="font-semibold text-primary-950"
                inputClassName="hidden"
              />
            )}
          </ClientOnly>

          <TextField
            isRequired
            name="tag"
            type="text"
            label={t('tag.lable')}
            description={t('tag.desc')}
            className="grid"
            labelClassName="font-semibold text-primary-950"
            inputClassName="bg-primary-50"
          />
          <Button
            type="submit"
            className="relative w-fit bg-accent-500"
            isDisabled={state === 'submitting'}
          >
            <span
              className={clsx('block transition ease-in-out', {
                'opacity-0': state === 'submitting',
                'scale-0': state === 'submitting',
              })}
            >
              Post thread
            </span>
            <Transition
              show={state === 'submitting'}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3"
              enter="transition ease-in-out"
              enterFrom="opacity-0 scale-0"
              leave="transition ease-in-out duration-300"
              leaveTo="opacity-0 scale-0"
            >
              <ProgressCircle
                isIndeterminate
                className="w-full h-full text-primary-500"
                aria-label="signing in"
              />
            </Transition>
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default route;
export async function action({ request }: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });
  console.log(submission);
}
