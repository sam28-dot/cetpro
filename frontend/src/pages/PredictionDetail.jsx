/**
 * PredictionDetail.jsx
 * Simply redirects /prediction/:id → /results/:id (same component, cleaner URL).
 * Handles the case where users access via the dashboard history links.
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PredictionDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/results/${id}`, { replace: true });
  }, [id, navigate]);

  return null;
}
