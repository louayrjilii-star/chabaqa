import { apiClient, ApiSuccessResponse } from './client';

export interface CreatorAnalyticsParams {
  from?: string;
  to?: string;
  communityId?: string;
  communitySlug?: string;
}

export type CreatorContentChartType =
  | 'course'
  | 'challenge'
  | 'session'
  | 'event'
  | 'product'
  | 'post';

export type CreatorDashboardContentType = CreatorContentChartType | 'all';

export interface CreatorAnalyticsChart {
  id: string;
  title: string;
  description: string;
  visualization: 'area' | 'bar' | 'donut' | 'funnel' | 'heatmap' | 'line' | 'stacked_bar' | 'table';
  data: Array<Record<string, unknown>>;
  metrics: string[];
  xKey?: string;
  yKeys?: string[];
  valueKey?: string;
  source: string;
  precision: 'exact' | 'rollup' | 'hybrid' | 'derived';
  unit?: string;
}

export interface CreatorContentChartPack {
  contentType: CreatorContentChartType;
  contentId: string | null;
  contentMeta: {
    title?: string;
    communityId?: string;
    currency?: string;
    price?: number;
    trackingIds?: string[];
    orderIds?: string[];
  } | null;
  generatedAt: string;
  range: { from: string; to: string; timezone: string };
  totals: Record<string, number>;
  charts: CreatorAnalyticsChart[];
  precision: {
    label: string;
    sources: string[];
    notes: string[];
  };
}

export interface CreatorContentChartsParams extends CreatorAnalyticsParams {
  contentType?: CreatorDashboardContentType;
  contentId?: string;
}

export interface CreatorDashboardParams extends CreatorAnalyticsParams {
  contentType?: CreatorDashboardContentType;
}

export interface CreatorDashboardKpi {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  change: number;
  sub: string;
  color: string;
  iconKey: string;
}

export interface CreatorDashboardContentPerformance {
  id: string;
  title: string;
  type: CreatorContentChartType;
  enrollments: number;
  interactions?: number;
  revenue: number;
  views: number;
  rating: number;
  engagementRate?: number;
}

export interface CreatorDashboardData {
  currency: string;
  timeSeries: {
    labels: string[];
    revenue: number[];
    views: number[];
    members: number[];
    enrollments: number[];
    interactions: number[];
  };
  kpis: CreatorDashboardKpi[];
  contentPerformance: CreatorDashboardContentPerformance[];
  revenueByType: Array<{ type: string; label: string; value: number; color: string }>;
  memberSources: Array<{ channel: string; label: string; value: number; color: string }>;
  communityHealth: Array<{ id: string; label: string; value: string | number; sub: string; color: string; iconKey: string }>;
}

export interface CreatorRevenueParams extends CreatorAnalyticsParams {
  contentType?: CreatorContentChartType;
  contentId?: string;
}

export interface CreatorGeographyParams extends CreatorAnalyticsParams {
  granularity?: 'country' | 'city';
}

export interface CreatorRetentionParams extends CreatorAnalyticsParams {
  period?: 'weekly' | 'monthly';
}

export interface CreatorCompareParams extends CreatorAnalyticsParams {
  compareFrom: string;
  compareTo: string;
  metric: string;
}

export type CreatorAnalyticsExportScope =
  | 'overview'
  | 'courses'
  | 'challenges'
  | 'sessions'
  | 'events'
  | 'products'
  | 'posts';

export type CreatorFunnelContentType =
  | 'course'
  | 'challenge'
  | 'session'
  | 'event'
  | 'product'
  | 'post'
  | 'community';

export interface CreatorFunnelStep {
  stepKey: string;
  stepLabel: string;
  uniqueUsers: number | null;
  events: number;
  rateFromPrev: number | null;
}

export interface CreatorFunnelDropOffSummary {
  worstStep: { stepKey: string; stepLabel: string; dropOffRate?: number; uniqueUsers?: number | null } | null;
  dropOffRate?: number;
  sampleSizeWarnings?: string[];
}

export interface CreatorFunnelResponse {
  contentMeta: {
    title?: string;
    communityId?: string;
    currency?: string;
    price?: number;
    trackingIds?: string[];
    orderIds?: string[];
  };
  funnel: CreatorFunnelStep[];
  dropOff: CreatorFunnelDropOffSummary;
  warnings?: string[];
}

