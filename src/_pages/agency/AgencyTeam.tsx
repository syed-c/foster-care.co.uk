"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users, 
  Plus, 
  Mail,
  Shield,
  MoreHorizontal,
  Trash2,
  Crown,
  UserCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContextType {
  agency: any;
  workspace: any;
  user: any;
}

const roleLabels: Record<string, { label: string; color: string }> = {
  owner: { label: "Owner", color: "bg-warm/15 text-warm border-warm/25" },
  admin: { label: "Admin", color: "bg-primary/15 text-primary border-primary/25" },
  manager: { label: "Manager", color: "bg-verified/15 text-verified border-verified/25" },
  staff: { label: "Staff", color: "bg-muted text-muted-foreground border-border" },
};

export default function AgencyTeam() {
  const { workspace, user, agency } = useOutletContext<ContextType>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [inviteData, setInviteData] = useState({
    email: "",
    role: "staff",
  });

  // Fetch team members
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["agency-team", workspace?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agency_team_members")
        .select(`
          *,
          profiles:user_id (
            email,
            full_name,
            avatar_url
          )
        `)
        .eq("workspace_id", workspace?.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!workspace?.id,
  });

  // Current user is owner
  const isOwner = agency?.user_id === user?.id;

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from("agency_team_members")
        .delete()
        .eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency-team"] });
      toast({ title: "Team member removed" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-muted-foreground">Manage your agency team members and roles</p>
        </div>
        {isOwner && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your agency workspace
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteData.email}
                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={inviteData.role} onValueChange={(v) => setInviteData({ ...inviteData, role: v })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin - Full access</SelectItem>
                      <SelectItem value="manager">Manager - Leads & tasks</SelectItem>
                      <SelectItem value="staff">Staff - Limited access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-sm">
                  <p className="font-medium mb-2">Role Permissions:</p>
                  <ul className="text-muted-foreground space-y-1 text-xs">
                    <li><strong>Admin:</strong> Profile, leads, tasks, team, reports, billing</li>
                    <li><strong>Manager:</strong> Leads, tasks, limited reports</li>
                    <li><strong>Staff:</strong> View leads, manage assigned tasks</li>
                  </ul>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-full">
                    Cancel
                  </Button>
                  <Button 
                    className="rounded-full"
                    onClick={() => {
                      toast({ 
                        title: "Invitation feature coming soon", 
                        description: "Team invitations will be available in the next update" 
                      });
                      setIsDialogOpen(false);
                    }}
                  >
                    Send Invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Owner Card */}
      <Card className="rounded-2xl shadow-soft border-warm/20 bg-warm/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-warm" />
            <CardTitle className="text-base">Agency Owner</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={undefined} />
              <AvatarFallback className="bg-warm/20 text-warm font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{user?.email}</p>
              <p className="text-sm text-muted-foreground">Full access to all workspace features</p>
            </div>
            <Badge className={roleLabels.owner.color + " rounded-full"}>
              <Crown className="w-3 h-3 mr-1" />
              {roleLabels.owner.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card className="rounded-2xl shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            {teamMembers?.length || 0} members in your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="space-y-3">
              {teamMembers.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-accent/50 transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.profiles?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {member.profiles?.email?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {member.profiles?.full_name || member.profiles?.email}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {member.profiles?.email}
                    </p>
                  </div>
                  <Badge className={roleLabels[member.role]?.color + " rounded-full"}>
                    {roleLabels[member.role]?.label}
                  </Badge>
                  {isOwner && member.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if (confirm("Remove this team member?")) {
                          removeMemberMutation.mutate(member.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="font-semibold mb-1">No team members yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Invite colleagues to help manage leads and tasks
              </p>
              {isOwner && (
                <Button className="rounded-full" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Info */}
      <Card className="rounded-2xl shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(roleLabels).map(([role, { label, color }]) => (
              <div key={role} className="p-4 rounded-xl border border-border">
                <Badge className={color + " rounded-full mb-3"}>
                  {label}
                </Badge>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {role === "owner" && (
                    <>
                      <li>✓ Full access</li>
                      <li>✓ Billing & plans</li>
                      <li>✓ Team management</li>
                    </>
                  )}
                  {role === "admin" && (
                    <>
                      <li>✓ Profile editing</li>
                      <li>✓ Leads & tasks</li>
                      <li>✓ Team management</li>
                    </>
                  )}
                  {role === "manager" && (
                    <>
                      <li>✓ Leads management</li>
                      <li>✓ Tasks management</li>
                      <li>✓ View reports</li>
                    </>
                  )}
                  {role === "staff" && (
                    <>
                      <li>✓ View leads</li>
                      <li>✓ Assigned tasks</li>
                      <li>○ Limited access</li>
                    </>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
