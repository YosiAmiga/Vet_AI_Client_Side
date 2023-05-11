import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import PropTypes from 'prop-types';
import { SERVER_IP } from '../App';import Plot from 'react-plotly.js';

const PetPlot = ({ petId }) => {
    const [predictionDistribution, setPredictionDistribution] = useState([]);
    useEffect(() => {
        const fetchDistribution = async () => {
          try {
            const response = await axios.post(SERVER_IP + ':5000/get-prediction-distribution',{petId});
            console.log('PetPlot response', response.data);
            setPredictionDistribution(response.data);
          } catch (err) {
            console.error(err);
          }
        };
    
        fetchDistribution();
      }, [petId]);

    const emotionCount = new Map();
    const emotionChange = predictionDistribution.map((item, index) => {
        const [emotion, time] = item;
        emotionCount.set(emotion, (emotionCount.get(emotion) || 0) + 1);
        return { x: new Date(time), y: index, name: emotion };  // index as y to represent change over time
    });
    const pieData = Array.from(emotionCount).map(([emotion, count]) => ({ emotion, count }));
    const scatterData = emotionChange;

    //Plots data
    const pieChartData = [{
        type: 'pie',
        labels: pieData.map(item => item.emotion),
        values: pieData.map(item => item.count),
    }];

    const scatterPlotData = [{
        type: 'scatter',
        mode: 'lines+points',
        x: scatterData.map(item => item.x),
        y: scatterData.map(item => item.y),
        text: scatterData.map(item => item.name),
        marker: { size: 10 },
    }];

    // Dummy data
    const xData = ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01'];
    const yData1 = [1, 3, 2, 4, 3];
    const yData2 = [3, 2, 4, 1, 3];
    const yData3 = [4, 1, 2, 3, 2];

    return (
        <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
            <Plot
                data={pieChartData}
                layout={{ title: 'Emotion Distribution' , width: 320, height: 240,margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 }}}
            />
            <Plot
                data={scatterPlotData}
                layout={{ title: 'Emotion Changes Over Time', xaxis: { title: 'Time' }, yaxis: { title: 'Index' } , width: 320, height: 240,margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 }}}
            />
            <Plot
                data={[
                    {
                        x: xData,
                        y: yData3,
                        type: 'scatter',
                        mode: 'lines+points',
                        marker: { color: 'red' },
                    },
                ]}
                layout={{ width: 320, height: 240, title: 'Pet - Plot 3', margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 } }}
            />
        </div>
    );
};

export default PetPlot;
