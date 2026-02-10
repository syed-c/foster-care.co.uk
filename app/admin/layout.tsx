import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin pages render their own layout (AdminLayout component with sidebar)
  // We hide Header/Footer by wrapping in a div that's styled to cover the viewport
  return (
    <div className="admin-layout-wrapper" style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--background)' }}>
      {children}
    </div>
  );
}
