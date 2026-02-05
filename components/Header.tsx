import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { ViewToggle } from "./ViewToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="WhenCanIPlayIt logo"
            width={36}
            height={36}
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            WhenCanIPlayIt
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <Suspense fallback={<div className="h-10 w-40" />}>
            <ViewToggle />
          </Suspense>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
