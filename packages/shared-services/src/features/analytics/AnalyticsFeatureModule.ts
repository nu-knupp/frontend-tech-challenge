import { IFeatureModule } from '../IFeatureModule';
import { Transaction, TransactionType } from '@banking/shared-types';

/**
 * Analytics Feature Module
 * Provides financial analytics, reporting, and insights
 */
export class AnalyticsFeatureModule implements IFeatureModule {
  public readonly name = 'analytics';
  public readonly version = '1.0.0';
  public readonly description = 'Provides financial analytics, reporting, and business insights';
  public readonly dependencies: string[] = ['transactions']; // Depends on transactions module

  private initialized = false;
  private initializationTime?: Date;

  /**
   * Initialize the analytics feature module
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    console.log('Initializing Analytics Feature Module...');

    try {
      // Setup analytics calculation engines
      await this.setupCalculationEngines();

      // Setup caching for expensive calculations
      await this.setupAnalyticsCache();

      this.initialized = true;
      this.initializationTime = new Date();

      console.log('Analytics Feature Module initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Analytics Feature Module:', error);
      throw error;
    }
  }

  /**
   * Clean up the analytics feature module
   */
  async dispose(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    console.log('Disposing Analytics Feature Module...');

    try {
      // Clear analytics cache
      await this.clearAnalyticsCache();

      this.initialized = false;
      this.initializationTime = undefined;

      console.log('Analytics Feature Module disposed successfully');
    } catch (error) {
      console.error('Failed to dispose Analytics Feature Module:', error);
      throw error;
    }
  }

  /**
   * Check if the feature module is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get feature module metadata
   */
  getMetadata() {
    return {
      name: this.name,
      version: this.version,
      description: this.description,
      dependencies: this.dependencies,
      initialized: this.initialized,
      initializationTime: this.initializationTime
    };
  }

  /**
   * Get comprehensive financial summary
   */
  async getFinancialSummary(params: {
    userEmail?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    savingsRate: number;
    transactionCount: number;
    averageTransaction: number;
    largestIncome: number;
    largestExpense: number;
  }> {
    // This would integrate with the transactions module
    const transactions = await this.getTransactionsForPeriod(params);

    const incomeTransactions = transactions.filter(t => t.type === 'credit');
    const expenseTransactions = transactions.filter(t => t.type === 'debit');

    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const netIncome = totalIncome - totalExpenses;

    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;
    const averageTransaction = transactions.length > 0
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
      : 0;

    const largestIncome = incomeTransactions.length > 0
      ? Math.max(...incomeTransactions.map(t => t.amount))
      : 0;

    const largestExpense = expenseTransactions.length > 0
      ? Math.max(...expenseTransactions.map(t => t.amount))
      : 0;

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      transactionCount: transactions.length,
      averageTransaction,
      largestIncome,
      largestExpense
    };
  }

