import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/api/uploadthing", "/", "/signin", "signup"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  if (isPublicRoute(req)) return;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|json)).*)",
    "/api/(.*)",
    "/trpc/(.*)",
  ],
};
