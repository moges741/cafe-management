import { useState, useEffect, useMemo } from 'react';
import { useAppSelector } from '@/app/hooks';
import { useGetBranchesQuery, type Branch } from '@/features/branches/branchesApi';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const CACHED_BRANCHES_KEY = 'mr_cafe_cached_branches';

function getSavedBranches(): Branch[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CACHED_BRANCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useCurrentBranch() {
  const user = useAppSelector((state) => state.auth.user);
  const { isOnline } = useNetworkStatus();
  const { data: serverBranches, isLoading, refetch } = useGetBranchesQuery(undefined, {
    refetchOnReconnect: true,
  });

  // Save fresh server branches or fallback to cached snapshot when offline
  const branches: Branch[] = useMemo(() => {
    if (serverBranches && serverBranches.length > 0) {
      try {
        localStorage.setItem(CACHED_BRANCHES_KEY, JSON.stringify(serverBranches));
      } catch {}
      return serverBranches;
    }
    return getSavedBranches();
  }, [serverBranches]);

  // Refetch when returning online
  useEffect(() => {
    if (isOnline) {
      refetch();
    }
  }, [isOnline, refetch]);

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(
    localStorage.getItem('selectedBranchId')
  );

  // The branch the staff member is assigned to (null for customers/admins)
  const staffBranchId = user?.employee?.branchId ?? user?.branchId ?? null;

  useEffect(() => {
    // If no branch is selected yet, or the selected one isn't in the list/active, default appropriately.
    if (branches && branches.length > 0) {
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
  }, [user, branches, selectedBranchId, staffBranchId]);

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

  // True when a staff member is browsing a branch other than their own
  const isCustomerMode = !!staffBranchId && selectedBranchId !== staffBranchId;

  return {
    branchId: selectedBranchId,
    staffBranchId,
    isOwnBranch,
    isCustomerMode,
    setBranch,
    isLoading,
    branches,
  };
}
