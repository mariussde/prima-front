"use client";

import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TablePreferencesProvider, useTablePreferencesContext } from '@/lib/table-preferences-context';

interface TableWrapperProps {
  children: ReactNode;
  tableId: string;
  defaultColumns: string[];
  defaultVisibility: Record<string, boolean>;
  title: string;
  onAddNew?: () => void;
  isLoading?: boolean;
}

export function TableWrapper({
  children,
  tableId,
  defaultColumns,
  defaultVisibility,
  title,
  onAddNew,
  isLoading = false,
}: TableWrapperProps) {
  return (
    <TablePreferencesProvider
      tableId={tableId}
      defaultColumns={defaultColumns}
      defaultVisibility={defaultVisibility}
    >
      <div className="h-full flex flex-col">
        <main className="flex-1 p-4 md:p-8 w-full">
          <Card className="w-full h-full">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <CardTitle>{title}</CardTitle>
              <TableControls onAddNew={onAddNew} />
            </CardHeader>
            <CardContent className="px-2 sm:px-6 h-[calc(100vh-280px)]">
              <div className="w-full h-full relative">
                {children}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </TablePreferencesProvider>
  );
}

interface TableControlsProps {
  onAddNew?: () => void;
}

function TableControls({ onAddNew }: TableControlsProps) {
  const { preferences, updateColumnVisibility, resetPreferences } = useTablePreferencesContext();

  return (
    <div className="flex flex-col min-[320px]:flex-row items-start min-[320px]:items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="default" className="w-full min-[320px]:w-[120px]">Columns</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
          {preferences.columnOrder.map((column) => (
            <DropdownMenuCheckboxItem
              key={column}
              className="capitalize"
              checked={preferences.columnVisibility[column]}
              onCheckedChange={(value) => updateColumnVisibility(column, value)}
            >
              {column}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuCheckboxItem
            className="text-primary"
            onCheckedChange={() => resetPreferences()}
          >
            Reset to Default
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {onAddNew && (
        <Button onClick={onAddNew} className="w-full min-[320px]:w-[120px]">
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      )}
    </div>
  );
} 