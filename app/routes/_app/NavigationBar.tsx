import Logo from '@components/Logo';
import { AnimatePresence } from 'framer-motion';
import MenuDropBar from './MenuDropBar';
import NavigationBarItems from './NavigationBarItems';
import ToolBar from './ToolBar';
import type { INavigationBarItem, SessionDataProps } from './types';
import Button from '@components/Button';
import Link from '@components/Link';
import type { Session } from '@remix-run/node';

type Props = SessionDataProps & {
  navigationItems: INavigationBarItem[];
  toolBarItems: INavigationBarItem[];
};
function isEmpty(session: Session<SessionData, unknown> | undefined): boolean {
  return session ? Object.keys(session.data as Object).length === 0 : true;
}

export default function NavigationBar({ navigationItems, session }: Props) {
  return (
    <AnimatePresence>
      <nav className="flex items-center justify-between w-full px-[14rem] py-2">
        <div className="flex gap-12 h-fit items-center">
          <Logo className="w-20" />
          <div className="sm:block hidden">
            <NavigationBarItems items={navigationItems} />
          </div>
          <div className="sm:hidden">
            <MenuDropBar items={navigationItems}></MenuDropBar>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isEmpty(session) ? (
            <div className="flex gap-4">
              <Button className="">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                variant="primary"
                className="bg-primary-0 hover:bg-opacity-20 hover:shadow-md
                text-primary-950 border-2 border-opacity-20 border-primary-950 border-solid"
              >
                Sign up
              </Button>
            </div>
          ) : (
            <div className="block">
              <ToolBar></ToolBar>
            </div>
          )}
        </div>
      </nav>
    </AnimatePresence>
  );
}
