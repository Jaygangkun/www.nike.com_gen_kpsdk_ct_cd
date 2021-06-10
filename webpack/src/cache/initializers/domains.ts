const getDomain = (): string => {
    const { hostname } = location;
    const maxLength = 2;
  
    if (hostname.split('.').length === maxLength) {
      return `.${hostname}`;
    }
  
    if (hostname.split('.').length > maxLength) {
      return `.${hostname
        .split('.')
        .slice(hostname.split('.').length - maxLength)
        .join('.')}`;
    }
  
    return hostname;
  };
  
  export { getDomain };
  