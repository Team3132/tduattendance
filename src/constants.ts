/** Prod */
export const ROLES = {
  MENTOR:
    process.env.NODE_ENV === 'production'
      ? '605687041228800030'
      : '997106706616176690',
};

export type ROLE = keyof typeof ROLES;

/** Testing */
// export enum ROLES {
//   MENTOR = '997106706616176690',
// }
