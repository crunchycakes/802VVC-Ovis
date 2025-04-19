import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const allMets = ["bytes", "PSNR", "seconds"]

function App() {
  const [message, setMessage] = useState('') // REMOVE THIS FOR DEPLOY
  const [chartData, setChartData] = useState([]);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedMet, selectMet] = useState('PSNR');

  useEffect(() => {
    axios.get('api/chart-data')
      .then(res => setChartData(res.data))
      .catch(err => console.error(err))
      axios.get('api/message') // REMOVE THIS FOR DEPLOY
      .then(res => setMessage(res.data))
      .catch(err => console.error(err))
  }, []);

  const colorway = (key: string) => {
    const colors = {
      bytes: '#b30000',
      PSNR: '#5900de',
      seconds: '#e0e0e0'
    }
    return colors[key as keyof typeof colors];
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Quantization Curve</h1>

      <div className="flex gap-4 mb-4">
        {allMets.map((metric) => (
          <label key={metric} className="flex items-center gap-2">
            <input
              type="radio"
              name="metric"
              value={metric}
              checked={selectedMet === metric}
              onChange={() => selectMet(metric)}
            />
            {metric}
          </label>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}
          onMouseMove={(state) => {
            if (state?.activePayload?.[0]) {
              setHoveredPoint(state.activePayload[0].payload);
            }
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="qp" label={{ value: 'Quantization Parameter', position: 'insideBottom', offset: -5 }}/>
          <YAxis label={{angle: -90, position: 'insideLeft'}}/>
          <Tooltip />
          <Line type="monotone" dataKey={selectedMet} stroke={colorway(selectedMet)} activeDot={{ r: 8 }} />
          
        </LineChart>
      </ResponsiveContainer>
      <img src={hoveredPoint ? `http://localhost:5000/api/image/imgqp${hoveredPoint['qp']}.png` : 'http://localhost:5000/api/image/imgqp0.png'}
        className='flex mt-4 rounded shadow'
      />
    </div>
  )
}

export default App
