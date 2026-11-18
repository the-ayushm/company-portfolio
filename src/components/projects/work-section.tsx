import { getProjects } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectStack } from "@/components/projects/project-stack";
import { ButtonLink } from "@/components/ui/button";

export async function WorkSection() {
  const projects = await getProjects();
  return (
    <section id="work" aria-labelledby="work-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="work-title"
          index="02"
          eyebrow="Selected work"
          title={["Real Systems,", { text: "Delivered", serif: true }, "for Real Businesses."]}
          description="A selection of platforms we have designed and engineered — from WhatsApp automation and workforce management to e-commerce, ERP and CRM."
        />
        <ProjectStack projects={projects} />
        <div className="mt-16 flex justify-center">
          <ButtonLink href="/work" variant="ghost" size="lg">
            View all projects
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
