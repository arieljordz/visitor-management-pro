// src/hooks/useSearch.ts
import { useState, useMemo } from "react";

export const useSearch = <T extends Record<string, any>>(
  data: T[],
  keys: (keyof T)[],
  initialTerm = ""
) => {
  const [searchTerm, setSearchTerm] = useState(initialTerm);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      keys.some((key) =>
        String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, keys]);

  return { searchTerm, setSearchTerm, filteredData };
};
