"use client";

import { Location, Agency, FAQ } from "@/services/dataService";
import UnifiedLocationPage from "@/_pages/UnifiedLocationPage";
import { FilteredAgencies } from "@/components/locations/FilteredAgencies";

interface CountryPageClientProps {
    location: Location;
    childLocations: Location[];
    locationPath: Location[];
    locationFaqs: FAQ[];
    locationAgencies: Agency[];
    cmsContent: any[];
    filterType?: string;
    filterService?: string;
    filterLocation?: string;
    showFilteredAgencies: boolean;
}

export function CountryPageClient({
    location,
    childLocations,
    locationPath,
    locationFaqs,
    locationAgencies,
    cmsContent,
    filterType,
    filterService,
    filterLocation,
    showFilteredAgencies,
}: CountryPageClientProps) {
    return (
        <>
            <UnifiedLocationPage
                initialLocation={location}
                initialChildLocations={childLocations}
                initialLocationPath={locationPath}
                initialLocationFaqs={locationFaqs}
                initialLocationAgencies={locationAgencies}
                initialCmsContent={cmsContent}
            />
            
            {showFilteredAgencies && filterType && filterService && filterLocation && (
                <section className="py-16 bg-stone-50">
                    <div className="container-main px-4 max-w-4xl mx-auto">
                        <FilteredAgencies
                            type={filterType}
                            service={filterService}
                            location={filterLocation}
                        />
                    </div>
                </section>
            )}
        </>
    );
}
