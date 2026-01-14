import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import AgenciesListing from './pages/AgenciesListing';
import AgencyProfile from './pages/AgencyProfile';
import LocationsIndex from './pages/LocationsIndex';
import UnifiedLocationPage from './pages/UnifiedLocationPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import CompareAgencies from './pages/CompareAgencies';
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import UserDashboard from './pages/UserDashboard';
import AgencyDashboard from './pages/AgencyDashboard';
import AgencySettings from './pages/AgencySettings';
import ClaimAgency from './pages/ClaimAgency';
import RegisterAgency from './pages/RegisterAgency';
import AdminDashboard from './pages/admin/AdminDashboardNew';
import AdminAgencies from './pages/admin/AdminAgenciesNew';
import AdminLocations from './pages/admin/AdminLocationsNew';
import AdminAgencyLocations from './pages/admin/AdminAgencyLocations';
import AdminContent from './pages/admin/AdminContent';
import AdminFaqs from './pages/admin/AdminFaqs';
import AdminLeads from './pages/admin/AdminLeads';
import AdminBlog from './pages/admin/AdminBlog';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminGmbImport from './pages/admin/AdminGmbImport';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSpecialisms from './pages/admin/AdminSpecialisms';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';
import AdminDirectAccess from './pages/admin/AdminDirectAccess';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminCMS from './pages/admin/AdminCMS';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminRanking from './pages/admin/AdminRanking';
import AdminReputationManagement from './pages/admin/AdminReputationManagement';
import AdminLeadsIntelligence from './pages/admin/AdminLeadsIntelligence';
import SpecialismsIndex from './pages/SpecialismsIndex';
import SpecialismPage from './pages/SpecialismPage';
import HowListingsWork from './pages/HowListingsWork';
import EditorialPolicy from './pages/EditorialPolicy';
import GuidesIndex from './pages/GuidesIndex';
import TrustVerification from './pages/TrustVerification';
import HowToBecomeGuide from './pages/guides/HowToBecomeGuide';
import FosteringAllowancesGuide from './pages/guides/FosteringAllowancesGuide';
import TypesOfFosteringGuide from './pages/guides/TypesOfFosteringGuide';
import NotFound from './pages/NotFound';

// Agency Workspace Pages
import AgencyWorkspace from './pages/agency/AgencyWorkspace';
import AgencyDashboardHome from './pages/agency/AgencyDashboardHome';
import AgencyLeads from './pages/agency/AgencyLeads';
import AgencyTasks from './pages/agency/AgencyTasks';
import AgencyTeam from './pages/agency/AgencyTeam';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agencies" element={<AgenciesListing />} />
          <Route path="/agencies/:slug" element={<AgencyProfile />} />
          <Route path="/compare" element={<CompareAgencies />} />
          <Route path="/locations" element={<LocationsIndex />} />
          
          {/* Unified location route - handles any depth of location hierarchy */}
          <Route path="/locations/*" element={<UnifiedLocationPage />} />
          
          <Route path="/specialisms" element={<SpecialismsIndex />} />
          <Route path="/specialisms/:slug" element={<SpecialismPage />} />
          <Route path="/guides" element={<GuidesIndex />} />
          <Route path="/guides/how-to-become-foster-carer" element={<HowToBecomeGuide />} />
          <Route path="/guides/fostering-allowances" element={<FosteringAllowancesGuide />} />
          <Route path="/guides/types-of-fostering" element={<TypesOfFosteringGuide />} />
          <Route path="/trust-verification" element={<TrustVerification />} />
          <Route path="/how-listings-work" element={<HowListingsWork />} />
          <Route path="/editorial-policy" element={<EditorialPolicy />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          
          {/* Legacy agency dashboard routes */}
          <Route path="/agency/dashboard" element={<AgencyDashboard />} />
          <Route path="/agency/settings" element={<AgencySettings />} />
          
          {/* New Agency Workspace Routes */}
          <Route path="/workspace" element={<AgencyWorkspace />}>
            <Route index element={<AgencyDashboardHome />} />
            <Route path="leads" element={<AgencyLeads />} />
            <Route path="tasks" element={<AgencyTasks />} />
            <Route path="team" element={<AgencyTeam />} />
          </Route>
          
          <Route path="/claim" element={<ClaimAgency />} />
          <Route path="/register-agency" element={<RegisterAgency />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/access" element={<AdminDirectAccess />} />
          <Route path="/admin/agencies" element={<AdminAgencies />} />
          <Route path="/admin/locations" element={<AdminLocations />} />
          <Route path="/admin/agency-locations" element={<AdminAgencyLocations />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/faqs" element={<AdminFaqs />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/gmb-import" element={<AdminGmbImport />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/specialisms" element={<AdminSpecialisms />} />
          <Route path="/admin/site-settings" element={<AdminSiteSettings />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
          <Route path="/admin/cms" element={<AdminCMS />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          <Route path="/admin/ranking" element={<AdminRanking />} />
          <Route path="/admin/reputation" element={<AdminReputationManagement />} />
          <Route path="/admin/leads-intelligence" element={<AdminLeadsIntelligence />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
