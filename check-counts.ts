import { createClient } from './src/lib/supabase/server';

async function check() {
  const supabase = await createClient();
  const [{ count: locCount }, { count: agCount }, { count: specCount }, { count: blogCount }] = await Promise.all([
    supabase.from('locations').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('agencies').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('specialisms').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published')
  ]);
  console.log({ locCount, agCount, specCount, blogCount });
}
check();
