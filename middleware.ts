import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/login" ||
    path === "/signup" ||
    path === "/signup/customer" ||
    path === "/signup/business" ||
    path.startsWith("/hair-styles") ||
    path.startsWith("/nails") ||
    path.startsWith("/face-and-body") ||
    path.startsWith("/discounts") ||
    path.startsWith("/api/signup");

  // Token will exist if user is logged in
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Check if path requires business account
  const requiresBusiness =
    path.startsWith("/dashboard/business") ||
    path.startsWith("/signup/business/setup");

  // Check if path requires customer account
  const requiresCustomer =
    path.startsWith("/dashboard/customer") || path.startsWith("/appointment");

  // Redirect authentication logic
  if (isPublicPath) {
    // If user is on a public path but already authenticated and trying to access login/signup
    if (isAuthenticated && (path === "/login" || path.startsWith("/signup"))) {
      if (token.userType === "business") {
        return NextResponse.redirect(
          new URL("/dashboard/business", request.url)
        );
      } else {
        return NextResponse.redirect(
          new URL("/dashboard/customer", request.url)
        );
      }
    }
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated but trying to access a route that requires a different account type
  if (requiresBusiness && token.userType !== "business") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (requiresCustomer && token.userType !== "customer") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Match all request paths except for static files, api routes that don't need auth
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - Public files (e.g. files in public folder)
     * - Font files
     * - Images
     * - API routes that don't require auth
     */
    "/((?!api/signup|api/auth|api/salons|api/reviews|_next/static|_next/image|favicon.ico|images|fonts|uploads).*)",
  ],
};
