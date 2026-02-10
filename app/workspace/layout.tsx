"use client";
import AgencyWorkspace from "@/_pages/agency/AgencyWorkspace";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AgencyWorkspace>{children}</AgencyWorkspace>;
}
