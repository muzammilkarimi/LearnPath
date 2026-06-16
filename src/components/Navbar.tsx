"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Zap, Menu, X } from "lucide-react"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/react", label: "React" },
  { href: "/roadmap", label: "Roadmaps" },
  { href: "/react/interview", label: "Interview Prep" },
]

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-hairline bg-canvas/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-8 flex items-center justify-between h-14">
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

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
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

        <div className="flex items-center gap-2">
          <Link
            href="/react/learn/beginner"
            className="hidden sm:flex text-sm font-semibold bg-primary text-on-primary px-4 py-2 rounded-md hover:bg-primary-soft transition-colors"
          >
            Start Learning
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 text-mute hover:text-ink transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded-md text-sm transition-colors",
                pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-body hover:text-ink hover:bg-canvas-soft"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/react/learn/beginner"
            onClick={() => setMenuOpen(false)}
            className="block mt-2 text-center text-sm font-semibold bg-primary text-on-primary px-4 py-2.5 rounded-md hover:bg-primary-soft transition-colors"
          >
            Start Learning
          </Link>
        </div>
      )}
    </nav>
  )
}
