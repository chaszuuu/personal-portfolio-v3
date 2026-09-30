import Image from "next/image";
import type { ProjectEntry } from "@/lib/types";

// Shared icon tile for the featured deck and the projects grid.
// Shows the project's logo when it has one, otherwise the first letter
// on the gradient, exactly like before.
export default function ProjectIcon({
  project,
  className,
}: {
  project: Pick<ProjectEntry, "title" | "gradient" | "logo">;
  className: string;
}) {
  return (
    <div className={className} style={{ background: project.gradient }}>
      {project.logo ? (
        <Image
          src={project.logo}
          alt=""
          width={96}
          height={96}
          className="project-icon-img"
        />
      ) : (
        project.title.charAt(0)
      )}
    </div>
  );
}