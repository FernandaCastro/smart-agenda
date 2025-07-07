export const INTENTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  RETRIEVE: 'retrieve',
} as const;

export const STATUS = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  CANCELLED: 'cancelled',
} as const;

const STATUS_ICON = {
  PENDING: '🕒',
  RESOLVED: '✅',
  CANCELLED: '🚫',
} as const;

type Intention = typeof INTENTIONS[keyof typeof INTENTIONS];  
type Status = typeof STATUS[keyof typeof STATUS];  
type StatusKey = keyof typeof STATUS_ICON;

export function getStatusIcon(status: string): string {
  const key = status.toUpperCase() as StatusKey;
  return STATUS_ICON[key] || '❓';
}


