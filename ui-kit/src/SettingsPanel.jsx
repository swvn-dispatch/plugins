import { Stack, Alert, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { CollapsiblePanel } from './CollapsiblePanel.jsx';
import { FieldRenderer } from './FieldRenderer.jsx';
import { useDebouncedFieldSave } from './useDebouncedFieldSave.js';

/**
 * @param {Array<{id:string,type:string,label:string,description?:string,default?:any,options?:any[],min?:number,max?:number,placeholder?:string}>} props.fields
 * @param {Array<{id:string,label:string,description?:string}>} [props.warnings]
 * @param {Record<string, any>} props.values
 * @param {(updates: Record<string, any>) => Promise<void>} props.onSave - persists one field update
 * @param {(updates: Record<string, any>) => void} [props.onOptimisticChange]
 * @param {(fieldId: string) => boolean} [props.shouldReload]
 * @param {() => Promise<void>} [props.onReload]
 * @param {(updates: Record<string, any>) => void} [props.onSaved]
 * @param {(err: Error) => void} [props.onError]
 * @param {string} [props.title='Global Settings']
 */
export function SettingsPanel({
  fields,
  warnings = [],
  values,
  onSave,
  onOptimisticChange,
  shouldReload,
  onReload,
  onSaved,
  onError,
  title = 'Global Settings',
}) {
  const handleChange = useDebouncedFieldSave(onSave, { onOptimisticChange, shouldReload, onReload, onSaved, onError });

  return (
    <Stack gap="xs">
      {warnings.map((w) => (
        <Alert key={w.id} icon={<IconAlertCircle size={16} />} color="yellow" variant="light">
          <Text size="sm" fw={500}>{w.label}</Text>
          {w.description && <Text size="xs" c="dimmed" mt={2}>{w.description}</Text>}
        </Alert>
      ))}
      <CollapsiblePanel title={title}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--mantine-spacing-sm)',
            padding: 'var(--mantine-spacing-md)',
            paddingTop: 0,
          }}
        >
          {fields.map((f) => (
            <FieldRenderer key={f.id} field={f} value={values[f.id]} onChange={(v) => handleChange(f.id, v, f.type !== 'string')} />
          ))}
        </div>
      </CollapsiblePanel>
    </Stack>
  );
}
