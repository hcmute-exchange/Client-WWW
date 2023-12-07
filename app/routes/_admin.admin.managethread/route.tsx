import Button from '@components/Button';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import i18next from '@lib/i18n/index.server';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Suspense } from 'react';
import ThreadTable from './Table';
import { ApiClient } from '@lib/services/api-client.server';
import type { GetPostResult } from '../_app._index/type';
import { useLoaderData } from '@remix-run/react';

export async function loader({
  request,
  context: { session },
}: LoaderFunctionArgs) {
  const title = await i18next.getFixedT(request, 'meta').then((t) => 'Admin');
  const result = (await ApiClient.instance.get('posts').match(
    (x) => (x.ok ? x.json() : {}),
    () => ({})
  )) as GetPostResult[];

  return json({ title, result });
}
function route() {
  const { result } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="flex justify-between items-center gap-8 mt-4">
        <h1>Manage Thread</h1>
      </div>
      <Suspense fallback="Loading">
        {/* <Await resolve={departmentsPromise}> */}
        <ThreadTable
          items={result.map((x) => ({
            id: x.id,
            createdTime: x.createdTime,
            updatedTime: x.updatedTime,
            subject: x.subject,
            initialMessage: x.initialMessage,
            tags: x.tags,
          }))}
        />
        {/* </Await> */}
      </Suspense>
    </>
  );
}

export default route;
