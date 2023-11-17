import Breadcrumbs from '@components/Breadcrumbs';
import TextLink from '@components/TextLink';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import i18next from '@lib/i18n/index.server';
import { json, type LoaderFunctionArgs, type Session } from '@remix-run/node';
import { useMatches, type UIMatch, useLoaderData } from '@remix-run/react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { authenticate } from '@lib/utils/auth.server';

export async function loader({
  request,
  context: { session },
}: LoaderFunctionArgs) {
  const title = await i18next
    .getFixedT(request, 'meta')
    .then((x) => x('home.title'));
  if (await authenticate(session)) {
    return json({ title, session });
  } else {
    session.unset('accessToken');
    session.unset('refreshToken');
  }
  return json({ title, session });
}

export const handle = {
  i18n: 'home',
  breadcrumb: true,
};

function isMatchWithBreadcrumb(
  x: unknown
): x is UIMatch<Required<RouteData>, Required<RouteHandle>> {
  return (
    typeof x === 'object' &&
    !!(x as UIMatch<Required<RouteData>, Required<RouteHandle>>).handle
      ?.breadcrumb &&
    !!(x as UIMatch<Required<RouteData>, Required<RouteHandle>>).data.title
  );
}

function App() {
  const matches = useMatches();
  const loaderData = useLoaderData<typeof loader>();
  const session: Session<SessionData, unknown> | undefined =
    loaderData.session as Session<SessionData, unknown> | undefined;

  const breadcrumbItems = matches
    .filter((x): x is UIMatch<RouteData, Required<RouteHandle>> =>
      isMatchWithBreadcrumb(x)
    )
    .map((x, i, arr) => ({
      key: x.id,
      node: (
        <>
          <TextLink
            href={x.pathname}
            variant="primary"
            className="transition-[color_font-weight] ease-in-out group-last:font-bold group-last:text-primary-900 group-last:pointer-events-none"
          >
            {i === 0 ? <HomeIcon className="w-4 h-4" /> : x.data.title}
          </TextLink>
          {i !== arr.length - 1 ? (
            <ChevronRightIcon className="w-4 h-4 text-primary-500" />
          ) : null}
        </>
      ),
    }));

  return (
    <div className="flex flex-col max-h-screen">
      <Header session={session} />
      <div className="bg-primary-0 flex-grow max-w-screen h-fit">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