export interface CreatorCourseChapterFunnelItem {
  stepId: string;
  stepTitle: string;
  sectionId: string;
  order: number;
  uniqueStarts: number;
  uniqueCompletes: number;
  completionRate: number;
  dropOffRate: number;
  isPreview?: boolean;
  isPaidChapter?: boolean;
}

export interface CreatorCourseChaptersFunnelResponse {
  contentMeta: {
    courseId: string;
    courseTitle: string;
    communityId?: string;
    totalChapters: number;
  };
  items: CreatorCourseChapterFunnelItem[];
  dropOff: { worstStep: { stepId: string; stepTitle: string; dropOffRate: number; uniqueStarts: number; uniqueCompletes: number } | null };
  warnings?: string[];
}

export interface CreatorChallengeTaskFunnelItem {
  stepId: string;
  stepTitle: string;
  order: number;
  uniqueStarts: number;
  uniqueCompletes: number;
  completionRate: number;
  dropOffRate: number;
}

export interface CreatorChallengeTasksFunnelResponse {
  contentMeta: {
    challengeId: string;
    challengeTitle: string;
    communityId?: string;
    totalTasks: number;
  };
  items: CreatorChallengeTaskFunnelItem[];
  dropOff: { worstStep: { stepId: string; stepTitle: string; dropOffRate: number; uniqueStarts: number; uniqueCompletes: number } | null };
  warnings?: string[];
}

export type CreatorInsightsConfidence = 'low' | 'med' | 'high';

export interface CreatorInsightsResponse {
  summary: string;
  topIssues: Array<{
    stepId: string;
    stepTitle: string;
    metricEvidence: string[];
    hypothesis: string;
    confidence: CreatorInsightsConfidence;
  }>;
  fixes: Array<{
    title: string;
    whyItHelps: string;
    exactCreatorAction: string;
    expectedMetricLift: string;
    risk: string;
  }>;
  rewriteSuggestions: Array<{
    target: 'intro' | 'cta' | 'structure';
    stepId: string;
    text: string;
  }>;
  experiments: Array<{
    name: string;
    variantA: string;
    variantB: string;
    successMetric: string;
    runForDays: number;
  }>;
  warnings: string[];
}

export interface CreatorAnalyticsExportParams extends CreatorAnalyticsParams {
  scope: CreatorAnalyticsExportScope;
}

export interface TunisianBankCredentials {
  rib: string;
  bankName: string;
  ownerName: string;
}

export interface BankCredentialsResponse {
  isConfigured: boolean;
  bankDetails: TunisianBankCredentials | null;
}

export interface CourseAnalyticsRange {
  from: string;
  to: string;
}

export interface CourseAnalyticsKpis {
  enrollments: number;
  revenue: number;
  views: number;
  starts: number;
  completes: number;
  completionRate: number;
  avgWatchTimeSeconds: number;
  totalWatchTimeSeconds: number;
}

export interface CourseAnalyticsRates {
  viewsToEnrollmentRate: number;
  dropOffRate: number;
  engagementScore: number;
}

export interface CourseAnalyticsDailyTrend {
  date: string;
  views: number;
  starts: number;
  completes: number;
  watchTimeSeconds: number;
}

export interface CourseAnalyticsMeta {
  completionSource: 'progression';
  timezone: string;
  currency: string;
}

export interface CourseAnalyticsResponse {
  courseId: string;
  courseTitle: string;
  range: CourseAnalyticsRange;
  kpis: CourseAnalyticsKpis;
  rates: CourseAnalyticsRates;
  dailyTrend: CourseAnalyticsDailyTrend[];
  meta: CourseAnalyticsMeta;
}

