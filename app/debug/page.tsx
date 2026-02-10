"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function DebugPage() {
    const [results, setResults] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function runChecks() {
            const checks: any = {};

            try {
                // Check 1: Supabase Configuration
                checks.config = {
                    url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
                    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set (Length: " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ")" : "Missing",
                };

                // Check 2: Fetch Locations (England)
                const { data: englandData, error: englandError } = await supabase
                    .from("locations")
                    .select("*")
                    .eq("slug", "england")
                    .maybeSingle();

                checks.england = { data: englandData, error: englandError };

                // Check 3: Fetch Any Location
                const { data: anyLocation, error: anyLocationError } = await supabase
                    .from("locations")
                    .select("id, name, slug")
                    .limit(5);

                checks.allLocations = { data: anyLocation, error: anyLocationError };

                // Check 4: Fetch Specialisms (Checking RLS/Existence)
                const { data: specialisms, error: specialismsError } = await supabase
                    .from("specialisms")
                    .select("id, name, slug")
                    .limit(5);

                checks.specialisms = { data: specialisms, error: specialismsError };

            } catch (e: any) {
                checks.exception = e.message;
            }

            setResults(checks);
            setLoading(false);
        }

        runChecks();
    }, []);

    return (
        <div className="p-10 font-mono text-sm bg-gray-100 min-h-screen text-black">
            <h1 className="text-2xl font-bold mb-6">Supabase Debugger</h1>

            {loading ? (
                <div>Running checks...</div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded shadow border border-gray-300">
                        <h2 className="font-bold border-b pb-2 mb-2">1. Config</h2>
                        <pre>{JSON.stringify(results.config, null, 2)}</pre>
                    </div>

                    <div className={`p-4 rounded shadow border ${results.england?.data ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <h2 className="font-bold border-b pb-2 mb-2">2. Fetch 'england' Location</h2>
                        {results.england?.data ? (
                            <div className="text-green-700">✅ Found: {results.england.data.name} (ID: {results.england.data.id})</div>
                        ) : (
                            <div className="text-red-700">❌ Not Found</div>
                        )}
                        <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(results.england, null, 2)}</pre>
                    </div>

                    <div className="bg-white p-4 rounded shadow border border-gray-300">
                        <h2 className="font-bold border-b pb-2 mb-2">3. Any Locations Table Dump (Top 5)</h2>
                        <pre className="text-xs overflow-auto">{JSON.stringify(results.allLocations, null, 2)}</pre>
                    </div>

                    <div className="bg-white p-4 rounded shadow border border-gray-300">
                        <h2 className="font-bold border-b pb-2 mb-2">4. Specialisms Table Dump (Top 5)</h2>
                        <pre className="text-xs overflow-auto">{JSON.stringify(results.specialisms, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}
