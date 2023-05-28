import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { SERVER_IP } from '../App';
import Plot from 'react-plotly.js';

const AdminPlots = () => {
  const [adminAnalytics, setAdminAnalytics] = useState(null);

  useEffect(() => {
    const fetchAdminAnalytics = async () => {
      try {
        const response = await axios.post(SERVER_IP + ':5000/get-admin-analytics', {});
        console.log('AdminPlots analytics response', response.data);
        setAdminAnalytics(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAdminAnalytics();
  }, []);

  return (
    <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
      <Plot
        data={[
          {
            x: adminAnalytics ? adminAnalytics.pet_prediction_types.map((item) => item[0]) : [],
            y: adminAnalytics ? adminAnalytics.pet_prediction_types.map((item) => item[1]) : [],
            type: 'bar',
            marker: { color: 'green' },
          },
        ]}
        layout={{ title: 'Pet Prediction Types', width: 320, height: 240, margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 } }}
      />
      <Plot
        data={[
          {
            x: adminAnalytics ? adminAnalytics.user_pet_count.map((item) => item[0]) : [],
            y: adminAnalytics ? adminAnalytics.user_pet_count.map((item) => item[1]) : [],
            type: 'bar',
            marker: { color: 'purple' },
          },
        ]}
        layout={{ title: 'User Pet Count', width: 320, height: 240, margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 } }}
      />
      <Plot
        data={[
          {
            x: adminAnalytics ? adminAnalytics.pet_types_count.map((item) => item[0]) : [],
            y: adminAnalytics ? adminAnalytics.pet_types_count.map((item) => item[1]) : [],
            type: 'bar',
            marker: { color: 'red' },
          },
        ]}
        layout={{ title: 'Pet Types Count', width: 320, height: 240, margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 } }}
      />
      <Plot
        data={[
          {
            x: adminAnalytics ? adminAnalytics.predictions_by_users.map((item) => item[0]) : [],
            y: adminAnalytics ? adminAnalytics.predictions_by_users.map((item) => item[1]) : [],
            type: 'bar',
            marker: { color: 'blue' },
          },
        ]}
        layout={{ title: 'Predictions by Users', width: 320, height: 240, margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 } }}
      />
    </div>
  );
};


export default AdminPlots;
