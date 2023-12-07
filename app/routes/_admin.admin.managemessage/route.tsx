import Button from '@components/Button';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import i18next from '@lib/i18n/index.server';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { Suspense } from 'react';
import ThreadTable from './Table';
import { ApiClient } from '@lib/services/api-client.server';
import type { GetPostResult } from '../_app._index/type';
import { useLoaderData } from '@remix-run/react';
import type { GetMessResult } from '../_app.thread.$id/type';

export async function loader({
  request,
  context: { session },
}: LoaderFunctionArgs) {
  const title = await i18next.getFixedT(request, 'meta').then((t) => 'Admin');
  const result = (await ApiClient.instance.get('messages').match(
    (x) => (x.ok ? x.json() : {}),
    () => ({})
  )) as GetMessResult[];

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
            body: x.body,
            user: x.user,
          }))}
        />
        {/* </Await> */}
      </Suspense>
    </>
  );
}

export default route;
