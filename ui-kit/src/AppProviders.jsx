import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from './theme.js';

export function AppProviders({ children, defaultColorScheme = 'dark', notificationsPosition = 'bottom-right' }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme={defaultColorScheme}>
      <Notifications position={notificationsPosition} />
      {children}
    </MantineProvider>
  );
}
