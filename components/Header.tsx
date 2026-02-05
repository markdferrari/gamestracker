import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="WhenCanIPlayIt logo"
            width={32}
            height={32}
            priority
          />
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            WhenCanIPlayIt
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
