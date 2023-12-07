import { useState } from 'react';
import Popular from './Popular';
import Newest from './Newest';
import Tabs from '@components/Tabs';
import type { CardPostProps } from './Card';

function TabsThread(props: {
  newest: CardPostProps[];
  popular: CardPostProps[];
}) {
  const [listThread] = useState([
    {
      label: 'Newest',
      panel: <Newest items={Object.values(props.newest)} />,
    },
    {
      label: 'Popular',
      panel: <Popular items={Object.values(props.popular)} />,
    },
  ]);
  return <Tabs items={listThread} />;
}

export default TabsThread;
