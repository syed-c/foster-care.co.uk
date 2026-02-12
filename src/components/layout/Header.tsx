"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ShieldCheck, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRoles";

const navLinks = [
  { href: "/agencies", label: "Find Agencies" },
  { href: "/locations/england", label: "Locations" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const { user, isAuthenticated, signOut } = useAuth();
  const { isAdmin } = useUserRoles();

  const displayName = useMemo(() => {
    const metaName = (user?.user_metadata as any)?.full_name as string | undefined;
    const fromMeta = (metaName || "").trim();
    if (fromMeta) return fromMeta;

    const fromEmail = (user?.email || "").split("@")[0]?.trim();
    return fromEmail || "Account";
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="container-main">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" aria-label="Foster Care UK home">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-soft">
              <span className="text-primary-foreground font-bold text-lg">FC</span>
            </div>
            <span className="font-semibold text-xl text-foreground hidden sm:block">
              Foster Care UK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 ${pathname === link.href
                  ? "text-primary"
                  : "text-foreground-muted hover:text-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="secondary" size="icon" className="rounded-full" aria-label="Call us">
              <Phone className="w-5 h-5" />
            </Button>

            {!isAuthenticated ? (
              <Link href="/auth">
                <Button variant="hero" size="default">
                  Sign in
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="rounded-full">
                    <UserRound className="w-4 h-4" />
                    {displayName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-56">
                  <DropdownMenuLabel className="space-y-0.5">
                    <div className="font-medium">{displayName}</div>
                    {user?.email && (
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-accent transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-background border-b border-border"
          >
            <nav className="container-main py-6 flex flex-col gap-4" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium py-2 transition-colors ${pathname === link.href
                    ? "text-primary"
                    : "text-foreground-muted hover:text-foreground"
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-border space-y-3">
                {isAuthenticated && isAdmin && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      <ShieldCheck className="w-4 h-4" />
                      Admin
                    </Button>
                  </Link>
                )}

                {!isAuthenticated ? (
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="hero" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" className="w-full" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
