"use client";
import Link from "next/link";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  directory: [
    { href: "/agencies", label: "Find Agencies" },
    { href: "/locations/england", label: "Browse by Location" },
    { href: "/specialisms", label: "Specialisms" },
    { href: "/compare", label: "Compare Agencies" },
  ],
  resources: [
    { href: "/guides", label: "Fostering Guides" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
  forAgencies: [
    { href: "/claim", label: "Claim Your Agency" },
    { href: "/how-listings-work", label: "How Listings Work" },
    { href: "/register-agency", label: "Register Agency" },
  ],
  legal: [
    { href: "/editorial-policy", label: "Editorial Policy" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container-main">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-background/10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">FC</span>
              </div>
              <span className="font-semibold text-xl">Foster Care UK</span>
            </Link>
            <p className="text-secondary-foreground/70 mb-6 max-w-sm leading-relaxed">
              Connecting families with trusted foster care agencies across the United Kingdom.
              Every child deserves a loving home.
            </p>
            <div className="flex flex-col gap-3 text-sm text-secondary-foreground/60">
              <a href="mailto:hello@fostercare.uk" className="flex items-center gap-2 hover:text-secondary-foreground transition-colors">
                <Mail className="w-4 h-4" />
                hello@fostercare.uk
              </a>
              <a href="tel:+441onal234567890" className="flex items-center gap-2 hover:text-secondary-foreground transition-colors">
                <Phone className="w-4 h-4" />
                0800 123 4567
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                United Kingdom
              </span>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary-foreground">Directory</h4>
            <ul className="space-y-3">
              {footerLinks.directory.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/60 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-secondary-foreground">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-secondary-foreground">For Agencies</h4>
            <ul className="space-y-3">
              {footerLinks.forAgencies.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-foreground/50 text-sm">
            © {new Date().getFullYear()} Foster Care UK. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-secondary-foreground/50 hover:text-secondary-foreground transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-secondary-foreground/50 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> in the UK
          </p>
        </div>
      </div>
    </footer>
  );
}
