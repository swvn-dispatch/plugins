import { Select, NumberInput, TextInput, PasswordInput } from '@mantine/core';
import { FieldLabel } from './FieldLabel.jsx';

export function FieldRenderer({ field, value, onChange }) {
  const common = { label: <FieldLabel label={field.label} description={field.description} /> };
  switch (field.type) {
    case 'select': {
      const seen = new Set();
      const data = (field.options ?? []).reduce((acc, o) => {
        const v = String(o.value);
        if (!seen.has(v)) {
          seen.add(v);
          acc.push({ value: v, label: o.label });
        }
        return acc;
      }, []);
      return (
        <Select
          {...common}
          data={data}
          value={String(value ?? field.default ?? '')}
          onChange={onChange}
          allowDeselect={false}
        />
      );
    }
    case 'number':
      return (
        <NumberInput
          {...common}
          value={value ?? field.default ?? 0}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          onChange={onChange}
        />
      );
    case 'string': {
      const Input = field.input_type === 'password' ? PasswordInput : TextInput;
      return (
        <Input
          {...common}
          value={value ?? field.default ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
      );
    }
    default:
      return null;
  }
}
