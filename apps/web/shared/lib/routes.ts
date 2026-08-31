export const ROUTES = {
  home: "/",
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    forgotPassword: "/auth/forgot-password"
  },
  dashboard: "/dashboard",
  settings: "/dashboard/settings"
} as const;
