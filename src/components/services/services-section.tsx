import { getServices } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServicesExplorer } from "@/components/services/services-explorer";

const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

export async function ServicesSection() {
  const services = await getServices();
  const count = words[services.length] ?? String(services.length);
  return (
    <section id="services" aria-labelledby="services-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="services-title"
          index="01"
          eyebrow="Services"
          title={[`${count} ways we take work`, { text: "off your hands.", hl: true }]}
          description="Pick the block that hurts most today. We design it, build it and connect it to everything else you run."
        />
        <ServicesExplorer services={services} />
      </div>
    </section>
  );
}
