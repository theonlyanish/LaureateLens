declare module '@vercel/analytics' {
  export interface AnalyticsEvent {
    type: string;
    properties?: Record<string, any>;
    [key: string]: any;
  }

  export interface AnalyticsProps {
    beforeSend?: (event: AnalyticsEvent) => AnalyticsEvent | null;
  }

  export const Analytics: React.ComponentType<AnalyticsProps>;
} 