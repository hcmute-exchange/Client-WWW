import { useState } from 'react';
import Popular from './Popular';
import Newest from './Newest';
import Tabs from '@components/Tabs';

function TabsThread({ items }: any) {
  const [listThread] = useState([
    {
      label: 'Popular',
      panel: <Popular items={items} />,
    },
    {
      label: 'Newest',
      panel: <Newest />,
    },
  ]);
  return <Tabs items={listThread} />;
}

export default TabsThread;
