export type PayoutChannel = "bKash MFS" | "Nagad MFS" | "BEFTN Bank Transfer" | "City Bank Direct";

export type SettlementStatus = "Pending Settlement" | "Disbursed" | "Processing Webhook" | "Failed";

export interface SettlementRecord {
  id: string;
  providerId: string;
  providerName: string;
  providerType: "Doctor" | "Diagnostic Lab" | "Pharmacy";
  payoutAccount: string;
  payoutChannel: PayoutChannel;
  grossEarned: number; // e.g., 25000 BDT
  commissionPercentage: number; // e.g., 12.5%
  netCommissionAmount: number; // grossEarned * commissionPercentage / 100
  netPayoutAmount: number; // grossEarned - netCommissionAmount
  completedOrdersCount: number;
  periodCycle: string;
  status: SettlementStatus;
  disbursedAt?: string;
  transactionRefHash?: string;
}

export interface FinancialSummaryMetrics {
  grossPlatformVolume: number; // ৳ GPV
  netPlatformCommission: number; // ৳ Net Commission
  pendingProviderBalances: number; // ৳ Pending Payouts
  totalDisbursedToDate: number; // ৳ Total Disbursed
  monthlyGrowthPercentage: number;
  activeProviderPayoutCount: number;
}
