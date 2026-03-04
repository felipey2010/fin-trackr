import { howItWorksSteps } from "./landing-data"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-secondary/40 px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Up and Running in Three Simple Steps
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {howItWorksSteps.map((item, index) => (
            <div
              key={item.step}
              className="relative flex flex-col items-center text-center"
            >
              {index < howItWorksSteps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-border md:block" />
              )}

              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-card">
                <item.icon className="h-8 w-8 text-primary" />
              </div>

              <span className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">
                Step {item.step}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
