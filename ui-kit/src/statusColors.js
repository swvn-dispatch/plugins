export const DEFAULT_STATUS_COLORS = {
  active: 'green', ok: 'green', success: 'green',
  buffering: 'yellow', connecting: 'yellow', initializing: 'yellow', warning: 'yellow',
  waiting: 'blue', info: 'blue',
  error: 'red', failed: 'red',
  stopped: 'gray', stopping: 'gray', idle: 'gray', inactive: 'gray',
};

/** @param {string} status @param {Record<string,string>} [overrides] app-specific state names not in the default bucket */
export function resolveStatusColor(status, overrides = {}) {
  return overrides[status] ?? DEFAULT_STATUS_COLORS[status] ?? 'gray';
}
