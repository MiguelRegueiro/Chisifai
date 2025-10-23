import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useData } from '../contexts/DataContext';

const RefreshControl = () => {
  const { refreshData, loading } = useData();

  const handleRefresh = async () => {
    await refreshData();
  };

  return (
    <Button 
      variant="outline-primary" 
      size="sm" 
      onClick={handleRefresh} 
      disabled={loading}
      style={{ marginLeft: '10px' }}
    >
      {loading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            className="me-2"
          />
          Actualizando...
        </>
      ) : (
        <>
          🔄 Actualizar
        </>
      )}
    </Button>
  );
};

export default RefreshControl;