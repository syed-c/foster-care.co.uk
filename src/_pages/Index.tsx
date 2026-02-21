"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Location, FAQ } from "@/services/dataService";
import { useAvailableRegions } from "@/hooks/useAvailableRegions";
import { ArrowRight, ShieldCheck, Heart, Users } from "lucide-react";

interface IndexProps {
  initialCmsContent?: any;
  initialFaqs?: FAQ[];
  initialLocations?: Location[];
}

function EnglandMap() {
  return (
    <svg viewBox="0 0 300 350" className="w-full h-full opacity-5" fill="none">
      <path 
        d="M50 280 L80 270 L100 275 L120 260 L140 265 L160 250 L180 245 L200 250 L220 235 L240 240 L260 230 L270 210 L280 180 L285 150 L280 120 L270 100 L250 90 L230 85 L210 90 L190 80 L170 75 L150 80 L130 75 L110 80 L90 90 L70 100 L55 120 L45 150 L40 180 L35 210 L40 240 L45 260 Z" 
        stroke="currentColor" 
        strokeWidth="1" 
        fill="none"
        className="text-emerald-400"
      />
    </svg>
  )
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
    { icon: ShieldCheck, text: "Ofsted regulated agencies" },
    { icon: Heart, text: "Robust safeguarding standards" },
    { icon: Users, text: "Ongoing support for all carriers" }
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* HERO - With subtle visual anchor */}
      <section className="relative bg-slate-900 text-white py-32 md:py-48 lg:py-56 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 max-w-lg hidden lg:block">
            <EnglandMap />
          </div>
        </div>
        
        <div className="relative px-6 md:px-12 max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-8">
            Find the right path<br/>to fostering
          </h1>
          <p className="text-lg text-stone-300 leading-relaxed max-w-xl mb-10">
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

      {/* PLATFORM EXPLANATION - With visual boundary */}
      <section className="py-20 md:py-28 bg-white border-b border-stone-100">
        <div className="px-6 md:px-12 max-w-2xl">
          <p className="text-base text-stone-600 leading-relaxed">
            This is a directory — not an agency, not a charity. We list fostering agencies 
            across England so you can compare them directly. We do not recruit foster 
            carriers ourselves, and we do not provide advice. Our role is to help you 
            find the right agency for your circumstances.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS - Flow with dots */}
      <section className="py-20 md:py-28 bg-stone-50">
        <div className="px-6 md:px-12 max-w-2xl">
          <h2 className="text-2xl font-medium text-slate-900 mb-12">How it works</h2>
          
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-stone-300"></div>
            <div className="space-y-10">
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

      {/* START BY LOCATION - Center of gravity */}
      <section className="py-24 md:py-32 bg-white">
        <div className="px-6 md:px-12 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
            Start by location
          </h2>
          <p className="text-stone-500 mb-12 max-w-md">
            Each region has different agencies and support networks.
          </p>

          {regionsWithContent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-stone-200">
              {regionsWithContent.map((region: any) => (
                <Link
                  key={region.id}
                  href={`/locations/england/${region.slug}`}
                  className="group bg-white p-6 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {region.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
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

      {/* TRUST SIGNALS - Compressed horizontal strip */}
      <section className="py-12 bg-slate-900">
        <div className="px-6 md:px-12 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-sm text-stone-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - Strong closure */}
      <section className="bg-slate-900 text-white py-24">
        <div className="px-6 md:px-12 max-w-xl text-center">
          <p className="text-xl mb-10">
            Ready to speak with an agency? Browse our directory to find contact details and compare services.
          </p>
          <Link href="/agencies">
            <Button className="bg-white text-slate-900 hover:bg-stone-100 rounded-full px-10 h-12">
              View all agencies
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