  /**
   * Get monthly spending trends
   */
  async getMonthlySpendingTrends(params: {
    userEmail?: string;
    months: number;
  }): Promise<Array<{
    month: string;
    income: number;
    expenses: number;
    netIncome: number;
    savingsRate: number;
    transactionCount: number;
  }>> {
    const trends: Array<{
      month: string;
      income: number;
      expenses: number;
      netIncome: number;
      savingsRate: number;
      transactionCount: number;
    }> = [];

    for (let i = params.months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);

      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const summary = await this.getFinancialSummary({
        userEmail: params.userEmail,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });

      trends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income: summary.totalIncome,
        expenses: summary.totalExpenses,
        netIncome: summary.netIncome,
        savingsRate: summary.savingsRate,
        transactionCount: summary.transactionCount
      });
    }

    return trends;
  }

  /**
   * Get spending by category
   */
  async getSpendingByCategory(params: {
    userEmail?: string;
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
  }): Promise<Array<{
    category: string;
    amount: number;
    percentage: number;
    transactionCount: number;
    averageAmount: number;
  }>> {
    const transactions = await this.getTransactionsForPeriod(params);

    // Filter by type if specified
    const filteredTransactions = params.type
      ? transactions.filter(t => t.type === params.type)
      : transactions;

    // Group by category
    const categoryData = new Map<string, {
      amount: number;
      count: number;
      transactions: Transaction[];
    }>();

    filteredTransactions.forEach(transaction => {
      transaction.categories.forEach(category => {
        const existing = categoryData.get(category) || { amount: 0, count: 0, transactions: [] };
        existing.amount += transaction.amount;
        existing.count += 1;
        existing.transactions.push(transaction);
        categoryData.set(category, existing);
      });
    });

    const totalAmount = Array.from(categoryData.values()).reduce((sum, data) => sum + data.amount, 0);

    // Convert to result format
    return Array.from(categoryData.entries()).map(([category, data]) => ({
      category,
      amount: data.amount,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
      transactionCount: data.count,
      averageAmount: data.count > 0 ? data.amount / data.count : 0
    })).sort((a, b) => b.amount - a.amount);
  }

  /**
   * Get cash flow analysis
   */
  async getCashFlowAnalysis(params: {
    userEmail?: string;
    period: 'weekly' | 'monthly' | 'yearly';
    periods: number;
  }): Promise<{
    periods: Array<{
      period: string;
      inflow: number;
      outflow: number;
      netFlow: number;
      openingBalance: number;
      closingBalance: number;
    }>;
    averageNetFlow: number;
    volatility: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }> {
    // This would calculate cash flow over the specified periods
    const periods = await this.calculateCashFlowPeriods(params);

    const netFlows = periods.map(p => p.netFlow);
    const averageNetFlow = netFlows.reduce((sum, flow) => sum + flow, 0) / netFlows.length;

    // Calculate volatility (standard deviation)
    const variance = netFlows.reduce((sum, flow) => sum + Math.pow(flow - averageNetFlow, 2), 0) / netFlows.length;
    const volatility = Math.sqrt(variance);

    // Determine trend
    const trend = this.determineTrend(netFlows);

    return {
      periods,
      averageNetFlow,
      volatility,
      trend
    };
  }

  /**
   * Get financial insights and recommendations
   */
  async getFinancialInsights(params: {
    userEmail?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    insights: Array<{
      type: 'warning' | 'info' | 'success';
      title: string;
      description: string;
      recommendation?: string;
    }>;
    healthScore: number;
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    const summary = await this.getFinancialSummary(params);
    const monthlyTrends = await this.getMonthlySpendingTrends({
      userEmail: params.userEmail,
      months: 3
    });

    const insights: Array<{
      type: 'warning' | 'info' | 'success';
      title: string;
      description: string;
      recommendation?: string;
    }> = [];

    // Analyze savings rate
    if (summary.savingsRate < 10) {
      insights.push({
        type: 'warning',
        title: 'Low Savings Rate',
        description: `Your savings rate is ${summary.savingsRate.toFixed(1)}%, which is below the recommended 20%.`,
        recommendation: 'Consider reducing expenses or increasing income to improve your savings rate.'
      });
    } else if (summary.savingsRate >= 20) {
      insights.push({
        type: 'success',
        title: 'Excellent Savings Rate',
        description: `Your savings rate is ${summary.savingsRate.toFixed(1)}%, which is excellent!`
      });
    }

    // Analyze spending patterns
    const lastMonth = monthlyTrends[monthlyTrends.length - 1];
    const previousMonth = monthlyTrends[monthlyTrends.length - 2];

    if (lastMonth && previousMonth) {
      const expenseChange = ((lastMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100;

      if (expenseChange > 20) {
        insights.push({
          type: 'warning',
          title: 'Spending Increase Detected',
          description: `Your spending increased by ${expenseChange.toFixed(1)}% compared to last month.`,
          recommendation: 'Review your recent transactions and identify areas where you can cut back.'
        });
      }
    }

    // Analyze average transaction size
    if (summary.averageTransaction > summary.netIncome * 0.1) {
      insights.push({
        type: 'info',
        title: 'Large Average Transactions',
        description: 'Your average transaction size is relatively large compared to your income.',
        recommendation: 'Consider breaking down large expenses into smaller, more manageable ones.'
      });
    }

    // Calculate health score (0-100)
    let healthScore = 0;

    // Savings rate component (40% of score)
    healthScore += Math.min(summary.savingsRate * 2, 40); // Max 40 points at 20% savings rate

    // Income stability component (30% of score)
    const incomeStability = this.calculateIncomeStability(monthlyTrends);
    healthScore += incomeStability * 0.3;

    // Expense control component (30% of score)
    const expenseControl = this.calculateExpenseControl(monthlyTrends);
    healthScore += expenseControl * 0.3;

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (healthScore < 40) {
      riskLevel = 'high';
    } else if (healthScore < 70) {
      riskLevel = 'medium';
    }

    return {
      insights,
      healthScore: Math.round(healthScore),
      riskLevel
    };
  }

  // Private helper methods
  private async getTransactionsForPeriod(params: {
    userEmail?: string;
    startDate?: string;
    endDate?: string;
    type?: TransactionType;
  }): Promise<Transaction[]> {
    // This would integrate with the transactions module
    // For now, return empty array
    return [];
  }

  private async setupCalculationEngines(): Promise<void> {
    // Setup calculation engines for complex analytics
  }

  private async setupAnalyticsCache(): Promise<void> {
    // Setup caching for expensive calculations
  }

  private async clearAnalyticsCache(): Promise<void> {
    // Clear analytics cache
  }

  private async calculateCashFlowPeriods(params: {
    userEmail?: string;
    period: 'weekly' | 'monthly' | 'yearly';
    periods: number;
  }): Promise<Array<{
    period: string;
    inflow: number;
    outflow: number;
    netFlow: number;
    openingBalance: number;
    closingBalance: number;
  }>> {
    // This would calculate cash flow for each period
    return [];
  }

  private determineTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAverage = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
    const secondAverage = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;

    const change = (secondAverage - firstAverage) / Math.abs(firstAverage);

    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  private calculateIncomeStability(trends: any[]): number {
    if (trends.length < 2) return 50;

    const incomes = trends.map(t => t.income);
    const averageIncome = incomes.reduce((sum, income) => sum + income, 0) / incomes.length;

    const variance = incomes.reduce((sum, income) => sum + Math.pow(income - averageIncome, 2), 0) / incomes.length;
    const standardDeviation = Math.sqrt(variance);

    // Lower standard deviation means more stability
    const stability = Math.max(0, 100 - (standardDeviation / averageIncome) * 100);
    return Math.min(100, stability);
  }

  private calculateExpenseControl(trends: any[]): number {
    if (trends.length < 2) return 50;

    let controlScore = 50; // Base score

    for (let i = 1; i < trends.length; i++) {
      const previousExpense = trends[i - 1].expenses;
      const currentExpense = trends[i].expenses;

      const change = ((currentExpense - previousExpense) / previousExpense) * 100;

      // Penalize large expense increases
      if (change > 20) {
        controlScore -= 10;
      } else if (change > 10) {
        controlScore -= 5;
      } else if (change < -10) {
        controlScore += 5; // Reward expense reduction
      }
    }

    return Math.max(0, Math.min(100, controlScore));
  }
}