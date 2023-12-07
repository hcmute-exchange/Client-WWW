import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
  MapIcon,
  RectangleGroupIcon,
  Square2StackIcon,
  WrenchIcon,
} from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import NavigationBar from './NavigationBar';
import type { INavigationBarItem } from './types';

export default function Header() {
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
      text: 'Manage user',
      href: '/admin',
      icon: <Square2StackIcon className="w-5 h-5" />,
    },
    {
      text: 'Manage category',
      href: '/admin/category',
      icon: <RectangleGroupIcon className="w-5 h-5" />,
    },
    {
      text: 'Manage thread',
      href: '/admin/managethread',
      icon: <MapIcon className="w-5 h-5" />,
    },
    {
      text: 'Manage message',
      href: '/admin/managemessage',
      icon: <Cog6ToothIcon className="w-5 h-5" />,
    },
  ];
  return (
    <header className="lg:min-h-screen border-solid border-primary-200 lg:border-r lg:border-b-0 border-b">
      <NavigationBar
        navigationItems={navigationItems}
        toolBarItems={toolBarItems}
      />
    </header>
  );
}
