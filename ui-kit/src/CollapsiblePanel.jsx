import { useState } from 'react';
import { Paper, Card, UnstyledButton, Group, Text, Collapse } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

/**
 * @param {React.ReactNode} props.title
 * @param {boolean} [props.defaultOpened=false]
 * @param {React.ReactNode} [props.trailingAction] - rendered in the header, right of the chevron/title group
 * @param {'Paper'|'Card'} [props.as='Paper']
 * @param {React.ReactNode} props.children
 */
export function CollapsiblePanel({ title, defaultOpened = false, trailingAction, as = 'Paper', children }) {
  const [opened, setOpened] = useState(defaultOpened);
  const Container = as === 'Card' ? Card : Paper;

  return (
    <Container withBorder radius="md" p={as === 'Card' ? 0 : undefined}>
      <UnstyledButton w="100%" p="md" onClick={() => setOpened((o) => !o)}>
        <Group justify="space-between">
          <Group gap="xs">
            {opened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
            <Text size="sm" fw={600}>{title}</Text>
          </Group>
          {trailingAction}
        </Group>
      </UnstyledButton>
      <Collapse in={opened}>{children}</Collapse>
    </Container>
  );
}
