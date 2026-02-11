"use client";

import { createContext, useContext, ReactNode } from "react";
import { Database } from "@/integrations/supabase/types";

type Agency = Database['public']['Tables']['agencies']['Row'];

interface WorkspaceContextType {
    agency: Agency;
    workspace: any;
    user: any;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export function WorkspaceProvider({
    children,
    value
}: {
    children: ReactNode;
    value: WorkspaceContextType
}) {
    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (!context) {
        throw new Error("useWorkspace must be used within a WorkspaceProvider");
    }
    return context;
}

// Helper to provide a replacement for useOutletContext during migration
export function useOutletContext<T = WorkspaceContextType>() {
    return useWorkspace() as T;
}
