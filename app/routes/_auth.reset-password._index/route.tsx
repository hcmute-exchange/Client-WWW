import Button from '@components/Button';
import Link from '@components/Link';
import ProgressCircle from '@components/ProgressCircle';
import TextField from '@components/TextField';
import { useForm } from '@conform-to/react';
import { Transition } from '@headlessui/react';
import { ApiClient } from '@lib/services/api-client.server';
import { parseSubmissionAsync, toActionErrorsAsync } from '@lib/utils.server';
import { json, type ActionFunctionArgs } from '@remix-run/node';
import {
  Form,
  useActionData,
  useNavigation
} from '@remix-run/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { z } from 'zod';

interface FieldValues {
  email: string;
}

const schema = z.object({
  email: z.string().email(),
});

function SuccessAlert() {
  return (
    <>
      <div className="px-4 py-2 border border-positive-500 bg-neutral-50 rounded">
        <h2 className="text-base font-bold leading-body mb-2">
          Check your inbox
        </h2>
        <p className="text-neutral-700">
          You{"'"}ll receive a link to reset your password in your inbox
          shortly.
        </p>
      </div>
      <div className="mt-4">
        <Link to="/login">
          <Button type="button">Back to login</Button>
        </Link>
      </div>
    </>
  );
}

export default function Route() {
  const lastSubmission = useActionData<typeof action>();
  const [form, { email }] = useForm<FieldValues>({
    lastSubmission,
    shouldValidate: 'onBlur',
    defaultValue: {
      email: '',
    },
  });
  const error = lastSubmission?.error?.form;
  const { state } = useNavigation();
  const ok = lastSubmission?.ok;
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="w-[20rem]">
      <h1 className="font-bold mb-8">Forgot password?</h1>
      <SwitchTransition>
        <CSSTransition
          key={ok + ''}
          nodeRef={ref}
          classNames={{
            enter: 'opacity-0',
            enterActive:
              'transition-opacity duration-1000 ease-in-out opacity-100',
            exit: 'opacity-100',
            exitActive:
              'transition-opacity duration-1000 ease-in-out opacity-0',
          }}
          addEndListener={(done) =>
            ref.current!.addEventListener('transitionend', done, false)
          }
          unmountOnExit
          mountOnEnter
        >
          <div ref={ref}>
            {ok ? (
              <SuccessAlert />
            ) : (
              <Form
                action="?"
                method="post"
                className="grid gap-6"
                {...form.props}
              >
                <TextField
                  isRequired
                  name="email"
                  type="email"
                  label="Email address"
                  description="Enter your account's email address that will receive a reset link."
                  className="grid"
                  errorMessage={email.error}
                />
                <div className="flex gap-4">
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
                      Send reset email
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
                  <Link to="/login">
                    <Button
                      type="button"
                      variant="primary"
                      className="w-fit"
                      isDisabled={state === 'submitting'}
                    >
                      Back
                    </Button>
                  </Link>
                </div>
                <Transition
                  show={state !== 'submitting' && !!error}
                  enter="transition ease-in-out"
                  enterFrom="opacity-0 translate-y-8"
                  leave="transition ease-in-out duration-300"
                  leaveTo="opacity-0 translate-y-2"
                >
                  <div className="px-4 py-2 border border-negative-500 bg-neutral-50 rounded duration-500 animate-in fade-in">
                    <h2 className="text-base font-bold leading-body mb-2">
                      Unable to process your request
                    </h2>
                    <p className="text-neutral-700">{error}</p>
                  </div>
                </Transition>
              </Form>
            )}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, { schema });

  if (!submission.ok) {
    return json(submission);
  }

  interface ResetPasswordResponse {
    token: string;
  }

  const result = await ApiClient.instance.post('auth/reset-password', {
    body: submission.value,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (result.isErr()) {
    return json({
      ...submission,
      error: await toActionErrorsAsync(result.error),
    });
  }

  const body = (await result.value.body.json()) as ResetPasswordResponse;
  const sendResult = await ApiClient.instance.post('emails/send', {
    body: {
      subject: 'Human account password reset',
      templateKey: 'ResetPassword',
      templateModel: {
        ReturnUrl: `http://localhost:3000/reset-password/${body.token}`,
      },
      recipients: [{ email: submission.value.email, name: '' }],
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (sendResult.isErr()) {
    return json({
      ...submission,
      ok: false,
      error: await toActionErrorsAsync(sendResult.error),
    });
  }

  return json(submission);
}
