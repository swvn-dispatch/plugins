import { Fragment } from 'react';
import { AppShell, Group, Image, Text, Button, ActionIcon, Menu, UnstyledButton, Stack } from '@mantine/core';
import { IconBrandGithub, IconCoffee } from '@tabler/icons-react';

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

/**
 * @param {{
 *   logoUrl: string,
 *   appName?: string,
 *   version?: string,
 *   actions?: HeaderAction[],
 *   onLogout: () => void,
 *   githubUrl?: string,
 *   kofiUrl?: string,
 * }} props
 */
export function AppHeader({
  logoUrl,
  appName,
  version,
  actions = [],
  onLogout,
  githubUrl,
  kofiUrl = 'https://ko-fi.com/sethwv',
}) {
  const logo = <Image src={logoUrl} h={32} w="auto" />;
  const hasMenu = Boolean(githubUrl || kofiUrl);

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between" wrap="nowrap">
        <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
          {hasMenu ? (
            <Menu shadow="md" width={300} position="bottom-start">
              <Menu.Target>
                <UnstyledButton style={{ display: 'flex', alignItems: 'center' }} aria-label="Plugin links">
                  {logo}
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                {githubUrl && (
                  <Menu.Item
                    component="a"
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftSection={<IconBrandGithub size={16} />}
                  >
                    {appName} on GitHub
                  </Menu.Item>
                )}
                {kofiUrl && (
                  <Menu.Item
                    component="a"
                    href={kofiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftSection={<IconCoffee size={16} />}
                  >
                    Buy me a Coffee
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          ) : (
            logo
          )}
          <Stack gap={0}>
            {appName && (
              <Text size="xs" lh={1}>
                {appName}
              </Text>
            )}
            {version && (
              <Text size="xs" c="dimmed" lh={1}>
                v{version}
              </Text>
            )}
          </Stack>
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
