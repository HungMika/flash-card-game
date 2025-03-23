const USER_KEY = 'user';

const isBrowser = typeof window !== 'undefined';

export function setUser(user: any) {
  if (!isBrowser) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): any | null {
  if (!isBrowser) return null;
  const value = localStorage.getItem(USER_KEY);
  return value ? JSON.parse(value) : null;
}

export function removeUser() {
  if (!isBrowser) return;
  localStorage.removeItem(USER_KEY);
}
