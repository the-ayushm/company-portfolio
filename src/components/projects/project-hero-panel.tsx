"use client";

import { useMemo } from "react";
import { BlocksPanel } from "@/components/three/blocks-panel";
import { ProjectBlocks } from "@/components/projects/project-visual";
import { PanelStatus } from "@/components/ui/note-pill";
import { projectBlocks } from "@/config/blocks";

/** Full-width pine panel where the project's modules assemble into the core (WebGL, CSS-3D poster). */
export function ProjectHeroPanel({ visual, title }: { visual: string; title: string }) {
  const blocks = useMemo(() => projectBlocks(visual), [visual]);
  return (
    <>
      <BlocksPanel
        blocks={blocks}
        interactive={false}
        className="aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[16/8]"
        poster={<ProjectBlocks visual={visual} />}
      >
        {({ modules }) => (
          <PanelStatus label={`${title} · system view`} value={`${modules} blocks connected`} className="absolute left-6 top-5 sm:left-8 sm:top-7" />
        )}
      </BlocksPanel>
      <p className="sr-only">
        Illustration: {blocks.filter((b) => !b.core).map((b) => b.title).join(", ")} snap into one automated core.
      </p>
    </>
  );
}
