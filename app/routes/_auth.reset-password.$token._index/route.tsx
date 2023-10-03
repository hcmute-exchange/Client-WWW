import Button from '@components/Button';
import ProgressCircle from '@components/ProgressCircle';
import TextField from '@components/TextField';
import { useForm } from '@conform-to/react';
import { Transition } from '@headlessui/react';
import { ApiClient } from '@lib/services/api-client.server';
import { toActionErrorsAsync } from '@lib/utils.server';
import { parseSubmission, parseSubmissionAsync } from '@lib/utils';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import clsx from 'clsx';
import { SwitchTransition } from 'transition-hook';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import InlineAlert from '@components/InlineAlert';
import type { TFunction } from 'i18next';
import i18next from '@lib/i18n/index.server';

interface FieldValues {
  password: string;
  confirmPassword: string;
}

function schema(t: TFunction) {
  return z
    .object({
      password: z
        .string({ required_error: t('password.required') })
        .min(7, t('password.min', { length: 7 })),
      confirmPassword: z.string({
        required_error: t('confirmPassword.required'),
      }),
    })
    .refine((x) => x.password === x.confirmPassword, {
      message: t('confirmPassword.incorrect'),
      path: ['confirmPassword'],
    });
}

export function loader({ params }: LoaderFunctionArgs) {
  if (!params.token) {
    return redirect('/');
  }
  return { token: params.token };
}

export default function Route() {
  const { t } = useTranslation('reset-password-$token');
  const lastSubmission = useActionData<typeof action>();
  const error = lastSubmission?.error.form ?? lastSubmission?.error.token;
  const [form, { password, confirmPassword }] = useForm<FieldValues>({
    lastSubmission,
    shouldValidate: 'onBlur',
    defaultValue: {
      password: '',
      confirmPassword: '',
    },
    onValidate: ({ formData }) =>
      parseSubmission(formData, { schema: schema(t) }),
  });
  const { state } = useNavigation();
  const ok = !!lastSubmission?.ok;

  return (
    <div className="w-[20rem]">
      <h1 className="font-bold mb-8">{t('h1')}.</h1>
      <SwitchTransition state={ok} timeout={500} mode="out-in">
        {(ok, stage) => (
          <div
            className={clsx(
              'transition-[opacity_transform] duration-500 ease-in-out',
              {
                from: 'opacity-0 scale-105',
                enter: '',
                leave: 'opacity-0 scale-95',
              }[stage]
            )}
          >
            {ok ? (
              <>
                <InlineAlert
                  variant="positive"
                  title={t('successAlert.title')}
                  body={t('successAlert.body')}
                />
                <div className="mt-4">
                  <Button as="link" to="/login">
                    {t('successAlert.back')}
                  </Button>
                </div>
              </>
            ) : (
              <Form
                action="?"
                method="post"
                className="grid gap-6"
                {...form.props}
              >
                <TextField
                  isRequired
                  name="password"
                  type="password"
                  label={t('password.label')}
                  description={t('password.description')}
                  className="grid"
                  errorMessage={password.error}
                />
                <TextField
                  isRequired
                  name="confirmPassword"
                  type="password"
                  label={t('confirmPassword.label')}
                  description={t('confirmPassword.description')}
                  className="grid"
                  errorMessage={confirmPassword.error}
                />
                <Button
                  type="submit"
                  className="relative w-fit"
                  isDisabled={state === 'submitting'}
                >
                  <span
                    className={clsx('block transition ease-in-out', {
                      'opacity-0': state === 'submitting',
                      'scale-0': state === 'submitting',
                    })}
                  >
                    {t('submit')}
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
                      className="w-full h-full text-neutral-500"
                      aria-label="signing in"
                    />
                  </Transition>
                </Button>
                <Transition
                  show={state !== 'submitting' && !!error}
                  enter="transition ease-in-out"
                  enterFrom="opacity-0 translate-y-8"
                  leave="transition ease-in-out duration-300"
                  leaveTo="opacity-0 translate-y-2"
                >
                  <InlineAlert
                    variant="negative"
                    title={t('unknownError')}
                    body={error?.[0]!}
                  />
                </Transition>
              </Form>
            )}
          </div>
        )}
      </SwitchTransition>
    </div>
  );
}

export async function action({ request, params }: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schema(t),
  });

  if (!submission.ok) {
    return json(submission);
  }

  const result = await ApiClient.instance.post(
    `auth/reset-password/${params.token}`,
    {
      body: {
        password: submission.value.password,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (result.isErr()) {
    return json({
      ...submission,
      ok: false,
      error: await toActionErrorsAsync(result.error),
    });
  }

  return json({ ...submission });
}