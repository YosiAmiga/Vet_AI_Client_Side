import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import PropTypes from 'prop-types';
import { SERVER_IP } from '../App';

const DynamicDataTable = ({ endpoint }) => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(SERVER_IP + endpoint);
        console.log('response', response.data);
        setTableData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  const downloadAsCsv = () => {
    const csvData = [
      Object.keys(tableData[0]), // Extract column names from the first row
      ...tableData.map(row => Object.values(row)),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Remove the link element after download
  };

  const generateColumns = () => {
    if (tableData.length === 0) return [];

    const firstRow = tableData[0];
    return Object.keys(firstRow).map(key => ({
      name: key,
      selector: row => row[key],
      sortable: true
    }));
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading data...</p>
      ) : tableData && tableData.length > 0 ? (
        <>
          <DataTable
            title="Table Data"
            columns={generateColumns()}
            data={tableData}
            pagination
            highlightOnHover
            responsive
            noHeader
          />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="csv-button" onClick={downloadAsCsv}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M4 4h12v2h-12zm0 4h12v2h-12zm0 4h12v2h-12zm0 4h12v2h-12zm16-14v16l-8 4v-20l8 4zm-10 2h-2v-2h2zm4 0h-2v-2h2zm0 4h-2v-2h2zm0 4h-2v-2h2z" />
            </svg>
          </button>
        </div>

        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

DynamicDataTable.propTypes = {
  endpoint: PropTypes.string.isRequired,
};

export default DynamicDataTable;
