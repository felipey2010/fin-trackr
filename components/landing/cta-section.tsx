import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center md:px-16 md:py-24">
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/5" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-foreground/5" />
          </div>

          <div className="relative z-10">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/80">
              Join thousands of people who have already transformed their
              financial habits with FinTrackr. Free to start, no credit card
              required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 px-8"
                asChild
              >
                <Link href="/register">
                  Get Started for Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="gap-2 px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/login">Already have an account?</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
