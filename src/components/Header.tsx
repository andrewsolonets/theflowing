/* eslint-disable @typescript-eslint/no-misused-promises */
import { useSession, signIn, signOut } from "next-auth/react";

export const Header = () => {
  const { data: sessionData } = useSession();
  return (
    <header className="drop-shadow-header fixed  top-0 left-0 right-0 z-20 flex items-center justify-between gap-10 bg-violet-800 py-4 px-4 font-medium text-slate-50 backdrop-blur  md:justify-between md:px-10">
      <h5>The Flowing</h5>
      <button
        className="outline-amber  w-max rounded-sm bg-transparent px-3 py-1 text-amber-400 outline outline-2 transition-all duration-300 hover:bg-amber-400/20 hover:bg-opacity-10 md:px-4"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </header>
  );
};
