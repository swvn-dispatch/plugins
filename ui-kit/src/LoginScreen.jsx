import { useState } from 'react';
import { Center, Stack, Paper, TextInput, PasswordInput, Checkbox, Button, Text, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const REMEMBER_USERNAME_KEY = 'dispatch_ui_kit_last_username';

/**
 * @param {string} props.logoUrl
 * @param {string} props.appName - alt text on the logo image
 * @param {React.ReactNode} [props.description]
 * @param {(username: string, password: string) => Promise<void>} props.onLogin
 * @param {() => void} props.onLoggedIn
 */
export function LoginScreen({ logoUrl, appName, description, onLogin, onLoggedIn }) {
  const savedUsername = localStorage.getItem(REMEMBER_USERNAME_KEY) ?? '';
  const [username, setUsername] = useState(savedUsername);
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(!!savedUsername);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(username, password);
      if (remember) localStorage.setItem(REMEMBER_USERNAME_KEY, username);
      else localStorage.removeItem(REMEMBER_USERNAME_KEY);
      onLoggedIn();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Center mih="100dvh" bg="dark.8">
      <Stack align="center" gap="lg" w={340} px="md">
        <img src={logoUrl} style={{ height: 40, width: 'auto' }} alt={appName} />
        {description && (
          <Text size="sm" c="dimmed" ta="center">
            {description}
          </Text>
        )}
        <Paper withBorder p="xl" radius="md" w="100%">
          <form onSubmit={handleSubmit}>
            <Stack gap="sm">
              {error && (
                <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" py="xs">
                  {error}
                </Alert>
              )}
              <TextInput
                label="Username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                required
              />
              <PasswordInput
                label="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
              />
              <Checkbox
                label="Remember me"
                checked={remember}
                onChange={(e) => setRemember(e.currentTarget.checked)}
              />
              <Button type="submit" loading={loading} fullWidth mt="xs">
                Sign in
              </Button>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Center>
  );
}
