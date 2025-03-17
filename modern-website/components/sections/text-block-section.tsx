"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface TextBlockSectionProps {
  content: {
    title: string
    content: string
    image_url?: string
  }
}

export function TextBlockSection({ content }: TextBlockSectionProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{content.title}</h2>
            <div className="mt-4 text-muted-foreground" dangerouslySetInnerHTML={{ __html: content.content }} />
          </motion.div>
          {content.image_url && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-video md:aspect-square overflow-hidden rounded-lg"
            >
              <Image src={content.image_url || "/placeholder.svg"} alt={content.title} fill className="object-cover" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

