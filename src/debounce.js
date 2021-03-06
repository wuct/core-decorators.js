import { decorate, metaFor } from './private/utils';

const DEFAULT_TIMEOUT = 300;

function handleDescriptor(target, key, descriptor, [wait = DEFAULT_TIMEOUT, immediate = false]) {
  const callback = descriptor.value;

  if (typeof callback !== 'function') {
    throw new SyntaxError('Only functions can be debounced');
  }

  return {
    ...descriptor,
    value() {
      const { debounceTimeoutIds } = metaFor(this);
      const timeout = debounceTimeoutIds[key];
      const callNow = immediate && !timeout;

      clearTimeout(timeout);

      debounceTimeoutIds[key] = setTimeout(() => {
        delete debounceTimeoutIds[key];
        if (!immediate) {
          callback.apply(this, arguments);
        }
      }, wait);

      if (callNow) {
        callback.apply(this, arguments);
      }
    }
  };
}

export default function debounce(...args) {
  return decorate(handleDescriptor, args);
}
