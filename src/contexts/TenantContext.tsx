import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useGetTenantsQuery } from '../store/api/gamesApi';

interface Tenant {
  tenantId: string;
  name: string;
}

interface TenantContextType {
  selectedTenantId: string;
  selectedTenant: Tenant | null;
  setSelectedTenantId: (tenantId: string) => void;
  tenants: Tenant[];
  isLoadingTenants: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  // Initialize selected tenant from localStorage or default to empty
  const [selectedTenantId, setSelectedTenantIdState] = useState(() => {
    const saved = localStorage.getItem('selectedTenantId');
    return saved || '';
  });

  // Fetch real tenants from API
  const { data: apiTenants = [], isLoading: isLoadingTenants } = useGetTenantsQuery();

  // Set selected tenant ID with localStorage persistence
  const setSelectedTenantId = (tenantId: string) => {
    setSelectedTenantIdState(tenantId);
    localStorage.setItem('selectedTenantId', tenantId);
  };

  // Get the selected tenant object
  const selectedTenant = apiTenants.find(tenant => tenant.tenantId === selectedTenantId) || null;

  const value: TenantContextType = {
    selectedTenantId,
    selectedTenant,
    setSelectedTenantId,
    tenants: apiTenants,
    isLoadingTenants,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

// Custom hook to use tenant context
export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export default TenantContext;
