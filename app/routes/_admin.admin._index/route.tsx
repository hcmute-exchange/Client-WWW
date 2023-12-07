import i18next from '@lib/i18n/index.server';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import type { GetPostResult } from '../_app._index/type';
import { ApiClient } from '@lib/services/api-client.server';

export async function loader({
  request,
  context: { session },
}: LoaderFunctionArgs) {
  const title = await i18next.getFixedT(request, 'meta').then((t) => 'Admin');
  return json({ title });
}

export const handle = {
  i18n: 'meta',
};

function route() {
  return <div>route</div>;
}

export default route;
