const validateDomainName = (str: string): boolean => {
  return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/.test(
    str
  );
};

export default validateDomainName;
