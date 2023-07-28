import {LRUCache} from 'lru-cache';
export default function rateLimit(options) {
    const tokenCache = new LRUCache({
        max: (options === null || options === void 0 ? void 0 : options.uniqueTokenPerInterval) || 500,
        ttl: (options === null || options === void 0 ? void 0 : options.interval) || 60000,
    });
    return {
        check: (res, limit, token) => new Promise((resolve, reject) => {
            const tokenCount = tokenCache.get(token) || [0];
            if (tokenCount[0] === 0) {
                tokenCache.set(token, tokenCount);
            }
            tokenCount[0] += 1;
            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage >= limit;
            res.setHeader('X-RateLimit-Limit', limit);
            res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : limit - currentUsage);
            console.log(`Rate limit: ${token} => ${currentUsage}/${limit}`);
            return isRateLimited ? reject() : resolve();
        }),
    };
}
