import { useState, useEffect } from 'react'

interface TablePreferences {
  columnOrder: string[]
  columnVisibility: Record<string, boolean>
}

export function useTablePreferences(tableId: string, defaultColumns: string[], defaultVisibility: Record<string, boolean>) {
  const storageKey = `table-preferences-${tableId}`;
  
  // Initialize state with a function that executes once
  const [preferences, setPreferences] = useState<TablePreferences>(() => {
    // Only run in browser, not during SSR
    if (typeof window !== 'undefined') {
      try {
        // Try to get stored preferences
        const storedPrefs = localStorage.getItem(storageKey);
        
        if (storedPrefs) {
          const parsed = JSON.parse(storedPrefs);
          
          // Ensure we have all needed columns in the order array
          // First make sure actions is at the beginning if it exists
          let orderedColumns = [...defaultColumns];
          const actionsIndex = orderedColumns.indexOf('actions');
          
          if (actionsIndex > 0) {
            // Remove 'actions' from its current position and add it to the beginning
            orderedColumns.splice(actionsIndex, 1);
            orderedColumns = ['actions', ...orderedColumns];
          }
          
          // Merge the stored and default column orders
          const mergedColumnOrder = parsed.columnOrder || orderedColumns;
          
          // Ensure we have all default columns in our order array
          const allColumns = Array.from(
            new Set([...mergedColumnOrder, ...orderedColumns])
          );
          
          // Create final merged preferences
          const mergedPreferences: TablePreferences = {
            columnOrder: allColumns,
            columnVisibility: {
              ...defaultVisibility,  // Start with defaults
              ...(parsed.columnVisibility || {})  // Override with saved values
            }
          };
          
          return mergedPreferences;
        }
      } catch (e) {
        console.error('Failed to parse stored table preferences:', e);
      }
      
      // If no valid stored preferences, create default preferences with actions first
      let orderedColumns = [...defaultColumns];
      const actionsIndex = orderedColumns.indexOf('actions');
      
      if (actionsIndex > 0) {
        // Remove 'actions' from its current position and add it to the beginning
        orderedColumns.splice(actionsIndex, 1);
        orderedColumns = ['actions', ...orderedColumns];
      }
      
      return {
        columnOrder: orderedColumns,
        columnVisibility: defaultVisibility
      };
    }
    
    // Default for SSR
    return {
      columnOrder: defaultColumns,
      columnVisibility: defaultVisibility
    };
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Force immediate save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(preferences));
    }
  }, [preferences, storageKey]);

  const updateColumnOrder = (newOrder: string[]) => {
    setPreferences(prev => ({
      ...prev,
      columnOrder: newOrder
    }));
  };

  const updateColumnVisibility = (columnKey: string, isVisible: boolean) => {
    setPreferences(prev => ({
      ...prev,
      columnVisibility: {
        ...prev.columnVisibility,
        [columnKey]: isVisible
      }
    }));
  };

  const resetPreferences = () => {
    // When resetting, make sure 'actions' is first if it exists
    let orderedColumns = [...defaultColumns];
    const actionsIndex = orderedColumns.indexOf('actions');
    
    if (actionsIndex > 0) {
      // Remove 'actions' from its current position
      orderedColumns.splice(actionsIndex, 1);
      // Add it to the beginning
      orderedColumns = ['actions', ...orderedColumns];
    }
    
    const newPreferences = {
      columnOrder: orderedColumns,
      columnVisibility: defaultVisibility
    };
    
    setPreferences(newPreferences);
  };

  return {
    preferences,
    updateColumnOrder,
    updateColumnVisibility,
    resetPreferences
  };
} 