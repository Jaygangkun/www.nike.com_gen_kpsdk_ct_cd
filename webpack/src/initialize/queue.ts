let queue: Array<() => void> = [];

const addToQueue = (cb: () => void): void => {
  queue.push(cb);
};

const drainQueue = (): void => {
  const q = queue;
  queue = [];

  q.forEach((cb): void => {
    cb();
  });
};

export { addToQueue, drainQueue };
