"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Location, FAQ } from "@/services/dataService";
import { useAvailableRegions } from "@/hooks/useAvailableRegions";

interface IndexProps {
  initialCmsContent?: any;
  initialFaqs?: FAQ[];
  initialLocations?: Location[];
}

export default function Index({ initialLocations }: IndexProps) {
  const englandRegions = initialLocations?.find(l => l.slug === "england");
  const childLocations = englandRegions ? (englandRegions as any).children || [] : [];
  const { data: availableRegions } = useAvailableRegions(childLocations);
  
  const regionsWithContent = childLocations.filter((region: any) => {
    if (!availableRegions) return false;
    return availableRegions.some(ar => ar.slug === region.slug);
  });

  const steps = [
    "Search by location or browse regions",
    "Compare agencies and read verified reviews",
    "Contact agencies directly"
  ];

  const trustItems = [
    "Ofsted regulated agencies",
    "Robust safeguarding standards",
    "Ongoing support for all carriers"
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* ACT 1: ARRIVAL - Hero */}
      <section className="bg-slate-900 text-white py-32 md:py-48 lg:py-56">
        <div className="px-6 md:px-12 max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-6">
            Find the right path<br/>to fostering
          </h1>
          <p className="text-lg text-stone-400 leading-relaxed max-w-xl mb-10">
            A directory of verified fostering agencies across the UK. 
            Compare options, read reviews, and find support — on your terms.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/locations/england">
              <Button className="bg-white text-slate-900 hover:bg-stone-100 rounded-full px-8 h-12">
                Browse regions
              </Button>
            </Link>
            <Link href="/agencies">
              <Button variant="ghost" className="text-stone-400 hover:text-white">
                Find agencies
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ACT 2: ORIENTATION - What this platform is */}
      <section className="py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 max-w-2xl">
          <p className="text text-base-stone-600 leading-relaxed">
            This is a directory — not a agency, not a charity. We list fostering agencies 
            across England so you can compare them directly. We do not recruit foster 
            carriers ourselves, and we do not provide advice. Our role is to help you 
            find the right agency for your circumstances.
          </p>
        </div>
      </section>

      {/* ACT 3: HOW IT WORKS */}
      <section className="py-20 md:py-28 bg-stone-50">
        <div className="px-6 md:px-12 max-w-2xl">
          <h2 className="text-xl font-medium text-slate-900 mb-10">How it works</h2>
          
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-stone-300"></div>
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="relative flex gap-5">
                  <div className="w-4 h-4 rounded-full bg-slate-900 shrink-0 z-10 mt-1"></div>
                  <p className="text-stone-600 leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACT 4: EXPLORATION - Regions */}
      <section className="py-20 md:py-28 bg-white">
        <div className="px-6 md:px-12 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-medium text-slate-900 mb-3">
            Start by location
          </h2>
          <p className="text-stone-500 mb-10 max-w-md">
            Each region has different agencies and support networks.
          </p>

          {regionsWithContent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-stone-200">
              {regionsWithContent.map((region: any) => (
                <Link
                  key={region.id}
                  href={`/locations/england/${region.slug}`}
                  className="group bg-white p-5 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {region.name}
                    </span>
                    <span className="text-stone-300 group-hover:text-emerald-600">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Link href="/agencies">
              <Button variant="outline" className="rounded-full">
                Browse all agencies
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* ACT 5: REASSURANCE */}
      <section className="py-16 bg-stone-100">
        <div className="px-6 md:px-12 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {trustItems.map((item, i) => (
              <p key={i} className="text-sm text-stone-600">{item}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ACT 6: EXIT */}
      <section className="bg-slate-900 text-white py-20">
        <div className="px-6 md:px-12 max-w-xl text-center">
          <p className="text-lg mb-8">
            Ready to speak with an agency? Browse our directory to find contact details and compare services.
          </p>
          <Link href="/agencies">
            <Button className="bg-white text-slate-900 hover:bg-stone-100 rounded-full px-8 h-11">
              View all agencies
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
