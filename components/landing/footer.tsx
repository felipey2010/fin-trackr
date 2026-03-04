import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Image
                src="/logo.svg"
                alt="logo"
                height={16}
                width={16}
                className="h-4 w-4 text-primary-foreground"
              />
            </div>
            <span className="text-lg font-bold text-foreground">FinTrackr</span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="/login"
              className="transition-colors hover:text-foreground"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="transition-colors hover:text-foreground"
            >
              Sign Up
            </Link>
          </div>
        </div>
        <div className="w-full flex items-center justify-between gap-4 flex-wrap mt-8 border-t border-border pt-8">
          <span className="text-sm text-muted-foreground">
            {`\u00A9 ${new Date().getFullYear()} FinTrackr. All rights reserved.`}
          </span>
          <p className="text-muted-foreground text-sm">
            Developed with ❤️ by{" "}
            <Link href="https://github.com/felipey2010/">Felipey</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
