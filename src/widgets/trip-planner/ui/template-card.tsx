import { Card, CardContent } from "@/shared/ui/card"
import type { TripTemplate } from "../lib/templates"

interface TemplateCardProps {
  template: TripTemplate
  onClick: (prompt: string) => void
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <Card
      className="cursor-pointer p-0 transition-all hover:ring-2 hover:ring-primary/50 hover:shadow-md"
      onClick={() => onClick(template.prompt)}
    >
      <div className="relative h-32 w-full overflow-hidden rounded-t-xl">
        <img
          src={template.coverImage}
          alt={template.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-semibold text-white">{template.title}</h3>
        </div>
      </div>
    </Card>
  )
}

interface TemplateGridProps {
  templates: TripTemplate[]
  onTemplateSelect: (prompt: string) => void
}

export function TemplateGrid({ templates, onTemplateSelect }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onClick={onTemplateSelect}
        />
      ))}
    </div>
  )
}
