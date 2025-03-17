import { HeroSection } from "./sections/hero-section"
import { FeaturesSection } from "./sections/features-section"
import { TextBlockSection } from "./sections/text-block-section"
import { ContactFormSection } from "./sections/contact-form-section"

interface Section {
  id: string
  type: string
  title: string | null
  content: any
}

interface SectionRendererProps {
  sections: Section[]
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        switch (section.type) {
          case "hero":
            return <HeroSection key={section.id} content={section.content} />
          case "features":
            return <FeaturesSection key={section.id} content={section.content} />
          case "text_block":
            return <TextBlockSection key={section.id} content={section.content} />
          case "contact_form":
            return <ContactFormSection key={section.id} content={section.content} />
          default:
            return null
        }
      })}
    </>
  )
}

