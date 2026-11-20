import { getProjects } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectStack } from "@/components/projects/project-stack";
import { ButtonLink } from "@/components/ui/button";

export async function WorkSection() {
  const projects = await getProjects();
  return (
    <section id="work" aria-labelledby="work-title" className="section-y relative bg-bg-2">
      <div className="container-x">
        <SectionHeading
          id="work-title"
          index="02"
          eyebrow="Case studies"
          title={["Real systems,", { text: "running today.", hl: true }]}
          description="Platforms we've designed and built for real businesses — WhatsApp CRM, event workforce management, e-commerce, ERP and CRM."
        />
        <ProjectStack projects={projects} />
        <div className="mt-14 flex justify-center">
          <ButtonLink href="/work" variant="ghost" size="lg">
            View all projects
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
