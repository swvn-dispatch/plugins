import { useCallback, useRef } from 'react';

/**
 * @param {(updates: Record<string, any>) => Promise<void>} save - persists one field update (e.g. patchConfig)
 * @param {object} [opts]
 * @param {(updates: Record<string, any>) => void} [opts.onOptimisticChange]
 * @param {(fieldId: string) => boolean} [opts.shouldReload] - if true, onReload() is awaited after a successful save
 * @param {() => Promise<void>} [opts.onReload]
 * @param {(updates: Record<string, any>) => void} [opts.onSaved] - called after a successful save
 * @param {(err: Error) => void} [opts.onError] - called if `save` (or `onReload`) throws; without this,
 *                                                 debounced saves would otherwise fail silently
 * @param {number} [opts.delayMs=700]
 * @returns {(fieldId: string, value: any, immediate?: boolean) => Promise<void>}
 */
export function useDebouncedFieldSave(save, { onOptimisticChange, shouldReload, onReload, onSaved, onError, delayMs = 700 } = {}) {
  const timers = useRef({});
  return useCallback(
    (fieldId, value, immediate) => {
      onOptimisticChange?.({ [fieldId]: value });
      const updates = { [fieldId]: value };
      const doSave = async () => {
        try {
          await save(updates);
          onSaved?.(updates);
          if (shouldReload?.(fieldId)) await onReload?.();
        } catch (err) {
          onError?.(err);
        }
      };
      clearTimeout(timers.current[fieldId]);
      if (immediate) return doSave();
      timers.current[fieldId] = setTimeout(doSave, delayMs);
      return Promise.resolve();
    },
    [save, onOptimisticChange, shouldReload, onReload, onSaved, onError, delayMs],
  );
}
