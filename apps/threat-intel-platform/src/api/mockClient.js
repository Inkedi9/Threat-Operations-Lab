export function mockFetch(data, options = {}) {
  const { delay = 300 + Math.random() * 800, errorRate = 0 } = options;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < errorRate) {
        reject(new Error("Mock API error"));
      } else {
        resolve({
          data,
          meta: {
            delay: Math.round(delay),
            timestamp: Date.now(),
          },
        });
      }
    }, delay);
  });
}
