import { useState, useEffect } from 'react';
import { useAppSelector } from '@/app/hooks';
import { useGetBranchesQuery } from '@/features/branches/branchesApi';

export function useCurrentBranch() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: branches, isLoading, isSuccess } = useGetBranchesQuery();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(
    localStorage.getItem('selectedBranchId')
  );

  useEffect(() => {
    // If the user has a designated branch (Staff), they must use it.
    if (user?.branchId) {
      if (selectedBranchId !== user.branchId) {
        setSelectedBranchId(user.branchId);
        localStorage.setItem('selectedBranchId', user.branchId);
      }
      return;
    }

    // If no branch is selected yet, or the selected one isn't in the list, default to the first active branch.
    if (isSuccess && branches && branches.length > 0) {
      const isValid = branches.some(b => b.id === selectedBranchId && b.isActive);
      if (!selectedBranchId || !isValid) {
        const defaultBranch = branches.find(b => b.isActive) || branches[0];
        setSelectedBranchId(defaultBranch.id);
        localStorage.setItem('selectedBranchId', defaultBranch.id);
      }
    }
  }, [user, branches, isSuccess, selectedBranchId]);

  const setBranch = (branchId: string) => {
    // Staff cannot change their branch
    if (user?.branchId) return;
    
    setSelectedBranchId(branchId);
    localStorage.setItem('selectedBranchId', branchId);
  };

  return {
    branchId: selectedBranchId,
    setBranch,
    isLoading,
    branches,
  };
}
