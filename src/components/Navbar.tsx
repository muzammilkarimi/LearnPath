"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Zap } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/react", label: "React" },
  { href: "/react/interview", label: "Interview Prep" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-hairline bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-8 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 group">
          <Zap
            size={18}
            className="text-primary group-hover:drop-shadow-[0_0_6px_#00d992] transition-all"
            fill="currentColor"
          />
          <span className="text-ink-strong font-semibold text-sm tracking-tight">
            LearnPath
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                pathname === link.href
                  ? "text-primary"
                  : "text-body hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/react/learn/beginner"
          className="text-sm font-semibold bg-primary text-on-primary px-4 py-2 rounded-[6px] hover:bg-primary-soft transition-colors"
        >
          Start Learning
        </Link>
      </div>
    </nav>
  )
}
