import Button from '@components/Button';
import i18next from '@lib/i18n/index.server';
import { authenticate } from '@lib/utils/auth.server';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useState } from 'react';
import TabsThread from './TabsThread';
import LookFor from './LookFor';

export async function loader({
  request,
  context: { session },
}: LoaderFunctionArgs) {
  const title = await i18next
    .getFixedT(request, 'home')
    .then((x) => x('meta.title'));
  if (await authenticate(session)) {
    return json({ title, session });
  } else {
    session.unset('accessToken');
    session.unset('refreshToken');
  }

  return json({ title });
}

export const meta: MetaFunction<typeof loader> = ({ data: { title } = {} }) => {
  return [{ title: title }];
};

function Home() {
  const [popular] = useState([
    {
      title:
        'Love productivity? Level up your focus and personal time with the seven best calendar apps of 2022.',
      auth: {
        name: 'AnhQuoc',
      },
    },
    {
      title:
        'Do you form a company for each indie project or have one and they all sit under 1?',
      auth: {
        name: 'Q.Anh',
      },
    },
    {
      title:
        'I built and sold two small SaaS businesses and quit my job in the last two years — #AskMeAnything.',
      auth: {
        name: 'Anhcuto',
      },
    },
    {
      title:
        'I built and sold two small SaaS businesses and quit my job in the last two years — #AskMeAnything.',
      auth: {
        name: 'Anhcuto',
      },
    },
    {
      title:
        'I built and sold two small SaaS businesses and quit my job in the last two years — #AskMeAnything.',
      auth: {
        name: 'Anhcuto',
      },
    },
    {
      title:
        'I built and sold two small SaaS businesses and quit my job in the last two years — #AskMeAnything.',
      auth: {
        name: 'Anhcuto',
      },
    },
    {
      title:
        'I built and sold two small SaaS businesses and quit my job in the last two years — #AskMeAnything.',
      auth: {
        name: 'Anhcuto',
      },
    },
  ]);
  return (
    <div className="px-[15rem] grid grid-cols-[5fr_2fr]">
      <div className="relative p-12 border-r-2 border-solid">
        <TabsThread items={popular} />
        <Button
          className="absolute right-12 top-12 text-primary-0 "
          as="link"
          href="/newthread"
        >
          New thread
        </Button>
      </div>

      <div className="flex flex-col justify-start py-12 px-5 gap-8">
        <div className="font-semibold text-primary-700">New threads</div>
        <LookFor items={popular}></LookFor>
      </div>
    </div>
  );
}

export default Home;
