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

export type Intention = typeof INTENTIONS[keyof typeof INTENTIONS];  
export type Status = typeof STATUS[keyof typeof STATUS];  

