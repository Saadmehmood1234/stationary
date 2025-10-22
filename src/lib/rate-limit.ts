import { LRUCache } from "lru-cache";

const rateLimitCache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 15,
});

export const checkRateLimit = (identifier: string, limit: number = 5): boolean => {
  const current = rateLimitCache.get(identifier) as number | undefined;
  
  if (current === undefined) {
    rateLimitCache.set(identifier, 1);
    return true;
  }
  
  if (current >= limit) {
    return false;
  }
  
  rateLimitCache.set(identifier, current + 1);
  return true;
};