"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SuperAdminSidebar } from "@/components/admin/SuperAdminSidebar";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Pencil,
  Loader2,
  Save,
  MapPin,
  Globe,
  LayoutGrid,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Copy,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface ContentBlock {
  id?: string;
  page_key: string;
  block_key: string;
  block_type: string;
  title: string | null;
  content: string | null;
  metadata: Record<string, unknown>;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: string;
  parent_id: string | null;
  parent?: Location | null;
}

const REGION_BLOCKS = [
  // Hero Section
  { key: "hero_badge", label: "Hero Badge", type: "text", placeholder: "e.g., Regional Fostering Hub" },
  { key: "hero_title", label: "Hero Title", type: "rich", placeholder: "Fostering in {location}" },
  { key: "hero_subtitle", label: "Hero Subtitle", type: "rich", placeholder: "Explore fostering agencies across {location}" },
  { key: "hero_cta", label: "Hero CTA Button", type: "text", placeholder: "Start Your Journey" },
  { key: "hero_secondary_cta", label: "Hero Secondary CTA", type: "text", placeholder: "View Local Agencies" },

  // Hero Stats
  { key: "stat_children_label", label: "Children in Care - Label", type: "text", placeholder: "Children in Care" },
  { key: "stat_local_areas_label", label: "Local Areas - Label", type: "text", placeholder: "Local Areas" },
  { key: "stat_agencies_label", label: "Agencies - Label", type: "text", placeholder: "Verified Agencies" },

  // Section 1: Why Fostering (Intro)
  { key: "intro_title", label: "Why Fostering Title", type: "rich", placeholder: "Why {location} Continues to Need More Foster Carers" },
  { key: "intro_paragraph_1", label: "Intro Paragraph 1", type: "rich", placeholder: "First paragraph about why fostering is needed" },
  { key: "intro_paragraph_2", label: "Intro Paragraph 2", type: "rich", placeholder: "Second paragraph about fostering focus" },
  { key: "intro_paragraph_3", label: "Intro Paragraph 3", type: "rich", placeholder: "Third paragraph about local children" },

  // Section 2: Fostering Agencies Overview
  { key: "agencies_overview_title", label: "Agencies Overview Title", type: "rich", placeholder: "Fostering Agencies Across {location}" },
  { key: "agencies_overview_intro", label: "Agencies Overview Intro", type: "rich", placeholder: "Introduction about agencies in the region" },
  { key: "agencies_list_1", label: "Agency Type 1", type: "text", placeholder: "Independent fostering agencies (IFAs)" },
  { key: "agencies_list_2", label: "Agency Type 2", type: "text", placeholder: "Local authority fostering teams" },
  { key: "agencies_list_3", label: "Agency Type 3", type: "text", placeholder: "Specialist therapeutic agencies" },
  { key: "agencies_list_4", label: "Agency Type 4", type: "text", placeholder: "Agencies offering parent-and-child placements" },
  { key: "agencies_comparison_title", label: "Agencies Comparison Title", type: "rich", placeholder: "Compare:" },
  { key: "agencies_comparison_1", label: "Comparison Item 1", type: "text", placeholder: "support levels" },
  { key: "agencies_comparison_2", label: "Comparison Item 2", type: "text", placeholder: "training quality" },
  { key: "agencies_comparison_3", label: "Comparison Item 3", type: "text", placeholder: "placement types" },
  { key: "agencies_comparison_4", label: "Comparison Item 4", type: "text", placeholder: "Ofsted ratings" },
  { key: "agencies_comparison_5", label: "Comparison Item 5", type: "text", placeholder: "matching processes" },
  { key: "agencies_comparison_6", label: "Comparison Item 6", type: "text", placeholder: "carer benefits and allowances" },
  { key: "agencies_overview_closing", label: "Agencies Overview Closing", type: "rich", placeholder: "Closing note about having clear comparisons" },

  // Section 3: How Foster Care Works
  { key: "how_it_works_title", label: "How Foster Care Works Title", type: "rich", placeholder: "How Foster Care Works in {location}" },
  { key: "how_it_works_intro", label: "How Foster Care Works Intro", type: "rich", placeholder: "Introduction about unique challenges" },
  { key: "how_it_works_paragraph", label: "How Foster Care Works Content", type: "rich", placeholder: "Paragraph about children traveling, appointments, etc." },
  { key: "carer_qualities_title", label: "Carer Qualities Title", type: "rich", placeholder: "Carers in {location} are valued for offering:" },
  { key: "carer_quality_1", label: "Carer Quality 1", type: "text", placeholder: "predictable routines" },
  { key: "carer_quality_2", label: "Carer Quality 2", type: "text", placeholder: "safe and calm home environments" },
  { key: "carer_quality_3", label: "Carer Quality 3", type: "text", placeholder: "good communication" },
  { key: "carer_quality_4", label: "Carer Quality 4", type: "text", placeholder: "patience during emotional transitions" },
  { key: "carer_quality_5", label: "Carer Quality 5", type: "text", placeholder: "flexibility for meetings, appointments, or school changes" },
  { key: "how_it_works_closing", label: "How It Works Closing", type: "rich", placeholder: "Closing note about consistent support" },

  // Section 4: Types of Foster Placements
  { key: "types_title", label: "Types of Placements Title", type: "rich", placeholder: "Different Types of Foster Placements Needed in {location}" },
  { key: "types_intro", label: "Types of Placements Intro", type: "rich", placeholder: "Introduction about placement types" },
  { key: "type_short_term_title", label: "Short-Term Title", type: "text", placeholder: "Short-Term Placements" },
  { key: "type_short_term_desc", label: "Short-Term Description", type: "text", placeholder: "Care provided during assessments or when decisions about long-term plans are being made." },
  { key: "type_long_term_title", label: "Long-Term Title", type: "text", placeholder: "Long-Term Fostering" },
  { key: "type_long_term_desc", label: "Long-Term Description", type: "text", placeholder: "Stable homes for children who need consistent care until adulthood." },
  { key: "type_emergency_title", label: "Emergency Title", type: "text", placeholder: "Emergency Placements" },
  { key: "type_emergency_desc", label: "Emergency Description", type: "text", placeholder: "Same-day placements for children in urgent situations." },
  { key: "type_respite_title", label: "Respite Title", type: "text", placeholder: "Respite Fostering" },
  { key: "type_respite_desc", label: "Respite Description", type: "text", placeholder: "Short stays that support families and carers." },
  { key: "type_therapeutic_title", label: "Therapeutic Title", type: "text", placeholder: "Therapeutic Fostering" },
  { key: "type_therapeutic_desc", label: "Therapeutic Description", type: "text", placeholder: "Enhanced support for children with emotional or behavioural needs." },
  { key: "type_parent_child_title", label: "Parent & Child Title", type: "text", placeholder: "Parent and Child Placements" },
  { key: "type_parent_child_desc", label: "Parent & Child Description", type: "text", placeholder: "A structured living arrangement helping parents develop confidence and essential skills." },
  { key: "types_closing", label: "Types Closing", type: "rich", placeholder: "Note about availability through IFAs and local authorities" },

  // Section 5: Independent vs Local Authority
  { key: "agency_types_title", label: "Agency Types Title", type: "rich", placeholder: "Independent or Local Authority Fostering: What Should You Choose?" },
  { key: "agency_types_intro", label: "Agency Types Intro", type: "rich", placeholder: "Carers in {location} choose between:" },
  { key: "ifa_title", label: "IFA Title", type: "rich", placeholder: "Independent Fostering Agencies (IFAs)" },
  { key: "ifa_content", label: "IFA Content", type: "rich", placeholder: "IFAs provide structured support, specialist training, and regular supervision." },
  { key: "ifa_bullet_01", label: "IFA Bullet 1", type: "text", placeholder: "They often offer 24/7 support lines" },
  { key: "ifa_bullet_02", label: "IFA Bullet 2", type: "text", placeholder: "Therapeutic guidance" },
  { key: "ifa_bullet_03", label: "IFA Bullet 3", type: "text", placeholder: "Higher allowances depending on placements" },
  { key: "la_title", label: "Local Authority Title", type: "rich", placeholder: "Local Authority Fostering" },
  { key: "la_content", label: "Local Authority Content", type: "rich", placeholder: "Each area runs its own fostering service." },
  { key: "la_bullet_01", label: "LA Bullet 1", type: "text", placeholder: "Focus on keeping placements local" },
  { key: "la_bullet_02", label: "LA Bullet 2", type: "text", placeholder: "Easier for children to stay connected to community" },
  { key: "la_bullet_03", label: "LA Bullet 3", type: "text", placeholder: "Connected to school and extended family" },
  { key: "agency_types_closing", label: "Agency Types Closing", type: "rich", placeholder: "Both options support children well" },

  // Section 6: How to Become a Foster Carer (Process)
  { key: "process_title", label: "Process Title", type: "rich", placeholder: "How to Become a Foster Carer in {location}" },
  { key: "process_intro", label: "Process Intro", type: "rich", placeholder: "If fostering feels right for you, the next step is understanding the process." },
  { key: "process_closing", label: "Process Closing", type: "rich", placeholder: "Most families complete approval within four to six months." },
  { key: "process_step_1_title", label: "Step 1 Title", type: "text", placeholder: "Initial Conversation" },
  { key: "process_step_1_desc", label: "Step 1 Description", type: "text", placeholder: "An agency explains requirements, expectations, and what the role involves." },
  { key: "process_step_2_title", label: "Step 2 Title", type: "text", placeholder: "Home Visit" },
  { key: "process_step_2_desc", label: "Step 2 Description", type: "text", placeholder: "A social worker meets with you to learn more about your home, lifestyle, and suitability." },
  { key: "process_step_3_title", label: "Step 3 Title", type: "text", placeholder: "Training and Assessment" },
  { key: "process_step_3_desc", label: "Step 3 Description", type: "text", placeholder: "Preparation training sessions help you understand fostering. A detailed assessment follows." },
  { key: "process_step_4_title", label: "Step 4 Title", type: "text", placeholder: "Approval Panel" },
  { key: "process_step_4_desc", label: "Step 4 Description", type: "text", placeholder: "Your assessment is reviewed by a fostering panel who make the final decision." },

  // Section 7: Ofsted Ratings
  { key: "ofsted_title", label: "Ofsted Title", type: "rich", placeholder: "Why Ofsted Ratings Matter in {location}" },
  { key: "ofsted_intro", label: "Ofsted Intro", type: "rich", placeholder: "Ofsted ratings provide important clarity in a city with many agencies." },
  { key: "ofsted_list_title", label: "Ofsted List Title", type: "rich", placeholder: "Our directory helps you compare:" },
  { key: "ofsted_item_1", label: "Ofsted Item 1", type: "text", placeholder: "safeguarding quality" },
  { key: "ofsted_item_2", label: "Ofsted Item 2", type: "text", placeholder: "leadership strength" },
  { key: "ofsted_item_3", label: "Ofsted Item 3", type: "text", placeholder: "carer support systems" },
  { key: "ofsted_item_4", label: "Ofsted Item 4", type: "text", placeholder: "training quality" },
  { key: "ofsted_item_5", label: "Ofsted Item 5", type: "text", placeholder: "outcomes for children" },
  { key: "ofsted_closing", label: "Ofsted Closing", type: "rich", placeholder: "These ratings allow you to make informed decisions" },

  // Section 8: Support for Foster Carers
  { key: "support_title", label: "Support Title", type: "rich", placeholder: "Support for Foster Carers in {location}" },
  { key: "support_intro", label: "Support Intro", type: "rich", placeholder: "Agencies offer strong, structured support to help carers meet children's needs." },
  { key: "support_allowances_title", label: "Support Allowances Title", type: "text", placeholder: "Carer Allowances" },
  { key: "support_allowances_desc", label: "Support Allowances Description", type: "text", placeholder: "Financial allowances help cover the cost of caring for a child, with additional support for specialist placements." },
  { key: "support_training_title", label: "Support Training Title", type: "text", placeholder: "Training and Development" },
  { key: "support_training_desc", label: "Support Training Description", type: "text", placeholder: "Regular in-person and online training courses help carers build confidence and skills." },
  { key: "support_professional_title", label: "Support Professional Title", type: "text", placeholder: "Professional Visits and 24/7 Support" },
  { key: "support_professional_desc", label: "Support Professional Description", type: "text", placeholder: "Supervising social workers maintain regular contact and offer round-the-clock guidance." },
  { key: "support_peer_title", label: "Support Peer Title", type: "text", placeholder: "Peer Support Groups" },
  { key: "support_peer_desc", label: "Support Peer Description", type: "text", placeholder: "Many agencies host carrier groups and community meetups across {location}." },
  { key: "support_closing", label: "Support Closing", type: "rich", placeholder: "Support is designed to be consistent, practical, and flexible." },

  // Section 9: Areas Covered
  { key: "areas_title", label: "Areas Covered Title", type: "rich", placeholder: "Areas Across {location} Covered by Our Directory" },
  { key: "areas_intro", label: "Areas Covered Intro", type: "rich", placeholder: "Our directory includes agencies that support carers across:" },
  { key: "areas_list_1", label: "Area 1", type: "text", placeholder: "Central {location}" },
  { key: "areas_list_2", label: "Area 2", type: "text", placeholder: "North {location}" },
  { key: "areas_list_3", label: "Area 3", type: "text", placeholder: "South {location}" },
  { key: "areas_list_4", label: "Area 4", type: "text", placeholder: "East {location}" },
  { key: "areas_list_5", label: "Area 5", type: "text", placeholder: "West {location}" },
  { key: "areas_list_6", label: "Area 6", type: "text", placeholder: "All boroughs" },
  { key: "areas_closing", label: "Areas Closing", type: "rich", placeholder: "You can explore agencies in your local area" },

  // Section 10: FAQ
  { key: "faq_title", label: "FAQ Title", type: "rich", placeholder: "{location} Fostering FAQs" },
  { key: "faq_intro", label: "FAQ Intro", type: "rich", placeholder: "Clear, honest answers for prospective carers." },
  { key: "faq_1_question", label: "FAQ 1 Question", type: "text", placeholder: "Is there a high need for foster carers in {location}?" },
  { key: "faq_1_answer", label: "FAQ 1 Answer", type: "text", placeholder: "Yes. Demand remains high across all areas due to population changes and varied social needs." },
  { key: "faq_2_question", label: "FAQ 2 Question", type: "text", placeholder: "Do foster carers get paid?" },
  { key: "faq_2_answer", label: "FAQ 2 Answer", type: "text", placeholder: "Yes. Allowances cover child-related expenses and vary by agency and placement type." },
  { key: "faq_3_question", label: "FAQ 3 Question", type: "text", placeholder: "Can I foster if I rent?" },
  { key: "faq_3_answer", label: "FAQ 3 Answer", type: "text", placeholder: "Yes. Renting is not a barrier if your home is stable and you have a suitable room." },
  { key: "faq_4_question", label: "FAQ 4 Question", type: "text", placeholder: "How long does approval take?" },
  { key: "faq_4_answer", label: "FAQ 4 Answer", type: "text", placeholder: "Most assessments take four to six months." },

  // Section 11: Our Commitment
  { key: "commitment_title", label: "Commitment Title", type: "rich", placeholder: "Our Commitment as a Directory" },
  { key: "commitment_1", label: "Commitment 1", type: "rich", placeholder: "We do not approve foster carers or manage placements." },
  { key: "commitment_2", label: "Commitment 2", type: "rich", placeholder: "We list agencies that follow Ofsted standards and UK safeguarding rules." },
  { key: "commitment_3", label: "Commitment 3", type: "rich", placeholder: "Our goal is to help families make informed decisions with clear, trustworthy information." },

  // Section 12: CTA
  { key: "cta_title", label: "CTA Title", type: "rich", placeholder: "Find Fostering Agencies in {location} Through Our Portal" },
  { key: "cta_subtitle", label: "CTA Subtitle", type: "rich", placeholder: "Use our portal to explore agencies, compare support packages, and start your journey with confidence." },
  { key: "cta_closing", label: "CTA Closing", type: "rich", placeholder: "Good decisions start with reliable information; and we're here to make that part easier." },
  { key: "cta_button", label: "CTA Button Text", type: "text", placeholder: "Start Your Journey" },

  // Featured Agencies
  { key: "featured_title", label: "Featured Agencies Title", type: "rich", placeholder: "Featured Agencies in {location}" },
  { key: "featured_subtitle", label: "Featured Agencies Subtitle", type: "rich", placeholder: "Top-rated agencies ready to support your journey." },
  { key: "featured_cta", label: "Featured CTA", type: "text", placeholder: "View All Agencies" },
];

