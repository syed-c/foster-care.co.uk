import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '../src/pages/Index';
import AgenciesListing from '../src/pages/AgenciesListing';
import AgencyProfile from '../src/pages/AgencyProfile';
import LocationsIndex from '../src/pages/LocationsIndex';
import LocationPage from '../src/pages/LocationPage';
import CountryPage from '../src/pages/CountryPage';
import RegionPage from '../src/pages/RegionPage';
import AboutPage from '../src/pages/AboutPage';
import ContactPage from '../src/pages/ContactPage';
import AuthPage from '../src/pages/AuthPage';
import CompareAgencies from '../src/pages/CompareAgencies';
import BlogIndex from '../src/pages/BlogIndex';
import BlogPost from '../src/pages/BlogPost';
import UserDashboard from '../src/pages/UserDashboard';
import AgencyDashboard from '../src/pages/AgencyDashboard';
import AgencySettings from '../src/pages/AgencySettings';
import ClaimAgency from '../src/pages/ClaimAgency';
import RegisterAgency from '../src/pages/RegisterAgency';
import AdminDashboard from '../src/pages/admin/AdminDashboard';
import AdminAgencies from '../src/pages/admin/AdminAgencies';
import AdminLocations from '../src/pages/admin/AdminLocations';
import AdminAgencyLocations from '../src/pages/admin/AdminAgencyLocations';
import AdminContent from '../src/pages/admin/AdminContent';
import AdminFaqs from '../src/pages/admin/AdminFaqs';
import AdminLeads from '../src/pages/admin/AdminLeads';
import AdminBlog from '../src/pages/admin/AdminBlog';
import AdminUsers from '../src/pages/admin/AdminUsers';
import AdminSettings from '../src/pages/admin/AdminSettings';
import AdminGmbImport from '../src/pages/admin/AdminGmbImport';
import NotFound from '../src/pages/NotFound';
import type { AppProps } from 'next/app';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Since we're converting to Next.js, we need to handle client-side routing differently
  // For now, we'll keep the same component structure but adapt it to Next.js

  useEffect(() => {
    // This would handle any client-side routing logic if needed
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Component {...pageProps} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default MyApp;