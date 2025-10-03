import { footerSections } from "@/lib/Links/footerLink";
import { Leaf } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo + Intro */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-emerald-600" aria-hidden="true" />
              <span className="text-2xl font-serif text-neutral-900">Úbūchi</span>
            </div>
            <p className="text-neutral-600 font-light mb-4">
              Tea cultivated to restore. Rooted in African traditions, powered
              by women farmers.
            </p>
          </div>

          {/* Footer Sections */}
          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-serif mb-4 text-neutral-900">{title}</h3>
              <ul className="space-y-2 text-neutral-600 font-light">
                {links.map(({ href, label, external }) => (
                  <li key={href}>
                    {external ? (
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-neutral-900 transition-colors"
                      >
                        {label}
                      </Link>
                    ) : (
                      <Link
                        href={href}
                        className="hover:text-neutral-900 transition-colors"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-200 mt-12 pt-8 text-center text-neutral-600 font-light">
          <p>
            &copy; {new Date().getFullYear()} Úbūchi. All rights reserved. Made
            with Ubuntu and Chi.
          </p>
        </div>
      </div>
    </footer>
  )
}
