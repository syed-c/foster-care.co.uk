"use client";

import { Location, Agency, FAQ } from "@/services/dataService";
import { CountryTemplate } from "./CountryTemplate";
import { RegionTemplate } from "./RegionTemplate";
import { LocalTemplate } from "./LocalTemplate";

export interface RichLocationPageProps {
    location: Location;
    childLocations: Location[];
    path: Location[];
    faqs: FAQ[];
    agencies: Agency[];
    stats: {
        childrenInCare: number;
        boroughs: number;
        agenciesCount: number;
    };
}

export function RichLocationPage(props: RichLocationPageProps) {
    const { location } = props;

    // Dispatch based on location type or name
    if (location.type === 'country' || location.name === 'England' || location.name === 'Scotland' || location.name === 'Wales') {
        return <CountryTemplate {...props} />;
    }

    if (location.type === 'region') {
        return <RegionTemplate {...props} />;
    }

    // Default to Local/City/County template
    return <LocalTemplate {...props} />;
}
