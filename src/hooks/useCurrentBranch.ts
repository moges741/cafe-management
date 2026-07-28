import { useState, useEffect, useMemo } from 'react';
import { useAppSelector } from '@/app/hooks';
import { useGetBranchesQuery } from '@/features/branches/branchesApi';

export function useCurrentBranch() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: branches, isLoading, isSuccess } = useGetBranchesQuery();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(
    localStorage.getItem('selectedBranchId')
  );

  // The branch the staff member is assigned to (null for customers/admins)
  const staffBranchId = user?.employee?.branchId ?? user?.branchId ?? null;

  useEffect(() => {
    // If no branch is selected yet, or the selected one isn't in the list, default appropriately.
    if (isSuccess && branches && branches.length > 0) {
      if (!selectedBranchId) {
        // Staff defaults to their own branch; others default to first active branch
        const defaultBranch = staffBranchId
          ? branches.find(b => b.id === staffBranchId)
          : branches.find(b => b.isActive) || branches[0];
        if (defaultBranch) {
          setSelectedBranchId(defaultBranch.id);
          localStorage.setItem('selectedBranchId', defaultBranch.id);
        }
      } else {
        const isValid = branches.some(b => b.id === selectedBranchId && b.isActive);
        if (!isValid) {
          const fallback = staffBranchId
            ? branches.find(b => b.id === staffBranchId)
            : branches.find(b => b.isActive) || branches[0];
          if (fallback) {
            setSelectedBranchId(fallback.id);
            localStorage.setItem('selectedBranchId', fallback.id);
          }
        }
      }
    }
  }, [user, branches, isSuccess, selectedBranchId, staffBranchId]);

  const setBranch = (branchId: string) => {
    setSelectedBranchId(branchId);
    localStorage.setItem('selectedBranchId', branchId);
  };

  // True if the user is currently viewing their own assigned branch
  // Always true for customers/admins (they don't have a fixed branch)
  const isOwnBranch = useMemo(() => {
    if (!staffBranchId) return true; // No fixed branch (customer, admin)
    return selectedBranchId === staffBranchId;
  }, [staffBranchId, selectedBranchId]);

  return {
    branchId: selectedBranchId,
    staffBranchId,
    isOwnBranch,
    setBranch,
    isLoading,
    branches,
  };
}
