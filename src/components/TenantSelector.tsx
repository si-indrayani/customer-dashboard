import React from 'react';
import { Building2 } from 'lucide-react';
import { useTenant } from '../contexts/TenantContext';
import './TenantSelector.css';

const TenantSelector: React.FC = () => {
  const { selectedTenantId, setSelectedTenantId, tenants, isLoadingTenants } = useTenant();

  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTenantId(e.target.value);
  };

  return (
    <div className="tenant-selector">
      <div className="tenant-selector-content">
        <Building2 size={16} className="tenant-icon" />
        <select
          value={selectedTenantId}
          onChange={handleTenantChange}
          className="tenant-dropdown"
          disabled={isLoadingTenants}
        >
          <option value="">
            {isLoadingTenants ? 'Loading tenants...' : 'Select tenant'}
          </option>
          {tenants.map((tenant) => (
            <option key={tenant.tenantId} value={tenant.tenantId}>
              {tenant.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TenantSelector;
