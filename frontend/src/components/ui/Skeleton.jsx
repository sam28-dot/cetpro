/**
 * Skeleton.jsx — Loading skeleton components
 */

import React from 'react';

export const Skeleton = ({ width, height, style = {}, className = '' }) => (
  <div
    className={`skeleton ${className}`}
    style={{ width: width || '100%', height: height || 16, ...style }}
  />
);

export const CardSkeleton = ({ height = 280 }) => (
  <div className="card skeleton" style={{ height, borderRadius: 'var(--r)' }} />
);

export const TextSkeleton = ({ lines = 3, gap = 8 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} height={14} width={i === lines - 1 ? '60%' : '100%'} />
    ))}
  </div>
);

export const TableRowSkeleton = ({ cols = 4 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} style={{ padding: '12px 16px' }}>
        <Skeleton height={14} width={i === 0 ? '80%' : '60%'} />
      </td>
    ))}
  </tr>
);

export const ProfileSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Skeleton width={60} height={60} style={{ borderRadius: '50%' }} />
      <div style={{ flex: 1 }}>
        <Skeleton height={20} width="40%" style={{ marginBottom: 8 }} />
        <Skeleton height={14} width="60%" />
      </div>
    </div>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
        <Skeleton height={14} width="25%" />
        <Skeleton height={14} width="35%" />
      </div>
    ))}
  </div>
);

export default Skeleton;
