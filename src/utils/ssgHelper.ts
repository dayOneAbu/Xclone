import { createServerSideHelpers } from "@trpc/react-query/server";
import SuperJSON from "superjson";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

export function ssgHelper() {
  return createServerSideHelpers({
    ctx: createInnerTRPCContext({ session: null, revalidateSSG: null }),
    router: appRouter,
    transformer: SuperJSON,
  });
}