export const creatorAnalyticsApi = {
  getOverview: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/overview', params);
  },
  getDashboard: async (params?: CreatorDashboardParams): Promise<ApiSuccessResponse<CreatorDashboardData>> => {
    return apiClient.get<ApiSuccessResponse<CreatorDashboardData>>('/analytics/creator/dashboard', params);
  },
  getContentCharts: async (params?: CreatorContentChartsParams): Promise<ApiSuccessResponse<CreatorContentChartPack | { byContentType: Record<string, CreatorContentChartPack> }>> => {
    return apiClient.get<ApiSuccessResponse<CreatorContentChartPack | { byContentType: Record<string, CreatorContentChartPack> }>>('/analytics/creator/content-charts', params);
  },
  getCourses: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/courses', params);
  },
  getChallenges: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/challenges', params);
  },
  getSessions: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/sessions', params);
  },
  getEvents: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/events', params);
  },
  getProducts: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/products', params);
  },
  getPosts: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/posts', params);
  },
  getDevices: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/devices', params);
  },
  getReferrers: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/referrers', params);
  },
  getRevenue: async (params?: CreatorRevenueParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/revenue', params);
  },
  getGeography: async (params?: CreatorGeographyParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/geography', params);
  },
  getRetention: async (params?: CreatorRetentionParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/retention', params);
  },
  getCompare: async (params: CreatorCompareParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/compare', params);
  },
  getSessionQuality: async (sessionId: string, params?: Pick<CreatorAnalyticsParams, 'from' | 'to'>): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>(`/analytics/creator/sessions/${sessionId}/quality`, params);
  },
  getChallengeStreaks: async (challengeId: string, params?: Pick<CreatorAnalyticsParams, 'from' | 'to'>): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>(`/analytics/creator/challenges/${challengeId}/streaks`, params);
  },
  getWeeklyReport: async (): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/analytics/creator/weekly-report');
  },
  backfill: async (days: number = 90): Promise<ApiSuccessResponse<any>> => {
    return apiClient.post<ApiSuccessResponse<any>>(`/analytics/creator/backfill?days=${days}`, {});
  },
  getCourseAnalytics: async (
    courseId: string,
    params?: { from?: string; to?: string },
  ): Promise<ApiSuccessResponse<CourseAnalyticsResponse>> => {
    return apiClient.get<ApiSuccessResponse<CourseAnalyticsResponse>>(`/analytics/creator/course/${courseId}`, params);
  },
  exportCsv: async (params: CreatorAnalyticsExportParams): Promise<ApiSuccessResponse<{ filename: string; csv: string }>> => {
    return apiClient.get<ApiSuccessResponse<{ filename: string; csv: string }>>('/analytics/creator/export', params);
  },

  // Funnels + AI insights
  getFunnel: async (params: CreatorAnalyticsParams & { contentType: CreatorFunnelContentType; contentId: string }): Promise<ApiSuccessResponse<CreatorFunnelResponse>> => {
    return apiClient.get<ApiSuccessResponse<CreatorFunnelResponse>>('/analytics/creator/funnel', params);
  },
  getCourseChaptersFunnel: async (
    courseId: string,
    params: CreatorAnalyticsParams,
  ): Promise<ApiSuccessResponse<CreatorCourseChaptersFunnelResponse>> => {
    return apiClient.get<ApiSuccessResponse<CreatorCourseChaptersFunnelResponse>>(`/analytics/creator/course/${courseId}/chapters/funnel`, params);
  },
  getChallengeTasksFunnel: async (
    challengeId: string,
    params: CreatorAnalyticsParams,
  ): Promise<ApiSuccessResponse<CreatorChallengeTasksFunnelResponse>> => {
    return apiClient.get<ApiSuccessResponse<CreatorChallengeTasksFunnelResponse>>(`/analytics/creator/challenge/${challengeId}/tasks/funnel`, params);
  },
  generateInsights: async (payload: {
    contentType: CreatorFunnelContentType;
    contentId: string;
    from: string;
    to: string;
    communityId?: string;
    communitySlug?: string;
    focusStepId?: string;
  }): Promise<ApiSuccessResponse<{ success: true; data: CreatorInsightsResponse; cached: boolean; model?: string }>> => {
    return apiClient.post<ApiSuccessResponse<{ success: true; data: CreatorInsightsResponse; cached: boolean; model?: string }>>('/analytics/creator/insights', payload);
  },

  // Payouts
  getPayouts: async (params?: any): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/payouts', params);
  },
  getPayoutStats: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/payouts/stats', params);
  },
  getAvailableBalance: async (params?: CreatorAnalyticsParams): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>('/payouts/available-balance', params);
  },
  requestPayout: async (payload: any): Promise<ApiSuccessResponse<any>> => {
    return apiClient.post<ApiSuccessResponse<any>>('/payouts', payload);
  },
  cancelPayout: async (id: string, reason?: string): Promise<ApiSuccessResponse<any>> => {
    return apiClient.post<ApiSuccessResponse<any>>(`/payouts/${id}/cancel`, { reason });
  },
  getBankCredentials: async (): Promise<BankCredentialsResponse> => {
    return apiClient.get<BankCredentialsResponse>('/payouts/bank-credentials');
  },
  updateBankCredentials: async (payload: TunisianBankCredentials): Promise<BankCredentialsResponse> => {
    return apiClient.put<BankCredentialsResponse>('/payouts/bank-credentials', payload);
  },
};
