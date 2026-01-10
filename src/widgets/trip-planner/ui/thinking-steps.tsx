import { TextShimmerLoader } from "@/shared/ui/loader"
import { Steps, StepsContent, StepsItem, StepsTrigger } from "@/shared/ui/steps"

interface ThinkingStepsProps {
  steps: string[]
}

export function ThinkingSteps({ steps }: ThinkingStepsProps) {
  if (!steps || steps.length === 0) return null

  return (
    <Steps defaultOpen>
      <StepsTrigger>
        <TextShimmerLoader text="Thinking..." size="md" />
      </StepsTrigger>
      <StepsContent>
        {steps.map((step) => (
          <StepsItem key={step}>{step}</StepsItem>
        ))}
      </StepsContent>
    </Steps>
  )
}
