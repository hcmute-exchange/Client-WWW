import Button from '@components/Button';
import i18next from '@lib/i18n/index.server';
import { authenticate } from '@lib/utils/auth.server';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
  redirect,
} from '@remix-run/node';
import { useState } from 'react';
import TabsThread from './TabsThread';
import LookFor from './LookFor';
import { ApiClient } from '@lib/services/api-client.server';
import type { GetPostResult } from './type';
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import { t, type TFunction } from 'i18next';
import { z } from 'zod';
import Form from '@components/Form';
import { parseSubmission, parseSubmissionAsync } from '@lib/utils';
import TextField from '@components/TextField';
import clsx from 'clsx';
import { Transition } from '@headlessui/react';
import ProgressCircle from '@components/ProgressCircle';
import { subBusinessDays } from 'date-fns';
import { toActionErrorsAsync } from '@lib/utils/error.server';
interface FieldValues {
  input: string;
}

export function schemaSearch(t: TFunction) {
  return z.object({
    input: z.string({}),
  });
}
export async function loader({
  request,
  context: { session },
}: LoaderFunctionArgs) {
  const title = await i18next
    .getFixedT(request, 'home')
    .then((x) => x('meta.title'));
  const newest = (await ApiClient.instance.get('newestPosts').match(
    (x) => (x.ok ? x.json() : {}),
    () => ({})
  )) as GetPostResult[];
  const popular = (await ApiClient.instance.get('popularPosts').match(
    (x) => (x.ok ? x.json() : {}),
    () => ({})
  )) as GetPostResult[];
  return json({ title, newest, popular });
}

export const meta: MetaFunction<typeof loader> = ({ data: { title } = {} }) => {
  return [{ title: title }];
};

function route() {
  const { newest, popular } = useLoaderData<typeof loader>();
  const { state } = useNavigation();
  const a = useActionData<typeof action>();

  return (
    <div className="px-[15rem] grid grid-cols-[5fr_2fr]">
      <div className="relative p-12 border-r-2 border-solid">
        <TabsThread
          newest={newest.map((x) => ({
            id: x.id,
            createdTime: x.createdTime,
            updatedTime: x.updatedTime,
            subject: x.subject,
            initialMessage: x.initialMessage,
            tags: x.tags,
            views: x.views,
          }))}
          popular={popular.map((x) => ({
            id: x.id,
            createdTime: x.createdTime,
            updatedTime: x.updatedTime,
            subject: x.subject,
            initialMessage: x.initialMessage,
            tags: x.tags,
            views: x.views,
          }))}
        />
        <Button
          className="absolute right-12 top-12 text-primary-0 "
          as="link"
          href="/newthread"
        >
          New thread
        </Button>
      </div>

      <div className="flex flex-col justify-start py-12 px-5 gap-8">
        <div>
          <Form<FieldValues>
            method="post"
            className="flex flex-col gap-6"
            config={{
              defaultValue: {
                input: '',
              },
              onValidate: ({ formData }) =>
                parseSubmission(formData, { schema: schemaSearch(t) }),
            }}
          >
            <TextField
              isRequired
              name="input"
              type="text"
              label="Search..."
              className="grid"
              labelClassName="font-semibold text-primary-950"
              inputClassName="bg-primary-50"
            />
            <Button
              type="submit"
              className="relative w-fit bg-accent-500 hidden"
              isDisabled={state === 'submitting'}
            ></Button>
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
          </Form>
        </div>
        <div className="font-semibold text-primary-700">
          Looking for Threads
        </div>
        {a && Array.isArray(a.result) && a.result.length > 0 ? (
          <LookFor
            items={a.result.map((x) => ({
              id: x.id,
              createdTime: x.createdTime,
              updatedTime: x.updatedTime,
              subject: x.subject,
              initialMessage: x.initialMessage,
              tags: x.tags,
              views: x.views,
            }))}
          ></LookFor>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default route;

export async function action({
  request,
  context: { session },
}: ActionFunctionArgs) {
  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  const submission = await parseSubmissionAsync(formData, {
    schema: schemaSearch(t),
  });
  if (!submission.ok) {
    return json(submission);
  }
  const result = (await ApiClient.instance
    .get(`posts/${submission.value.input}`)
    .match(
      (x) => (x.ok ? x.json() : {}),
      () => ({})
    )) as GetPostResult[];
  return json({
    result,
  });
}
