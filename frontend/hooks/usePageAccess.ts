// hooks/usePageAccess.ts
"use client";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { UserRole } from "@/types/types";
import { checkPageAccess, getUserAllowedPages } from "@/components/permissions";
import { useUser } from "@/context/UserContext";

export function usePageAccess() {
  const { user, loading, isSessionReady } = useUser();
  const pathname = usePathname();

  const result = useMemo(() => {
    if (!isSessionReady || loading) {
      return {
        hasAccess: false,
        userRoles: [] as UserRole[], // تایپ explicit اضافه کردیم
        allowedPages: [],
        currentPath: pathname,
        isLoading: true,
        shouldWait: true,
        userRole: null as UserRole | null,
      };
    }

    if (!user?.role) {
      return {
        hasAccess: false,
        userRoles: [] as UserRole[], // تایپ explicit اضافه کردیم
        allowedPages: [],
        currentPath: pathname,
        isLoading: false,
        shouldWait: false,
        userRole: null as UserRole | null,
      };
    }

    const userRoles: UserRole[] = [user.role as UserRole]; // تایپ explicit
    const hasAccess = checkPageAccess(pathname, userRoles);
    const allowedPages = getUserAllowedPages(userRoles);

    return {
      hasAccess,
      userRoles,
      allowedPages,
      currentPath: pathname,
      isLoading: false,
      shouldWait: false,
      userRole: user.role as UserRole,
    };
  }, [user, loading, isSessionReady, pathname]);

  return result;
}
