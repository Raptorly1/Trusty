interface Testimonial {
  id: string;
  name: string;
  quote: string;
  course?: string;
}

export const testimonials: Testimonial[] = [
  ...[
    {
  id: "clara-santa-ana",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    },
    {
  id: "robert-phoenix",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    },
    {
  id: "margaret-dallas",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    },
    {
  id: "james-seattle",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    },
    {
  id: "helen-miami",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    },
    {
  id: "frank-denver",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    },
    {
  id: "dorothy-atlanta",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    },
    {
  id: "william-boston",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    },
    {
  id: "mary-chicago",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    },
    {
  id: "thomas-portland",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    },
    {
  id: "patricia-nashville",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    },
    {
  id: "charles-san-diego",
  name: "Placeholder Name",
  quote: "This is a placeholder testimonial text.",
  course: "Trusty Digital Safety Course"
    }
  ]
];

// Split testimonials into two groups for counter-rotating carousels
export const topCarouselTestimonials = testimonials.slice(0, 6);
export const bottomCarouselTestimonials = testimonials.slice(6, 12);
