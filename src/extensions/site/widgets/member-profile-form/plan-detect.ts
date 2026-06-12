export type PlanType = 'individual' | 'business' | 'organization' | 'none';

export interface PlanConfig {
  planType: PlanType;
  descriptionLabel: string;
  wordLimit: number;
  imageLabel: string;
}

const PLAN_MAP: Record<string, PlanType> = {
  'individual service providers': 'individual',
  'independent businesses': 'business',
  'larger organizations and institutions': 'organization',
};

export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  individual: { planType: 'individual', descriptionLabel: 'Bio', wordLimit: 75, imageLabel: 'Headshot' },
  business: { planType: 'business', descriptionLabel: 'Mission / Bio', wordLimit: 300, imageLabel: 'Logo' },
  organization: { planType: 'organization', descriptionLabel: 'About Your Organization', wordLimit: 300, imageLabel: 'Logo' },
  none: { planType: 'none', descriptionLabel: 'Description / Bio', wordLimit: 300, imageLabel: 'Image URL' },
};

export async function detectPlan(): Promise<PlanConfig> {
  try {
    const { orders } = await import('@wix/pricing-plans');
    const result = await orders.memberListOrders();
    console.log('[Plan Detect] All orders:', JSON.stringify(result.orders?.map(o => ({ planName: o.planName, status: o.status, planId: o.planId }))));
    const order = result.orders?.find(o => o.status === 'ACTIVE' || o.status === 'PENDING');
    if (!order) {
      console.log('[Plan Detect] No active/pending orders found');
      return PLAN_CONFIGS.none;
    }
    const planName = (order.planName || '').toLowerCase().trim();
    console.log('[Plan Detect] Matched order plan name:', planName, 'status:', order.status);
    const planType = PLAN_MAP[planName];
    if (!planType) {
      console.log('[Plan Detect] Unknown plan:', planName);
      return PLAN_CONFIGS.none;
    }
    return PLAN_CONFIGS[planType];
  } catch (e: any) {
    console.log('[Plan Detect] Failed:', e.message, e.details || '');
    return PLAN_CONFIGS.none;
  }
}
