import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  Square2StackIcon,
} from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import NavigationBar from './NavigationBar';
import type { INavigationBarItem, SessionDataProps } from './types';

export default function Header({ session }: SessionDataProps) {
  const { t } = useTranslation('home');

  const toolBarItems: INavigationBarItem[] = [
    {
      text: t('logout'),
      href: '/logout',
      icon: <ArrowLeftOnRectangleIcon className="w-5 h-5" />,
    },
  ];
  const navigationItems: INavigationBarItem[] = [
    {
      text: t('bar.home'),
      href: '/',
      icon: <Square2StackIcon className="w-5 h-5" />,
    },
    {
      text: t('bar.setting'),
      href: '/setting',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
    },
  ];
  return (
    <header className="border-solid border-primary-200">
      <NavigationBar
        navigationItems={navigationItems}
        toolBarItems={toolBarItems}
        session={session}
      />
    </header>
  );
}
