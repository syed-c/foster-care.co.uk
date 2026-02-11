import { supabase } from "./integrations/supabase/client";
import { Tables } from "./integrations/supabase/types";
import { type CmsContent } from "./hooks/useCmsContent";

async function test_func() {
    const { data } = await supabase.from("cms_content").select("*").maybeSingle();
    if (data) {
        const content = data as unknown as CmsContent;
        console.log(content.metadata);
    }
}

type T = Tables<"cms_content">;
const x: T = {
    id: "1",
    page_key: "home",
    section: "hero",
    content: "test",
    title: "test",
    metadata: {},
    is_active: true,
    created_at: "",
    updated_at: ""
};

console.log(x, test_func);
