import { ContentPage } from "@/components/content-page";

export const metadata = {
  title: "Our story | Shopit",
  description: "Meet Shopit: a considered edit of things made for everyday living.",
};

export default function AboutPage() {
  return <ContentPage
    eyebrow="A LITTLE ABOUT US"
    title="Good things"
    accent="matter."
    intro="Shopit is a small, considered edit of things we think deserve a place in your everyday."
    image="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=85"
    imageAlt="A calm, light-filled home with thoughtful furnishings"
    sections={[
      { title: "Less noise. Better things.", paragraphs: ["We started Shopit with a simple idea: shopping should feel a little more considered. Not more stuff—just useful, well-made things that feel right at home.", "Our collection brings together everyday objects, accessories, and clothing chosen for their quality, usefulness, and lasting appeal."] },
      { title: "Made for real life.", paragraphs: ["A good piece earns its place over time. We look for thoughtful design, honest materials, and details that make the everyday feel a little better.", "We’re still growing, and this is our beginning. Every collection is a chance to find new favorites and share them with you."] },
      { title: "Come on in.", paragraphs: ["Browse at your own pace, find a collection that feels like you, and reach out if we can help with anything.", "Thanks for being here."] },
    ]}
  />;
}
