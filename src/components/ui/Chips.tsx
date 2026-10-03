import { scopeDescriptions, scopeLabels, statusLabels } from "@/content/projects";
import type { Project, ProjectScope, ProjectStatus, StatusSource } from "@/content/types";
import { cn } from "@/lib/cn";

const chip = "lettering inline-flex h-7 shrink-0 items-center gap-2 whitespace-nowrap px-2.5 leading-none";

function StatusMark({ status }: { status: ProjectStatus }) {
  // shape differs by status so meaning never relies on colour alone
  if (status === "completed") return <span aria-hidden className="size-2.5 bg-current" />;
  if (status === "upcoming") return <span aria-hidden className="size-2.5 border border-current" />;
  return (
    <span aria-hidden className="relative size-2.5 overflow-hidden border border-amber">
      <span className="absolute inset-y-0 left-0 w-1/2 bg-amber" />
    </span>
  );
}

export function StatusChip({
  status,
  source,
  className,
}: {
  status: ProjectStatus;
  source?: StatusSource;
  className?: string;
}) {
  const tentative = source === "portfolio" && status !== "completed";
  return (
    <span
      className={cn(chip, "border", tentative ? "border-dashed" : "border-solid", "border-current/40", className)}
      title={tentative ? "Status as recorded in the company portfolio — awaiting update" : undefined}
    >
      <StatusMark status={status} />
      {statusLabels[status]}
      {tentative && <span className="sr-only"> (status as recorded in the company portfolio)</span>}
    </span>
  );
}

export function ScopeChip({ scope, className }: { scope: ProjectScope; className?: string }) {
  return (
    <span className={cn(chip, "bg-current/[0.07]", className)} title={scopeDescriptions[scope]}>
      <span className="sr-only">Scope: </span>
      {scopeLabels[scope]}
    </span>
  );
}

export function ProjectChips({ project, className }: { project: Project; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <StatusChip status={project.status} source={project.statusSource} />
      <ScopeChip scope={project.scope} />
    </div>
  );
}
