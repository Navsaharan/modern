"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type LucideIcon, Zap, Shield, Smartphone } from "lucide-react"
import { motion } from "framer-motion"

interface Feature {
  icon: string
  title: string
  description: string
}

interface FeaturesSectionProps {
  content: {
    title: string
    features: Feature[]
  }
}

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  Zap,
  Shield,
  Smartphone,
}

export function FeaturesSection({ content }: FeaturesSectionProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{content.title}</h2>
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {content.features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Zap

              return (
                <motion.div key={index} variants={item}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

