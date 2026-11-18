import { getServices } from "@/lib/data/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServicesExplorer } from "@/components/services/services-explorer";

export async function ServicesSection() {
  const services = await getServices();
  return (
    <section id="services" aria-labelledby="services-title" className="section-y relative bg-bg-2/40">
      <div className="container-x">
        <SectionHeading
          id="services-title"
          index="02"
          eyebrow="Services"
          title={["Technology Solutions", { text: "Built Around", serif: true }, "Your Business."]}
          description="Eight disciplines, one team. We combine product thinking with solid engineering to deliver software that fits the way your business actually works."
        />
        <ServicesExplorer services={services} />
      </div>
    </section>
  );
}
