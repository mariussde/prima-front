"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useTablePreferences } from '@/hooks/use-table-preferences';

interface TablePreferencesContextType {
  preferences: {
    columnOrder: string[];
    columnVisibility: Record<string, boolean>;
  };
  updateColumnOrder: (newOrder: string[]) => void;
  updateColumnVisibility: (columnKey: string, isVisible: boolean) => void;
  resetPreferences: () => void;
}

// Create context with a default empty implementation
const TablePreferencesContext = createContext<TablePreferencesContextType>({
  preferences: {
    columnOrder: [],
    columnVisibility: {}
  },
  updateColumnOrder: () => {},
  updateColumnVisibility: () => {},
  resetPreferences: () => {},
});

interface TablePreferencesProviderProps {
  children: ReactNode;
  tableId: string;
  defaultColumns: string[];
  defaultVisibility: Record<string, boolean>;
}

export function TablePreferencesProvider({
  children,
  tableId,
  defaultColumns,
  defaultVisibility,
}: TablePreferencesProviderProps) {
  const preferences = useTablePreferences(tableId, defaultColumns, defaultVisibility);

  return (
    <TablePreferencesContext.Provider value={preferences}>
      {children}
    </TablePreferencesContext.Provider>
  );
}

export function useTablePreferencesContext() {
  return useContext(TablePreferencesContext);
} 