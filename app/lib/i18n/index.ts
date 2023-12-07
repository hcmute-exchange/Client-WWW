export const config = {
  supportedLngs: ['en'],
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: [
    'common',
    'login',
    'reset-password',
    'reset-password-$token',
    'home',
    'newthread',
    'signup',
  ],
  react: { useSuspense: false },
  keySeparator: '.',
};
