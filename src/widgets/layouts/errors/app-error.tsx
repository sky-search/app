import { getErrorMessage } from "@/shared/lib/error"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardFooter } from "@/shared/ui/card"
import type { ErrorComponentProps } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

export function AppErrorWidget({ error, reset }: ErrorComponentProps) {
  const errorMessage = getErrorMessage(error)

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md border-destructive/20">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertTriangle className="size-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Something went wrong</h2>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-3 justify-center pb-6">
          <Button variant="outline" onClick={reset} className="gap-2">
            <RefreshCw className="size-4" />
            Try again
          </Button>
          <Button
            render={<Link to="/" />}
            className="gap-2"
          >
            <Home className="size-4" />
            Go home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
