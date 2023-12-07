import Link from '@components/Link';
import MyTooltip from '@components/Tooltip';
import { useLocation } from '@remix-run/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { TooltipTrigger } from 'react-aria-components';
import type { INavigationBarItem } from './types';

export default function NavigationBarItems({
  items,
}: {
  items: INavigationBarItem[];
}) {
  const { pathname } = useLocation();
  return (
    <ul className={`flex gap-2`}>
      {items.map((i, idx) => (
        <li key={idx} className="relative list-none">
          {pathname.startsWith(i.href) && (
            <motion.div
              layoutId="underline"
              className="absolute -z-30 bg-primary-100 w-full h-full rounded-lg"
            />
          )}
          <TooltipTrigger delay={200}>
            <Link
              href={i.href}
              className={clsx(
                'no-underline flex items-center w-full text-primary-900 sm:py-2 gap-2 rounded-md px-3',
                { 'text-accent-500 font-semibold': pathname === i.href }
              )}
            >
              <MyTooltip className="lg:hidden inline-block rounded bg-primary-100 px-4 py-1 mt-2">
                {i.text}
              </MyTooltip>
              {i.icon}
              <p className="">{i.text}</p>
            </Link>
          </TooltipTrigger>
        </li>
      ))}
    </ul>
  );
}
