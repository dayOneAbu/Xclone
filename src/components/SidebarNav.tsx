import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { VscAccount, VscHome, VscSignIn, VscSignOut } from "react-icons/vsc";
import { IconHoverEffect } from "./Button";

export default function SidebarNav() {
  const { data: sessionData } = useSession();
  return (
    <div className="px-2 py-4 ">
      <ul className="flex flex-col items-start justify-between gap-4">
        <li>
          <Link href={'/'}>
            <IconHoverEffect>
              <span className="flex items-center gap-4">
                <VscHome className="w-8 h-8" />
                <span className="hidden sm:inline">Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        {sessionData && <li>
          <Link href={`/profile/${sessionData?.user.id}`}>
            <IconHoverEffect>
              <span className="flex items-center gap-4">
                <VscAccount className="w-8 h-8" />
                <span className="hidden sm:inline">Profile</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>}
        <li>
          <button
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ?
              <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignOut className="w-8 h-8 fill-green-950" />
                  <span className="hidden sm:inline">Sign Out</span>
                </span>
              </IconHoverEffect>

              : <IconHoverEffect>
                <span className="flex items-center gap-4">
                  <VscSignIn className="w-8 h-8" />
                  <span className="hidden sm:inline">Sign In</span>
                </span>
              </IconHoverEffect>}
          </button>
        </li>
      </ul>
    </div>
  )
}