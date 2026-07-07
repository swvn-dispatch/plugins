import { Group, ActionIcon, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

export function FieldLabel({ label, description }) {
  if (!description) return label;
  return (
    <Group gap={4} align="center" wrap="nowrap">
      <span>{label}</span>
      <Tooltip
        label={description}
        multiline
        maw={260}
        withArrow
        position="top-start"
        events={{ hover: true, focus: true, touch: true }}
      >
        <ActionIcon size="xs" variant="transparent" c="dimmed" tabIndex={-1} style={{ cursor: 'default', flexShrink: 0 }}>
          <IconInfoCircle size={13} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
