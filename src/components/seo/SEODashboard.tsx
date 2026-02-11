'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Search,
  Users,
  BarChart3
} from 'lucide-react';

interface SEOMetric {
  id: string;
  name: string;
  value: number | string;
  change: number;
  status: 'good' | 'warning' | 'critical';
  lastUpdated: string;
}

interface SEOReport {
  overallScore: number;
  metrics: SEOMetric[];
  issues: Array<{
    id: string;
    title: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    recommendation: string;
  }>;
  opportunities: Array<{
    id: string;
    title: string;
    potentialImpact: 'high' | 'medium' | 'low';
    description: string;
    effort: 'low' | 'medium' | 'high';
  }>;
}

export function SEODashboard() {
  const [report, setReport] = useState<SEOReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching SEO data
    const fetchSEOData = async () => {
      // In a real implementation, this would call your SEO API
      const mockData: SEOReport = {
        overallScore: 87,
        metrics: [
          {
            id: 'organic-traffic',
            name: 'Organic Traffic',
            value: '2,847',
            change: 12.5,
            status: 'good',
            lastUpdated: '2024-01-15'
          },
          {
            id: 'keyword-rankings',
            name: 'Keyword Rankings',
            value: '156',
            change: 8.2,
            status: 'good',
            lastUpdated: '2024-01-15'
          },
          {
            id: 'backlinks',
            name: 'Backlinks',
            value: '342',
            change: -2.1,
            status: 'warning',
            lastUpdated: '2024-01-15'
          },
          {
            id: 'page-speed',
            name: 'Page Speed',
            value: '89/100',
            change: 5.0,
            status: 'good',
            lastUpdated: '2024-01-15'
          },
          {
            id: 'mobile-usability',
            name: 'Mobile Usability',
            value: '98/100',
            change: 0,
            status: 'good',
            lastUpdated: '2024-01-15'
          },
          {
            id: 'indexed-pages',
            name: 'Indexed Pages',
            value: '1,247',
            change: 15.3,
            status: 'good',
            lastUpdated: '2024-01-15'
          }
        ],
        issues: [
          {
            id: 'missing-alt-tags',
            title: 'Missing Alt Tags',
            severity: 'medium',
            description: '47 images are missing alt text attributes',
            recommendation: 'Add descriptive alt text to all images for better accessibility and SEO'
          },
          {
            id: 'duplicate-meta-descriptions',
            title: 'Duplicate Meta Descriptions',
            severity: 'high',
            description: '12 pages have duplicate meta descriptions',
            recommendation: 'Create unique, compelling meta descriptions for each page'
          },
          {
            id: 'slow-lcp',
            title: 'Slow Largest Contentful Paint',
            severity: 'medium',
            description: 'LCP is 3.2s, above the recommended 2.5s threshold',
            recommendation: 'Optimize largest images and implement lazy loading'
          }
        ],
        opportunities: [
          {
            id: 'content-clustering',
            title: 'Content Clustering',
            potentialImpact: 'high',
            description: 'Create topic clusters around main keywords to improve topical authority',
            effort: 'medium'
          },
          {
            id: 'internal-linking',
            title: 'Internal Linking',
            potentialImpact: 'medium',
            description: 'Add 50+ strategic internal links to improve site architecture',
            effort: 'low'
          },
          {
            id: 'schema-markup',
            title: 'Schema Markup',
            potentialImpact: 'high',
            description: 'Implement FAQ and LocalBusiness schema for rich results',
            effort: 'low'
          }
        ]
      };

      setTimeout(() => {
        setReport(mockData);
        setLoading(false);
      }, 1500);
    };

    fetchSEOData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              SEO Performance Overview
            </CardTitle>
            <CardDescription>
              Your website's current SEO health and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900">{report.overallScore}/100</div>
                <div className="text-sm text-gray-500 mt-1">Overall SEO Score</div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={report.overallScore >= 80 ? "default" : report.overallScore >= 60 ? "secondary" : "destructive"}
                  className="text-lg px-3 py-1"
                >
                  {report.overallScore >= 80 ? "Excellent" : report.overallScore >= 60 ? "Good" : "Needs Work"}
                </Badge>
                <div className="text-sm text-gray-500 mt-1">Last updated today</div>
              </div>
            </div>
            <Progress value={report.overallScore} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Issues to Fix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.issues.map((issue) => (
                <div key={issue.id} className="flex items-start gap-3">
                  <Badge 
                    variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {issue.severity}
                  </Badge>
                  <div>
                    <div className="font-medium text-sm">{issue.title}</div>
                    <div className="text-xs text-gray-500">{issue.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Key Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.metrics.map((metric) => (
              <div key={metric.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{metric.name}</h3>
                  <Badge 
                    variant={metric.status === 'good' ? 'default' : metric.status === 'warning' ? 'secondary' : 'destructive'}
                    className="text-xs"
                  >
                    {metric.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="flex items-center gap-1 text-sm">
                  {metric.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={metric.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-gray-500">vs last month</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">Updated {metric.lastUpdated}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Growth Opportunities
          </CardTitle>
          <CardDescription>
            Actionable opportunities to improve your SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.opportunities.map((opportunity) => (
              <div key={opportunity.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {opportunity.potentialImpact} impact
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {opportunity.effort} effort
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">{opportunity.description}</p>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Implementation Guide →
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick SEO Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="text-left">
                <div className="font-medium">Run SEO Audit</div>
                <div className="text-sm text-gray-500">Check for technical issues</div>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <Clock className="h-5 w-5 text-blue-500" />
              <div className="text-left">
                <div className="font-medium">Schedule Content Review</div>
                <div className="text-sm text-gray-500">Optimize existing content</div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}