import { redirect } from "next/navigation";
import { getClaims } from "./get-user";

/**
 * Use in Server Components / Server Actions / Route Handlers that require an
 * authenticated user. Redirects to /login if not signed in, otherwise
 * returns the validated claims.
 *
 * proxy.ts has already filtered out unauthed traffic for most routes, but
 * defense-in-depth: never trust the proxy as a security boundary. Per
 * Next.js docs explicitly.
 */
export async function requireAuth() {
  const claims = await getClaims();
  if (!claims) {
    redirect("/login" as never);
  }
  return claims as NonNullable<typeof claims>;
}