export default function AdminRegionCMS() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingRegion, setEditingRegion] = useState<Location | null>(null);
  const queryClient = useQueryClient();

  const { data: locations, isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ["admin-locations-for-cms"],
    queryFn: async () => {
      const { data: locs, error } = await supabase
        .from("locations")
        .select("id, name, slug, type, parent_id")
        .order("type")
        .order("name");
      if (error) throw error;
      
      const locationsWithParents = locs?.map(loc => {
        const parent = locs.find(l => l.id === loc.parent_id);
        return { ...loc, parent };
      }) || [];
      
      return locationsWithParents;
    },
  });

  const { data: blocks, isLoading: blocksLoading, refetch: refetchBlocks } = useQuery<ContentBlock[]>({
    queryKey: ["admin-region-blocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content_blocks")
        .select("*")
        .like("page_key", "loc_%")
        .order("page_key")
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });

  const filteredLocations = locations?.filter((loc) => {
    const matchesSearch = 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || loc.type === typeFilter;
    return matchesSearch && matchesType;
  }) || [];

  const getBlocksCountForRegion = (loc: Location) => {
    const path = buildLocationPath(loc).replace('/locations/', '');
    const pageKey = `loc_${path}`;
    return blocks?.filter(b => b.page_key === pageKey).length || 0;
  };

  const groupedLocations = {
    countries: filteredLocations.filter(l => l.type === "country"),
    regions: filteredLocations.filter(l => l.type === "region"),
    counties: filteredLocations.filter(l => l.type === "county"),
  };

  return (
    <SuperAdminSidebar title="Region Content CMS" description="Edit content for region, county and city pages">
      <div className="flex flex-col h-[calc(100vh-8rem)] gap-6 overflow-hidden">
        <div className="grid gap-4 sm:grid-cols-3 shrink-0">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{groupedLocations.countries.length}</p>
                  <p className="text-sm text-muted-foreground">Countries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{groupedLocations.regions.length}</p>
                  <p className="text-sm text-muted-foreground">Regions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/20">
                  <LayoutGrid className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{blocks?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Content Blocks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden shadow-sm min-h-0">
          <CardHeader className="py-4 px-6 border-b shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                  Region Pages
                </CardTitle>
                <CardDescription>Select a location to edit its content blocks</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant={typeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("all")}
              >
                All <Badge variant="secondary" className="ml-2">{filteredLocations.length}</Badge>
              </Button>
              <Button
                variant={typeFilter === "country" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("country")}
              >
                Countries <Badge variant="secondary" className="ml-2">{groupedLocations.countries.length}</Badge>
              </Button>
              <Button
                variant={typeFilter === "region" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("region")}
              >
                Regions <Badge variant="secondary" className="ml-2">{groupedLocations.regions.length}</Badge>
              </Button>
              <Button
                variant={typeFilter === "county" ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter("county")}
              >
                Counties <Badge variant="secondary" className="ml-2">{groupedLocations.counties.length}</Badge>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0 bg-muted/5 min-h-0">
            {locationsLoading || blocksLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading locations...</p>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                <MapPin className="w-10 h-10 opacity-20" />
                <p>No locations found.</p>
              </div>
            ) : (
              <div className="p-6">
                {typeFilter === "all" || typeFilter === "country" ? (
                  groupedLocations.countries.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Countries
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {groupedLocations.countries.map((loc) => (
                          <LocationCard 
                            key={loc.id} 
                            location={loc} 
                            blocksCount={getBlocksCountForRegion(loc)}
                            onEdit={() => setEditingRegion(loc)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                ) : null}

                {typeFilter === "all" || typeFilter === "region" ? (
                  groupedLocations.regions.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Regions
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {groupedLocations.regions.map((loc) => (
                          <LocationCard 
                            key={loc.id} 
                            location={loc} 
                            blocksCount={getBlocksCountForRegion(loc)}
                            onEdit={() => setEditingRegion(loc)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                ) : null}

                {typeFilter === "all" || typeFilter === "county" ? (
                  groupedLocations.counties.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4" /> Counties
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {groupedLocations.counties.map((loc) => (
                          <LocationCard 
                            key={loc.id} 
                            location={loc} 
                            blocksCount={getBlocksCountForRegion(loc)}
                            onEdit={() => setEditingRegion(loc)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={!!editingRegion} onOpenChange={(open) => !open && setEditingRegion(null)}>
        <SheetContent side="right" className="w-full sm:max-w-3xl md:max-w-4xl p-0 flex flex-col h-full bg-white border-l shadow-2xl z-[100]">
          {editingRegion ? (
            <RegionBlockEditor
              location={editingRegion}
              locationPath={buildLocationPath(editingRegion)}
              onClose={() => {
                setEditingRegion(null);
                queryClient.invalidateQueries({ queryKey: ["admin-region-blocks"] });
              }}
              onSave={() => {
                refetchBlocks();
                queryClient.invalidateQueries({ queryKey: ["admin-region-blocks"] });
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </SuperAdminSidebar>
  );
}

function buildLocationPath(loc: Location): string {
  const parts: string[] = [];
  let current: Location | null = loc;
  
  while (current) {
    parts.unshift(current.slug);
    current = current.parent || null;
  }
  
  return `/locations/${parts.join('/')}`;
}

function LocationCard({ 
  location, 
  blocksCount, 
  onEdit 
}: { 
  location: Location; 
  blocksCount: number;
  onEdit: () => void;
}) {
  const typeColors: Record<string, string> = {
    country: "bg-primary/10 text-primary border-primary/20",
    region: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    county: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    city: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  };

  const locationPath = buildLocationPath(location);

  return (
    <div className="group flex flex-col p-4 bg-white rounded-xl border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer" onClick={onEdit}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg border", typeColors[location.type] || "bg-slate-100")}>
          {location.type === "country" ? <Globe className="w-4 h-4" /> : 
           location.type === "region" ? <MapPin className="w-4 h-4" /> : 
           <LayoutGrid className="w-4 h-4" />}
        </div>
        <Badge variant="outline" className="text-[10px] bg-white">
          {blocksCount} blocks
        </Badge>
      </div>
      <h4 className="font-semibold text-sm mb-1 line-clamp-1" title={location.name}>
        {location.name}
      </h4>
      <p className="text-xs text-muted-foreground font-mono mb-4 line-clamp-1 opacity-70">
        {locationPath}
      </p>
      <Button variant="secondary" size="sm" className="w-full mt-auto h-8 text-xs font-medium">
        <Pencil className="w-3 h-3 mr-2" />
        Edit Content
      </Button>
    </div>
  );
}

function RegionBlockEditor({
  location,
  locationPath,
  onClose,
  onSave,
}: {
  location: Location;
  locationPath: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const queryClient = useQueryClient();
  const pathSlug = locationPath.replace('/locations/', '');
  const pageKey = `loc_${pathSlug}`;
  const [activeTab, setActiveTab] = useState("content");
  const [saving, setSaving] = useState(false);
  const [editBlock, setEditBlock] = useState<ContentBlock | null>(null);

  const { data: blocks, isLoading, refetch } = useQuery<ContentBlock[]>({
    queryKey: ["region-blocks", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content_blocks")
        .select("*")
        .eq("page_key", pageKey)
        .order("display_order");
      if (error) throw error;
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (block: Partial<ContentBlock>) => {
      setSaving(true);
      const blockData = { ...block };
      delete blockData.created_at;
      delete blockData.updated_at;
      
      if (block.id) {
        const { data, error } = await supabase
          .from("page_content_blocks")
          .update({ ...blockData, updated_at: new Date().toISOString() })
          .eq("id", block.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("page_content_blocks")
          .insert({ ...blockData, page_key: pageKey })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast.success("Content saved successfully");
      refetch();
      setEditBlock(null);
      onSave();
    },
    onError: (error: Error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
    onSettled: () => {
      setSaving(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("page_content_blocks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Block deleted");
      refetch();
      onSave();
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  const generateBlocksMutation = useMutation({
    mutationFn: async () => {
      const defaultBlocks = REGION_BLOCKS.map((blockDef, index) => ({
        page_key: pageKey,
        block_key: blockDef.key,
        block_type: blockDef.type === "rich" ? "text" : blockDef.type,
        title: blockDef.label,
        content: "",
        metadata: {},
        display_order: index + 1,
        is_active: true,
      }));

      const { data: existing } = await supabase
        .from("page_content_blocks")
        .select("block_key")
        .eq("page_key", pageKey);

      const existingKeys = new Set((existing || []).map(b => b.block_key));
      const newBlocks = defaultBlocks.filter(b => !existingKeys.has(b.block_key));

      if (newBlocks.length > 0) {
        const { error } = await supabase
          .from("page_content_blocks")
          .insert(newBlocks);
        if (error) throw error;
      }

      return newBlocks.length;
    },
    onSuccess: (count) => {
      toast.success(`Generated ${count} new content blocks`);
      refetch();
      onSave();
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate: ${error.message}`);
    },
  });

  const getBlockValue = (blockKey: string): string => {
    const block = blocks?.find(b => b.block_key === blockKey);
    return block?.content || "";
  };

  const getBlock = (blockKey: string): ContentBlock | undefined => {
    return blocks?.find(b => b.block_key === blockKey);
  };

  const handleSaveBlock = (blockData: Partial<ContentBlock>) => {
    saveMutation.mutate(blockData);
  };

  const handleDeleteBlock = (id: string) => {
    if (confirm("Are you sure you want to delete this block?")) {
      deleteMutation.mutate(id);
    }
  };

  const groupedBlocks = {
    "Hero Section": ["hero_badge", "hero_title", "hero_subtitle", "hero_cta", "hero_secondary_cta", "stat_children_label", "stat_local_areas_label", "stat_agencies_label"],
    "Why Fostering": ["intro_title", "intro_paragraph_1", "intro_paragraph_2", "intro_paragraph_3"],
    "Fostering Agencies Overview": ["agencies_overview_title", "agencies_overview_intro", "agencies_list_1", "agencies_list_2", "agencies_list_3", "agencies_list_4", "agencies_comparison_title", "agencies_comparison_1", "agencies_comparison_2", "agencies_comparison_3", "agencies_comparison_4", "agencies_comparison_5", "agencies_comparison_6", "agencies_overview_closing"],
    "How Foster Care Works": ["how_it_works_title", "how_it_works_intro", "how_it_works_paragraph", "carer_qualities_title", "carer_quality_1", "carer_quality_2", "carer_quality_3", "carer_quality_4", "carer_quality_5", "how_it_works_closing"],
    "Types of Placements": ["types_title", "types_intro", "type_short_term_title", "type_short_term_desc", "type_long_term_title", "type_long_term_desc", "type_emergency_title", "type_emergency_desc", "type_respite_title", "type_respite_desc", "type_therapeutic_title", "type_therapeutic_desc", "type_parent_child_title", "type_parent_child_desc", "types_closing"],
    "Agency Types (IFA vs LA)": ["agency_types_title", "agency_types_intro", "ifa_title", "ifa_content", "ifa_bullet_01", "ifa_bullet_02", "ifa_bullet_03", "la_title", "la_content", "la_bullet_01", "la_bullet_02", "la_bullet_03", "agency_types_closing"],
    "How to Become a Carer": ["process_title", "process_intro", "process_step_1_title", "process_step_1_desc", "process_step_2_title", "process_step_2_desc", "process_step_3_title", "process_step_3_desc", "process_step_4_title", "process_step_4_desc", "process_closing"],
    "Ofsted Ratings": ["ofsted_title", "ofsted_intro", "ofsted_list_title", "ofsted_item_1", "ofsted_item_2", "ofsted_item_3", "ofsted_item_4", "ofsted_item_5", "ofsted_closing"],
    "Support for Carers": ["support_title", "support_intro", "support_allowances_title", "support_allowances_desc", "support_training_title", "support_training_desc", "support_professional_title", "support_professional_desc", "support_peer_title", "support_peer_desc", "support_closing"],
    "Areas Covered": ["areas_title", "areas_intro", "areas_list_1", "areas_list_2", "areas_list_3", "areas_list_4", "areas_list_5", "areas_list_6", "areas_closing"],
    "FAQs": ["faq_title", "faq_intro", "faq_1_question", "faq_1_answer", "faq_2_question", "faq_2_answer", "faq_3_question", "faq_3_answer", "faq_4_question", "faq_4_answer"],
    "Our Commitment": ["commitment_title", "commitment_1", "commitment_2", "commitment_3"],
    "Call to Action": ["cta_title", "cta_subtitle", "cta_closing", "cta_button"],
    "Featured Agencies": ["featured_title", "featured_subtitle", "featured_cta"],
  };

  return (
    <>
      <SheetHeader className="px-6 py-5 border-b bg-muted/5 shrink-0">
        <div className="flex flex-col gap-1">
          <SheetTitle className="text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {location.name}
          </SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {locationPath}
          </SheetDescription>
        </div>
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            onClick={() => generateBlocksMutation.mutate()} 
            disabled={generateBlocksMutation.isPending}
            variant="outline" 
            className="h-8"
          >
            {generateBlocksMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-3 h-3 mr-2" />
            )}
            Generate Blocks
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="ml-auto h-8">
            Close
          </Button>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full min-h-0">
          <div className="px-6 pt-4 shrink-0 bg-background/95 backdrop-blur z-10 pb-2 border-b">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="content">Content Blocks ({blocks?.length || 0})</TabsTrigger>
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content" className="flex-1 overflow-y-auto p-6 data-[state=inactive]:hidden min-h-0">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedBlocks).map(([group, blockKeys]) => (
                  <div key={group} className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 pb-2 border-b">
                      <ChevronRight className="w-4 h-4" />
                      {group}
                    </h3>
                    <div className="grid gap-4">
                      {blockKeys.map((blockKey) => {
                        const blockDef = REGION_BLOCKS.find(b => b.key === blockKey);
                        const block = getBlock(blockKey);
                        const value = block?.content || "";

                        return (
                          <div
                            key={blockKey}
                            className="bg-white p-4 rounded-xl border hover:border-primary/30 transition-all shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1">
                                <Label className="text-sm font-medium">
                                  {blockDef?.label || blockKey}
                                </Label>
                                <p className="text-xs text-muted-foreground font-mono mt-1">
                                  {blockKey}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={block?.is_active ?? false}
                                  onCheckedChange={(checked) => {
                                    if (block) {
                                      saveMutation.mutate({ ...block, is_active: checked });
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditBlock(block || {
                                    page_key: pageKey,
                                    block_key: blockKey,
                                    block_type: blockDef?.type === "rich" ? "text" : blockDef?.type || "text",
                                    title: blockDef?.label || blockKey,
                                    content: "",
                                    metadata: {},
                                    display_order: blockKeys.indexOf(blockKey) + 1,
                                    is_active: true,
                                  } as ContentBlock)}
                                >
                                  <Pencil className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                {block && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => handleDeleteBlock(block.id)}
                                  >
                                    ×
                                  </Button>
                                )}
                              </div>
                            </div>
                            {value ? (
                              <div 
                                className="text-sm text-slate-600 line-clamp-3 p-3 bg-slate-50 rounded-lg prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: value }}
                              />
                            ) : (
                              <p className="text-xs text-amber-500 italic p-3 bg-amber-50 rounded-lg">
                                No content - Click Edit to add content
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-y-auto p-6 data-[state=inactive]:hidden min-h-0">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-slate-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Live Page Preview</h3>
                <p className="text-sm text-muted-foreground">
                  This shows how your content will appear on the live page. 
                  <a 
                    href={locationPath} 
                    target="_blank" 
                    className="text-primary hover:underline ml-1"
                  >
                    View live page →
                  </a>
                </p>
              </div>
              
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-slate-900 px-4 py-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-slate-400">{locationPath}</span>
                </div>
                <div className="p-8 bg-white">
                  <div className="space-y-6">
                    <div className="text-center">
                      <Badge variant="outline" className="mb-4">
                        {getBlockValue("hero_badge") || "Hero Badge"}
                      </Badge>
                      <h1 
                        className="text-4xl font-bold"
                        dangerouslySetInnerHTML={{ __html: getBlockValue("hero_title") || `Fostering in ${location.name}` }}
                      />
                      <p 
                        className="mt-4 text-lg text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: getBlockValue("hero_subtitle") || "Subtitle content..." }}
                      />
                    </div>

                    <hr />

                    <div>
                      <h2 
                        className="text-2xl font-bold mb-4"
                        dangerouslySetInnerHTML={{ __html: getBlockValue("intro_title") || "Introduction Title" }}
                      />
                      <div 
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: getBlockValue("intro_content") || "<p>Introduction content...</p>" }}
                      />
                    </div>

                    <hr />

                    <div>
                      <h2 
                        className="text-2xl font-bold mb-4"
                        dangerouslySetInnerHTML={{ __html: getBlockValue("agency_types_title") || "Agency Types" }}
                      />
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 border rounded-lg">
                          <h3 
                            className="font-bold mb-2"
                            dangerouslySetInnerHTML={{ __html: getBlockValue("ifa_title") || "Independent Fostering Agencies" }}
                          />
                          <div 
                            className="prose prose-sm"
                            dangerouslySetInnerHTML={{ __html: getBlockValue("ifa_content") || "<p>IFA content...</p>" }}
                          />
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 
                            className="font-bold mb-2"
                            dangerouslySetInnerHTML={{ __html: getBlockValue("la_title") || "Local Authority" }}
                          />
                          <div 
                            className="prose prose-sm"
                            dangerouslySetInnerHTML={{ __html: getBlockValue("la_content") || "<p>LA content...</p>" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {editBlock && (
        <BlockEditModal
          block={editBlock}
          blockDef={REGION_BLOCKS.find(b => b.key === editBlock.block_key)}
          onSave={handleSaveBlock}
          onCancel={() => setEditBlock(null)}
          saving={saving}
        />
      )}
    </>
  );
}

function BlockEditModal({
  block,
  blockDef,
  onSave,
  onCancel,
  saving,
}: {
  block: Partial<ContentBlock>;
  blockDef?: { key: string; label: string; type: string; placeholder: string };
  onSave: (block: Partial<ContentBlock>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    content: block.content || "",
    title: block.title || "",
    is_active: block.is_active ?? true,
  });

  const isRichType = blockDef?.type === "rich";

  return (
    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Edit: {blockDef?.label || block.block_key}</h2>
          <p className="text-sm text-muted-foreground font-mono mt-1">{block.block_key}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-2">
            <Label>Internal Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Internal title for reference"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Content {isRichType && <span className="text-primary">(Rich Text - Supports H1, H2, H3, Bold, Lists)</span>}
            </Label>
            {isRichType ? (
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
                placeholder={blockDef?.placeholder || "Enter content..."}
              />
            ) : (
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder={blockDef?.placeholder || "Enter content..."}
                rows={6}
                className="font-mono"
              />
            )}
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label>Active (show on page)</Label>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={() => onSave({ ...block, ...formData })} 
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
