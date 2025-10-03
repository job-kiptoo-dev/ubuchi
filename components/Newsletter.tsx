import { Mail } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Newsletter() {
  return (
    <section className="w-full bg-accent py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Stay in the loop
          </h2>

          <p className="mb-8 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Get the latest updates, articles, and resources delivered straight to your inbox. Join our community of
            curious minds.
          </p>

          <form className="mx-auto max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email"

                  className="h-12 bg-background text-base transition-all focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Email address"
                />
              </div>

              <Button
                type="submit"
                // disabled={state === "loading" || !email}
                className="h-12 bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                Subscribe
              </Button>
            </div>

          </form>

          <p className="mt-6 text-sm text-muted-foreground">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>

  )
}
