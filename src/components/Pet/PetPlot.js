import React from 'react';
import Plot from 'react-plotly.js';

const PetPlot = ({ petId }) => {
    // Dummy data
    const xData = ['2023-01-01', '2023-02-01', '2023-03-01', '2023-04-01', '2023-05-01'];
    const yData1 = [1, 3, 2, 4, 3];
    const yData2 = [3, 2, 4, 1, 3];
    const yData3 = [4, 1, 2, 3, 2];

    return (
        <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
            <Plot
                data={[
                    {
                        x: xData,
                        y: yData1,
                        type: 'scatter',
                        mode: 'lines+points',
                        marker: { color: 'blue' },
                    },
                ]}
                layout={{ width: 320, height: 240, title: 'Pet - Plot 1', margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 } }}
            />
            <Plot
                data={[
                    {
                        x: xData,
                        y: yData2,
                        type: 'scatter',
                        mode: 'lines+points',
                        marker: { color: 'green' },
                    },
                ]}
                layout={{ width: 320, height: 240, title: 'Pet - Plot 2', margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 } }}
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
