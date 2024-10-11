export const useAsync = <Data>(
  promise: Promise<Data> | ((...args: any[]) => Promise<Data>),
  initialState?: Data,
) => {
  return useAsyncState(promise, initialState, { immediate: false });
};
