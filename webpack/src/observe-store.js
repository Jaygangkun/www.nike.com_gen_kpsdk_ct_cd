/**
 * @private
 * @ignore
 * observes different redux stores to act on actions and state derived from them
 * @param {object} store - a redux store
 * @param {Function} onChange - a callback function that is invoked when state changes
 * @returns {Function} the unsubscribe function for the store that is passed in
 */
 export default function observeStore(store, onChange) {
    let currentState;
  
    /**
     * @private
     * @ignore
     * @returns {undefined} closure that invokes the onChange callback passed in
     */
    function handleChange() {
      const nextState = store.getState();
      if (nextState !== currentState) {
        currentState = nextState;
        onChange(currentState);
      }
    }
  
    const unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
  }
  