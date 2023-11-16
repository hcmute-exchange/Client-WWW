import { cn } from '@lib/utils';
import clsx from 'clsx';
import type { Key, ReactNode } from 'react';
import {
  Tabs as AriaTabs,
  Tab,
  TabList,
  TabPanel,
  type TabsProps,
} from 'react-aria-components';

type Props = Omit<TabsProps, 'items'> & {
  items: { label: string; panel: ReactNode }[];
  className?: string;
  tabListclassName?: string;
  tabclassName?: string;
};

const baseClass1 = 'flex flex-col gap-5 outline-none';
const baseClass2 = 'flex gap-4';
const baseClass3 =
  'px-2 py-1 cursor-pointer pb-5 w-fit rac-selected:text-accent-500 font-medium rac-selected:border-b-2 border-accent-400 border-solid outline-none';
function Tabs({ items, className, tabListclassName, tabclassName }: Props) {
  return (
    <AriaTabs className={cn(baseClass1, className)}>
      <TabList className={cn(baseClass2, tabListclassName)}>
        {items.map(({ label, panel }) => (
          <Tab id={label} className={cn(baseClass3, tabclassName)}>
            {label}
          </Tab>
        ))}
      </TabList>
      {items.map(({ label, panel }) => (
        <TabPanel id={label}>{panel}</TabPanel>
      ))}
    </AriaTabs>
  );
}

export default Tabs;
