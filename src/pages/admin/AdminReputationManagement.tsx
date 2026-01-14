import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  MessageSquare, 
  Search, 
  ThumbsUp,
  ThumbsDown,
  Minus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Star,
  TrendingUp,
  TrendingDown,
  Send,
  MoreHorizontal,
  Building2,
  Mail
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminReputationManagement() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedResponse, setSelectedResponse] = useState<any>(null);

  // Fetch feedback requests
  const { data: feedbackRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ["admin-feedback-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback_requests")
        .select("*, agencies(name, slug)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch feedback responses
  const { data: feedbackResponses, isLoading: responsesLoading } = useQuery({
    queryKey: ["admin-feedback-responses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback_responses")
        .select("*, agencies(name, slug), feedback_requests(recipient_name, recipient_email)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch resolution threads
  const { data: resolutionThreads, isLoading: threadsLoading } = useQuery({
    queryKey: ["admin-resolution-threads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resolution_threads")
        .select("*, agencies(name, slug), feedback_responses(overall_rating, positive_feedback, improvement_feedback)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Update response status mutation
  const updateResponseMutation = useMutation({
    mutationFn: async ({ id, status, routed_to }: { id: string; status: string; routed_to?: string }) => {
      const updates: any = { status, reviewed_at: new Date().toISOString() };
      if (routed_to) updates.routed_to = routed_to;
      const { error } = await supabase
        .from("feedback_responses")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedback-responses"] });
      toast.success("Response updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Stats
  const totalRequests = feedbackRequests?.length || 0;
  const pendingResponses = feedbackResponses?.filter(r => r.status === "new").length || 0;
  const positiveCount = feedbackResponses?.filter(r => r.sentiment === "positive").length || 0;
  const negativeCount = feedbackResponses?.filter(r => r.sentiment === "negative").length || 0;
  const openThreads = resolutionThreads?.filter(t => t.status === "open" || t.status === "in_progress").length || 0;

  // Filter responses
  const filteredResponses = feedbackResponses?.filter((response) => {
    const agency = response.agencies as any;
    const matchesSearch = agency?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || response.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <ThumbsUp className="w-4 h-4 text-verified" />;
      case "negative": return <ThumbsDown className="w-4 h-4 text-destructive" />;
      default: return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <Badge className="bg-verified/10 text-verified border-0">Positive</Badge>;
      case "negative": return <Badge className="bg-destructive/10 text-destructive border-0">Negative</Badge>;
      default: return <Badge variant="secondary">Neutral</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new": return <Badge className="bg-primary/10 text-primary border-0">New</Badge>;
      case "reviewed": return <Badge className="bg-muted text-muted-foreground border-0">Reviewed</Badge>;
      case "approved_public": return <Badge className="bg-verified/10 text-verified border-0">Published</Badge>;
      case "resolved_private": return <Badge className="bg-warm/10 text-warm border-0">Resolved</Badge>;
      case "archived": return <Badge variant="secondary">Archived</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getThreadStatusBadge = (status: string) => {
    switch (status) {
      case "open": return <Badge className="bg-primary/10 text-primary border-0"><Clock className="w-3 h-3 mr-1" />Open</Badge>;
      case "in_progress": return <Badge className="bg-warm/10 text-warm border-0"><AlertTriangle className="w-3 h-3 mr-1" />In Progress</Badge>;
      case "resolved": return <Badge className="bg-verified/10 text-verified border-0"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
      case "escalated": return <Badge className="bg-destructive/10 text-destructive border-0"><AlertTriangle className="w-3 h-3 mr-1" />Escalated</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Reputation Management" description="Monitor and manage agency feedback and reputation">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Requests"
            value={totalRequests}
            icon={Send}
          />
          <StatCard
            title="Pending Review"
            value={pendingResponses}
            icon={Clock}
            variant="primary"
          />
          <StatCard
            title="Positive Feedback"
            value={positiveCount}
            icon={ThumbsUp}
            variant="verified"
          />
          <StatCard
            title="Negative Feedback"
            value={negativeCount}
            icon={ThumbsDown}
            variant="warm"
          />
          <StatCard
            title="Open Resolutions"
            value={openThreads}
            icon={AlertTriangle}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="requests" className="rounded-lg">Feedback Requests</TabsTrigger>
            <TabsTrigger value="responses" className="rounded-lg">Responses</TabsTrigger>
            <TabsTrigger value="resolutions" className="rounded-lg">Resolution Threads</TabsTrigger>
            <TabsTrigger value="kpis" className="rounded-lg">KPI Dashboard</TabsTrigger>
          </TabsList>

          {/* Feedback Requests Tab */}
          <TabsContent value="requests" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Feedback Requests
                </CardTitle>
                <CardDescription>Track all feedback collection requests</CardDescription>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="rounded-xl border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Agency</TableHead>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Sent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {feedbackRequests?.slice(0, 20).map((request: any) => (
                          <TableRow key={request.id} className="hover:bg-muted/30">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{request.agencies?.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{request.recipient_name}</p>
                                <p className="text-xs text-muted-foreground">{request.recipient_email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{request.request_type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  request.status === "completed" ? "bg-verified/10 text-verified border-0" :
                                  request.status === "pending" ? "bg-primary/10 text-primary border-0" :
                                  "bg-muted text-muted-foreground border-0"
                                }
                              >
                                {request.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {request.sent_at 
                                ? format(new Date(request.sent_at), "MMM d, yyyy")
                                : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!feedbackRequests || feedbackRequests.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                              No feedback requests yet
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Responses Tab */}
          <TabsContent value="responses" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Feedback Responses
                    </CardTitle>
                    <CardDescription>Review and route feedback</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by agency..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 rounded-xl"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] rounded-xl">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="reviewed">Reviewed</SelectItem>
                      <SelectItem value="approved_public">Published</SelectItem>
                      <SelectItem value="resolved_private">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {responsesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredResponses?.map((response: any) => (
                      <div
                        key={response.id}
                        className="p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                              <span className="text-xl font-bold">{response.overall_rating}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">{response.agencies?.name}</span>
                              {getSentimentBadge(response.sentiment)}
                              {getStatusBadge(response.status)}
                            </div>
                            {response.positive_feedback && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                <ThumbsUp className="w-3 h-3 inline mr-1" />
                                {response.positive_feedback}
                              </p>
                            )}
                            {response.improvement_feedback && (
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                <ThumbsDown className="w-3 h-3 inline mr-1" />
                                {response.improvement_feedback}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {format(new Date(response.created_at), "MMM d, yyyy 'at' h:mm a")}
                              {response.respondent_name && ` · ${response.respondent_name}`}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card">
                              <DropdownMenuItem onClick={() => setSelectedResponse(response)}>
                                <Eye className="w-4 h-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              {response.sentiment === "positive" && response.status === "new" && (
                                <DropdownMenuItem 
                                  onClick={() => updateResponseMutation.mutate({ 
                                    id: response.id, 
                                    status: "approved_public",
                                    routed_to: "public_review"
                                  })}
                                  className="text-verified"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" /> Publish as Review
                                </DropdownMenuItem>
                              )}
                              {response.sentiment === "negative" && response.status === "new" && (
                                <DropdownMenuItem 
                                  onClick={() => updateResponseMutation.mutate({ 
                                    id: response.id, 
                                    status: "reviewed",
                                    routed_to: "private_resolution"
                                  })}
                                  className="text-warm"
                                >
                                  <AlertTriangle className="w-4 h-4 mr-2" /> Route to Resolution
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                    {(!filteredResponses || filteredResponses.length === 0) && (
                      <div className="text-center py-12 text-muted-foreground">
                        No feedback responses yet
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resolution Threads Tab */}
          <TabsContent value="resolutions" className="mt-6">
            <Card className="rounded-2xl border-border shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Resolution Threads
                </CardTitle>
                <CardDescription>Track private feedback resolution</CardDescription>
              </CardHeader>
              <CardContent>
                {threadsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resolutionThreads?.map((thread: any) => (
                      <div
                        key={thread.id}
                        className="p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-muted">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold">{thread.agencies?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Rating: {thread.feedback_responses?.overall_rating}/5
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {getThreadStatusBadge(thread.status)}
                            <Badge 
                              className={
                                thread.priority === "urgent" ? "bg-destructive/10 text-destructive border-0" :
                                thread.priority === "high" ? "bg-warm/10 text-warm border-0" :
                                "bg-muted text-muted-foreground border-0"
                              }
                            >
                              {thread.priority}
                            </Badge>
                            <Button variant="outline" size="sm" className="rounded-lg">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!resolutionThreads || resolutionThreads.length === 0) && (
                      <div className="text-center py-12 text-muted-foreground">
                        No resolution threads
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* KPI Dashboard Tab */}
          <TabsContent value="kpis" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="rounded-2xl border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Sentiment Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-verified/5">
                      <div className="flex items-center gap-3">
                        <ThumbsUp className="w-5 h-5 text-verified" />
                        <span>Positive</span>
                      </div>
                      <span className="font-bold text-verified">{positiveCount}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Minus className="w-5 h-5 text-muted-foreground" />
                        <span>Neutral</span>
                      </div>
                      <span className="font-bold">
                        {(feedbackResponses?.filter(r => r.sentiment === "neutral").length) || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-destructive/5">
                      <div className="flex items-center gap-3">
                        <ThumbsDown className="w-5 h-5 text-destructive" />
                        <span>Negative</span>
                      </div>
                      <span className="font-bold text-destructive">{negativeCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Response Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {totalRequests > 0 
                        ? Math.round((feedbackResponses?.length || 0) / totalRequests * 100) 
                        : 0}%
                    </div>
                    <p className="text-muted-foreground">
                      {feedbackResponses?.length || 0} responses from {totalRequests} requests
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Response Details Dialog */}
        <Dialog open={!!selectedResponse} onOpenChange={(open) => !open && setSelectedResponse(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
            </DialogHeader>
            {selectedResponse && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl font-bold">{selectedResponse.overall_rating}</span>
                  </div>
                  <div>
                    <p className="font-bold">{selectedResponse.agencies?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getSentimentBadge(selectedResponse.sentiment)}
                      {getStatusBadge(selectedResponse.status)}
                    </div>
                  </div>
                </div>

                {selectedResponse.positive_feedback && (
                  <div className="p-3 rounded-xl border border-verified/20 bg-verified/5">
                    <p className="text-sm font-medium text-verified mb-1">What went well</p>
                    <p className="text-sm">{selectedResponse.positive_feedback}</p>
                  </div>
                )}

                {selectedResponse.improvement_feedback && (
                  <div className="p-3 rounded-xl border border-warm/20 bg-warm/5">
                    <p className="text-sm font-medium text-warm mb-1">Areas for improvement</p>
                    <p className="text-sm">{selectedResponse.improvement_feedback}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  {selectedResponse.communication_rating && (
                    <div className="p-3 rounded-xl border text-center">
                      <p className="text-xs text-muted-foreground">Communication</p>
                      <p className="text-lg font-bold">{selectedResponse.communication_rating}/5</p>
                    </div>
                  )}
                  {selectedResponse.support_rating && (
                    <div className="p-3 rounded-xl border text-center">
                      <p className="text-xs text-muted-foreground">Support</p>
                      <p className="text-lg font-bold">{selectedResponse.support_rating}/5</p>
                    </div>
                  )}
                  {selectedResponse.professionalism_rating && (
                    <div className="p-3 rounded-xl border text-center">
                      <p className="text-xs text-muted-foreground">Professionalism</p>
                      <p className="text-lg font-bold">{selectedResponse.professionalism_rating}/5</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => setSelectedResponse(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}