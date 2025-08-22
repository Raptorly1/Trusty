interface Testimonial {
  id: string;
  name: string;
  quote: string;
  course?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "mary-miami",
    name: "Mary, 74 — Miami, FL",
    quote: "I used to avoid online shopping because I was afraid of scams. Trusty gave me the confidence to order my granddaughter’s birthday gift online safely!"
  },
  {
    id: "evelyn-dallas",
    name: "Evelyn, 69 — Dallas, TX",
    quote: "My church group recommended Trusty. Now, we all use it together and help each other out."
  },
  {
    id: "robert-los-angeles",
    name: "Robert, 76 — Los Angeles, CA",
    quote: "I almost fell for a fake email about Social Security. Thanks to Trusty, I spotted it just in time!"
  },
  {
    id: "gloria-buffalo",
    name: "Gloria, 72 — Buffalo, NY",
    quote: "I used to avoid online shopping. With Trusty’s tips, I just bought my first safe purchase on my own!"
  },
  {
    id: "frank-detroit",
    name: "Frank, 78 — Detroit, MI",
    quote: "I used to call my son every time I didn’t understand a website. Now, I go to Trusty first. He’s very thankful too!"
  },
  {
    id: "shirley-phoenix",
    name: "Shirley, 86 — Phoenix, AZ",
    quote: "I love that it’s free. It feels like it was made just for seniors like me."
  },
  {
    id: "george-chicago",
    name: "George, 84 — Chicago, IL",
    quote: "I got tricked once before. With Trusty, I finally feel like I have the upper hand online."
  },
  {
    id: "patricia-denver",
    name: "Patricia, 71 — Denver, CO",
    quote: "Finally, something that explains technology step by step. Trusty feels like a patient teacher."
  },
  {
    id: "harold-atlanta",
    name: "Harold, 77 — Atlanta, GA",
    quote: "I was scared of online banking, but Trusty walked me through how to stay safe. Now I pay bills without worry."
  },
  {
    id: "linda-seattle",
    name: "Linda, 73 — Seattle, WA",
    quote: "I like the printable cheat sheets. They help me remember what to do!"
  },
  {
    id: "earl-pittsburgh",
    name: "Earl, 79 — Pittsburgh, PA",
    quote: "This is the first program that didn’t feel too fast for me. Trusty goes at my pace."
  },
  {
    id: "martha-charlotte",
    name: "Martha, 75 — Charlotte, NC",
    quote: "My friends and I talk about Trusty all the time. We swap tips and laugh about what we’ve learned."
  },
  {
    id: "richard-portland",
    name: "Richard, 82 — Portland, OR",
    quote: "Technology used to intimidate me. Now, I feel like I can handle myself online."
  },
  {
    id: "joan-boston",
    name: "Joan, 68 — Boston, MA",
    quote: "The internet isn’t so scary anymore. Trusty helps me feel safe and supported every day."
  }
];

// Split testimonials into two groups for counter-rotating carousels
// Split testimonials evenly between the two carousels so all entries are used
const midIndex = Math.ceil(testimonials.length / 2);
export const topCarouselTestimonials = testimonials.slice(0, midIndex);
export const bottomCarouselTestimonials = testimonials.slice(midIndex);
