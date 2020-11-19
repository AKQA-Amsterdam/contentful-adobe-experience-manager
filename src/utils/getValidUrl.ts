const getValidUrl = (url: string): string => {
  const prefix = 'http://';
  if (url.substr(0, prefix.length) !== prefix) {
    return `${prefix}${url}`;
  }

  return url;
};

export default getValidUrl;
