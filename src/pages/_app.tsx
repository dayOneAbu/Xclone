import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";
import SidebarNav from "~/components/SidebarNav";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>T3 Twitter App</title>
        <meta name="description" content="Twitter clone exercise T3 stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container flex items-start mx-auto sm:pr-4">
        <SidebarNav />
        <div className="flex-grow max-w-5xl min-h-screen border-x">
          <Component {...pageProps} />
        </div>
      </div>

    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
