import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="container page" style={{ textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
      <div className="form-card">
        <div style={{ color: '#16a34a', margin: '0 auto 16px', display: 'flex', justifyContent: 'center' }}>
          <CheckCircle size={64} />
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>Order Placed Successfully!</h1>
        <p style={{ color: '#6b7280', fontSize: '15px', marginBottom: '24px' }}>
          Thank you for ordering with WILDTRAIL. Your technical gear is being packed and prepared for dispatch.
        </p>

        <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>Order Reference ID</div>
          <div style={{ fontSize: '16px', fontWeight: '700', wordBreak: 'break-all' }}>{id}</div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '6px' }}>Status: Placed / Confirmed</div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn btn-primary">
            <Package size={16} /> View in My Dashboard
          </Link>
          <Link to="/shop" className="btn btn-outline">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
