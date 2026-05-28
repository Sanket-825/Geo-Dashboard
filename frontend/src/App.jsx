import React from 'react'
import Dashboard from './pages/Dashboard'
import { useGeoData } from "./hooks/useGeoData";

const App = () => {

  const { data } = useGeoData();

  return (
    <div>
      <Dashboard data={data} />
    </div>
  )
}

export default App