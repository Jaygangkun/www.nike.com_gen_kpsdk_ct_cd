import { hasLocalStorage } from '../../utils';

const getDebugMode = (): boolean => {
  if (
    hasLocalStorage() &&
    localStorage.getItem('debug') &&
    localStorage.getItem('debug') !== 'undefined'
  ) {
    return true;
  }

  return false;
};

export { getDebugMode };
