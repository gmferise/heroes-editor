import { useState, useEffect } from 'react';

const useSmartContext = (dependencies) => {
  const [value, setValue] = useState({ ...dependencies });
  Object.entries(dependencies).forEach(([depName, depValue]) => {
    useEffect(() => {
      setValue((prev) => ({
        ...prev,
        [depName]: depValue,
      }));
    }, [depValue]);
  });
  return value;
};

export default useSmartContext;
