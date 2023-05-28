import React, { useEffect, useState } from 'react';
import PetPlot from '../Pet/PetPlot';
import { Card, Button, Modal, Tab, Tabs } from 'react-bootstrap';
import axios from 'axios';
import { SERVER_IP } from '../App';
import AdminPlots from './AdminPlots';
import PredictionsTable from '../Pet/PredictionsTable';
import DynamicDataTable from './DynamicDataTable';

function AdminDashboard({ onLogout }) {
  const allPetsEndpoint = ':5000/get-all-pets';
  const allPredictionsEndpoint = ':5000/get-all-predictions';

  return (
    <div className="admin-dashboard-container">
      <Card className="admin-card">
        <Tabs defaultActiveKey="plot" id="pet-tabs">
          <Tab eventKey="plot" title="Analytics">
            {/* Render the AdminPlots component */}
            {/* Replace AdminPlots with your actual component */}
            <AdminPlots />
          </Tab>
          <Tab eventKey="allPets" title="All Pets">
            {/* Render DynamicDataTable with the 'get-all-pets' endpoint */}
            <DynamicDataTable endpoint={allPetsEndpoint} />
          </Tab>
          <Tab eventKey="allPredictions" title="All Predictions">
            {/* Render DynamicDataTable with the 'get-all-predictions' endpoint */}
            <DynamicDataTable endpoint={allPredictionsEndpoint}  />
          </Tab>
        </Tabs>
        <button className="Logout-button" onClick={onLogout}>Logout</button>
      </Card>
    </div>
  );
}

export default AdminDashboard;

