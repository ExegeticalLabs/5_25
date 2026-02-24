'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MobileLayoutProps {
  children: ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen min-h-[100dvh] w-full max-w-lg mx-auto bg-dawn-background flex flex-col"
    >
      <main className="flex-1 flex flex-col w-full px-4 pb-safe-bottom">
        {children}
      </main>
    </motion.div>
  )
}
