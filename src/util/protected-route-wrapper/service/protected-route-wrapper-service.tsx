export const validateUserToken = (token: string): boolean => {
  // TODO: Better validation - regex or call to agartex-service to verify it
  return token && token != 'null' && token != 'undefined';
};
