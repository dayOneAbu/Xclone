import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function SidebarNav() {
  const { data: sessionData } = useSession();
  return (
    <div className="py-4 px-2 ">
      <ul className="flex flex-col items-start justify-between gap-4">
        <li>
          <Link href={'/'}>Home</Link>
        </li>
        {sessionData && <li>
          <Link href={`/profile/${sessionData?.user.id}`}>Profile</Link>
        </li>}
        {sessionData && <li>
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-white/20"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </li>}
      </ul>
    </div>
  )
}