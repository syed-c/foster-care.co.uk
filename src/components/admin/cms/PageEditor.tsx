import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type CmsContent = Tables<"cms_content">;

interface SectionDef {
  key: string;
  name: string;
  fields: string[];
}

interface PageEditorProps {
  pageKey: string;
  sections: SectionDef[];
  contents: CmsContent[];
  onClose: () => void;
}

// SEO fields stored in a special section
const SEO_SECTION_KEY = "seo_meta";

export function PageEditor({ pageKey, sections, contents, onClose }: PageEditorProps) {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  
  // Get existing content for this page
  const pageContents = contents.filter(c => c.page_key === pageKey);
  
  // Initialize form data from existing content
  const getInitialData = () => {
    const data: Record<string, Record<string, string>> = {};
    
    // SEO section
    const seoContent = pageContents.find(c => c.section === SEO_SECTION_KEY);
    data[SEO_SECTION_KEY] = {
      title: seoContent?.title || "",
      content: seoContent?.content || "",
    };
    
    // Page sections
    sections.forEach(section => {
      const existing = pageContents.find(c => c.section === section.key);
      data[section.key] = {
        title: existing?.title || "",
        content: existing?.content || "",
      };
    });
    
    return data;
  };
  
  const [formData, setFormData] = useState(getInitialData);

  const updateField = (sectionKey: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [field]: value,
      },
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setIsSaving(true);
      
      // Save all sections including SEO
      const allSections = [
        { key: SEO_SECTION_KEY, name: "SEO", fields: ["title", "content"] },
        ...sections,
      ];
      
      for (let i = 0; i < allSections.length; i++) {
        const section = allSections[i];
        const sectionData = formData[section.key];
        const existing = pageContents.find(c => c.section === section.key);
        
        if (existing) {
          // Update existing
          const { error } = await supabase
            .from("cms_content")
            .update({
              title: sectionData.title || null,
              content: sectionData.content || null,
            })
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase
            .from("cms_content")
            .insert({
              page_key: pageKey,
              section: section.key,
              title: sectionData.title || null,
              content: sectionData.content || null,
              is_active: true,
            });
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cms-content"] });
      toast.success("Page content saved successfully");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const fieldLabels: Record<string, string> = {
    title: "Title",
    content: "Content",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - SEO */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <h3 className="font-semibold mb-4">SEO</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={formData[SEO_SECTION_KEY]?.title || ""}
                  onChange={(e) => updateField(SEO_SECTION_KEY, "title", e.target.value)}
                  placeholder="Page title for search engines"
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={formData[SEO_SECTION_KEY]?.content || ""}
                  onChange={(e) => updateField(SEO_SECTION_KEY, "content", e.target.value)}
                  placeholder="Brief description for search results"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Sections */}
        <ScrollArea className="h-[60vh] pr-4">
          <Accordion type="multiple" className="space-y-2">
            {sections.map((section) => (
              <AccordionItem 
                key={section.key} 
                value={section.key}
                className="border rounded-xl px-4 bg-card"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <span className="font-medium">{section.name}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field} className="space-y-2">
                        <Label>{fieldLabels[field] || field}</Label>
                        {field === "content" ? (
                          <Textarea
                            value={formData[section.key]?.[field] || ""}
                            onChange={(e) => updateField(section.key, field, e.target.value)}
                            placeholder={`Enter ${fieldLabels[field]?.toLowerCase() || field}`}
                            rows={4}
                          />
                        ) : (
                          <Input
                            value={formData[section.key]?.[field] || ""}
                            onChange={(e) => updateField(section.key, field, e.target.value)}
                            placeholder={`Enter ${fieldLabels[field]?.toLowerCase() || field}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => saveMutation.mutate()} disabled={isSaving}>
          {isSaving ? (
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
  );
}
