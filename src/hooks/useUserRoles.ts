"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type AppRole = "admin" | "moderator" | "agency" | "foster_parent" | "user";

export function useUserRoles() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["user-roles", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return [] as AppRole[];

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;
      return (data || []).map((r) => r.role as AppRole);
    },
  });

  const roles = query.data || ([] as AppRole[]);
  const isAdmin = useMemo(() => roles.includes("admin"), [roles]);

  return {
    ...query,
    roles,
    isAdmin,
  };
}
