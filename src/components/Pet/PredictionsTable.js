import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import PropTypes from 'prop-types';
import { SERVER_IP } from '../App';

const columns = [
    {
      name: 'ID',
      selector: row => row.pred_id,
      sortable: true,
    },
    {
      name: 'Owner Email',
      selector: row => row.owner_mail,
      sortable: true,
    },
    {
      name: 'Prediction Type',
      selector: row => row.pred_type_name,
      sortable: true,
    },
    {
      name: 'Timestamp',
      selector: row => row.timestamp,
      sortable: true,
    },
  ];
  

const PredictionsTable = ({ petId }) => {
  const [predictions, setPredictions] = useState([]);
    console.log('petId in PredictionsTable', petId);
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.post(SERVER_IP + ':5000/get-pet-history',{petId});
        console.log('response', response.data);
        setPredictions(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPredictions();
  }, [petId]);

  return (
    <DataTable
      title="Pet History"
      columns={columns}
      data={predictions}
      pagination
      highlightOnHover
      responsive
      noHeader
    />
  );
};

PredictionsTable.propTypes = {
  petId: PropTypes.number.isRequired,
};

export default PredictionsTable;
