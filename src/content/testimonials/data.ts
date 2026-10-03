import type { Testimonial } from "../types";

/**
 * TESTIMONIALS — none collected yet. Add only real quotes with written permission:
 * { quote: "...", name: "...", role: "...", organisation: "...", projectSlug: "...", approved: true, visible: true }
 */
export const testimonials: Testimonial[] = [];

export function getPublishedTestimonials(): Testimonial[] {
  return testimonials.filter((t) => t.approved && t.visible);
}
