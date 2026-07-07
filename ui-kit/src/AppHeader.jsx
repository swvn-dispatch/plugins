import { Fragment } from 'react';
import { AppShell, Group, Image, Text, Button, ActionIcon } from '@mantine/core';

// Reproduces multiview's exact teal-9/teal-8 highlight (not just a color prop
// swap) so an `active` HeaderAction matches the original pixel-for-pixel.
function activeStyleProps(active) {
  if (!active) return {};
  return {
    color: 'teal',
    variant: 'filled',
    styles: {
      root: {
        '--button-bg': 'var(--mantine-color-teal-9)',
        '--button-hover': 'var(--mantine-color-teal-8)',
      },
    },
  };
}

/**
 * @typedef {object} HeaderAction
 * @property {string} key
 * @property {string} label
 * @property {React.ComponentType} icon - icon component reference, rendered at two sizes (16/18)
 * @property {() => void} onClick
 * @property {boolean} [loading]
 * @property {boolean} [active] - renders the teal-highlighted variant
 * @property {number} [count] - appended as ` (${count})` to the Button label only
 */

/** @param {{ logoUrl: string, version?: string, actions?: HeaderAction[], onLogout: () => void }} props */
export function AppHeader({ logoUrl, version, actions = [], onLogout }) {
  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between" wrap="nowrap">
        <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
          <Image src={logoUrl} h={32} w="auto" />
          {version && (
            <Text size="xs" c="dimmed">
              v{version}
            </Text>
          )}
        </Group>
        <Group gap="xs" wrap="nowrap">
          {actions.map(({ key, label, icon: Icon, onClick, loading, active, count }) => (
            <Fragment key={key}>
              <Button
                size="sm"
                leftSection={<Icon size={16} />}
                loading={loading}
                onClick={onClick}
                visibleFrom="xs"
                {...activeStyleProps(active)}
              >
                {label}
                {count > 0 ? ` (${count})` : ''}
              </Button>
              <ActionIcon
                size="lg"
                variant="default"
                loading={loading}
                hiddenFrom="xs"
                aria-label={label}
                onClick={onClick}
                {...activeStyleProps(active)}
              >
                <Icon size={18} />
              </ActionIcon>
            </Fragment>
          ))}
          <Button size="sm" variant="subtle" onClick={onLogout}>
            Logout
          </Button>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
