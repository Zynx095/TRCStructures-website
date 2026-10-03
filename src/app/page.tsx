import type { Metadata } from "next";
import { BuildSequence } from "@/components/home/BuildSequence";
import { CompanySection } from "@/components/home/CompanySection";
import { ContactBand } from "@/components/home/ContactBand";
import { GroundStatement } from "@/components/home/GroundStatement";
import { Hero } from "@/components/home/Hero";
import { ProjectGallery } from "@/components/home/ProjectGallery";
import { ServicesExplorer } from "@/components/home/ServicesExplorer";
import { WaterSection } from "@/components/home/WaterSection";
import { seo } from "@/config/seo";
import { home } from "@/content/pages/home";
import {
  CLIENT_UPDATE_LABEL,
  formatLocation,
  getCurrentWorks,
  getFeaturedProjects,
  getProject,
  getProjectStats,
  getProjects,
  getProjectsForService,
  projectRef,
  projectRefs,
} from "@/content/projects";
import { getServices } from "@/content/services";

export const metadata: Metadata = {
  title: { absolute: seo.titleDefault },
  description: home.description,
  alternates: { canonical: "/" },
  openGraph: { title: seo.titleDefault, description: home.description, url: "/" },
};

export default function HomePage() {
  const stats = getProjectStats();
  const all = getProjects();

  const stages = home.sequence.stages.map((s) => ({ ...s, projects: projectRefs(s.projectSlugs) }));

  const services = getServices().map((s) => ({
    ...s,
    projects: getProjectsForService(s.slug).map(projectRef),
  }));

  const tankSites = getCurrentWorks()
    .filter((p) => p.category === "water-infrastructure")
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      place: formatLocation(p) ?? p.title,
      project: { status: p.status, statusSource: p.statusSource, scope: p.scope },
    }));

  const stp = getProject(home.water.related.projectSlug);

  return (
    <>
      <Hero />
      <GroundStatement
        facts={{ total: stats.total, current: stats.current, states: stats.states, updateLabel: CLIENT_UPDATE_LABEL }}
      />
      <BuildSequence title={home.sequence.title} intro={home.sequence.intro} stages={stages} />
      <ServicesExplorer title={home.services.title} intro={home.services.intro} services={services} />
      <WaterSection
        title={home.water.title}
        qualifier={home.water.qualifier}
        text={home.water.text}
        steps={home.water.steps}
        sites={tankSites}
        updateLabel={CLIENT_UPDATE_LABEL}
        related={
          stp
            ? { slug: stp.slug, title: stp.title, role: stp.role, capacity: stp.capacity, images: stp.images, project: stp }
            : null
        }
        cta={home.water.cta}
      />
      <ProjectGallery
        title={home.gallery.title}
        intro={home.gallery.intro}
        cta={home.gallery.cta}
        projects={getFeaturedProjects()}
        totals={{ total: stats.total, withPhotos: all.filter((p) => p.images.length > 0).length }}
      />
      <CompanySection states={stats.states} />
      <ContactBand title={home.cta.title} text={home.cta.text} primary={home.cta.primary} />
    </>
  );
}
