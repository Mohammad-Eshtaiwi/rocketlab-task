import { useState } from 'react';
import type { Status } from '@/types/statuses';

export type FilterType = 'all' | Status;

export const useTaskFilters = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const getFilteredStatus = (): Status | undefined => {
    return activeFilter === 'all' ? undefined : activeFilter;
  };

  const filterOptions: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return {
    activeFilter,
    setActiveFilter,
    getFilteredStatus,
    filterOptions
  };
};