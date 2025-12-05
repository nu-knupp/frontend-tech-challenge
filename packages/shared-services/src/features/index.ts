// Feature module interfaces
export * from './IFeatureModule';
export * from './FeatureModuleRegistry';

// Feature modules
export * from './transactions/TransactionFeatureModule';
export * from './auth/AuthFeatureModule';
export * from './analytics/AnalyticsFeatureModule';

// Registry instance
export { featureModuleRegistry } from './FeatureModuleRegistry';