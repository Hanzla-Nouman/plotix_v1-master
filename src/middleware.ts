import { auth } from "@/auth";

const protectedRoutes = [
  "/account",
  "/bookings",
  "/purchases",
  "/coaches/payment-management",
  "/coaches/onboarding",
  "/dashboard",
  "/conference",
];

const authRoutes = ["/auth/", "/sign-in", "/sign-up", "/verify-email"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // if user is not logged in and tries to access a protected route, redirect to login
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // if user is logged in and tries to access an auth route, redirect to home
  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL("/", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
