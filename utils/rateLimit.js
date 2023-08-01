// utils/rateLimit.js
// This code defines a function named `rateLimit` that takes in an options object and returns an object with a `check` method.
//
// The `rateLimit` function creates a new instance of an LRUCache from the `lru-cache` package, using the `options` provided or default values if no options are provided.
//
// The `check` method takes in a response object (`res`), a limit value, a token, and a request object (`req`). It returns a promise that resolves if the rate limit is not exceeded and rejects if the rate limit is exceeded.
//
// Within the `check` method:
// - The IP address is extracted from the request headers or the connection remote address.
// - The token is concatenated with the IP address.
// - The token count is retrieved from the cache or initialized to [0] if it doesn't exist.
// - The token count is incremented.
// - The current usage is calculated.
// - The `X-RateLimit-Limit` and `X-RateLimit-Remaining` headers are set in the response.
// - A log message is printed with the token, current usage, and limit.
// - The promise is rejected if the rate limit is exceeded or resolved otherwise.
import {LRUCache} from 'lru-cache';

export default function rateLimit(options) {
    const tokenCache = new LRUCache({
        max: (options === null || options === void 0 ? void 0 : options.uniqueTokenPerInterval) || 500,
        ttl: (options === null || options === void 0 ? void 0 : options.interval) || 60000,
    });

    return {
        check: (res, limit, token, req) => new Promise((resolve, reject) => {
            // Include the IP address in the token
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const tokenWithIP = `${ip}-${token}`;

            const tokenCount = tokenCache.get(tokenWithIP) || [0];
            if (tokenCount[0] === 0) {
                tokenCache.set(tokenWithIP, tokenCount);
            }
            tokenCount[0] += 1;
            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage >= limit;
            res.setHeader('X-RateLimit-Limit', limit);
            res.setHeader('X-RateLimit-Remaining', isRateLimited ? 0 : limit - currentUsage);
            return isRateLimited ? reject() : resolve();
        }),
    };
}
