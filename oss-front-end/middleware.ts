import { auth } from "@/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|om|am)/:path*"],
};
