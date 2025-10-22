export const isTokenValid = (tokenExpires: Date): boolean => {
  return new Date() < new Date(tokenExpires);
};