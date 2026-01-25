import { getErrorMessage } from "@/shared/lib/error"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardFooter } from "@/shared/ui/card"
import type { ErrorComponentProps } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { AlertOctagon, Home, RefreshCw } from "lucide-react"

export function GlobalErrorLayout({ error, reset }: ErrorComponentProps) {
  const errorMessage = getErrorMessage(error)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-lg border-destructive/20 shadow-lg">
        <CardContent className="pt-8 pb-4">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="rounded-full bg-destructive/10 p-5">
              <AlertOctagon className="size-10 text-destructive" />
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                An unexpected error occurred. Please try again or return to the
                home page.
              </p>
            </div>
            <div className="w-full p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground font-mono break-all">
                {errorMessage}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3 justify-center pb-8">
          <Button variant="outline" onClick={reset} className="gap-2">
            <RefreshCw className="size-4" />
            Try again
          </Button>
          <Button
            render={<Link to="/" />}
            className="gap-2"
          >
            <Home className="size-4" />
            Back to home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
