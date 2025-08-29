// components/permissions.ts
import { PageAccess, UserRole } from "@/types/types";

export const PAGE_PERMISSIONS: PageAccess[] = [
  // Admin routes
  {
    path: "/dashboard/admin/adminlist",
    allowedRoles: ["ADMIN"],
  },
  {
    path: "/dashboard/admin",
    allowedRoles: ["ADMIN"],
  },

  // Staff routes
  {
    path: "/dashboard/staff",
    allowedRoles: ["ADMIN", "STAFF"],
  },
  {
    path: "/dashboard/staff/reports",
    allowedRoles: ["ADMIN", "STAFF"],
  },

  // Orders routes
  {
    path: "/dashboard/orders",
    allowedRoles: ["ADMIN", "STAFF", "CUSTOMER"],
  },
  {
    path: "/dashboard/orders/new",
    allowedRoles: ["ADMIN", "CUSTOMER"],
  },
  {
    path: "/dashboard/orders/[id]",
    allowedRoles: ["ADMIN", "STAFF", "CUSTOMER"],
  },

  // Profile routes
  {
    path: "/dashboard/profile",
    allowedRoles: ["ADMIN", "STAFF", "CUSTOMER"],
  },

  // Dashboard main
  {
    path: "/dashboard",
    allowedRoles: ["ADMIN", "STAFF", "CUSTOMER"],
  },
];

export function checkPageAccess(
  pathname: string,
  userRoles: UserRole[]
): boolean {
  if (userRoles.includes("ADMIN")) {
    return true;
  }

  const pagePermission = PAGE_PERMISSIONS.find((permission) => {
    if (permission.path === pathname) return true;

    if (permission.path.includes("[") && permission.path.includes("]")) {
      const pathPattern = permission.path.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${pathPattern}$`);
      return regex.test(pathname);
    }

    return false;
  });

  if (!pagePermission) {
    return false;
  }

  return pagePermission.allowedRoles.some((role) => userRoles.includes(role));
}

export function getUserAllowedPages(userRoles: UserRole[]): string[] {
  return PAGE_PERMISSIONS.filter((permission) =>
    permission.allowedRoles.some((role) => userRoles.includes(role))
  ).map((p) => p.path);
}

export function hasRoleAccess(
  userRole: UserRole,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.includes(userRole);
}
