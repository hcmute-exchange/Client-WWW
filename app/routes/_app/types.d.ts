import type { Session } from '@remix-run/node';
import type { ReactNode } from 'react';

export type INavigationBarItem = {
  text: string;
  href: string;
  icon: ReactNode;
};

export type SessionDataProps = {
  session?: Session<SessionData, unknown>;
};
