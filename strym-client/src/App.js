import { Routes, Route, Navigate } from 'react-router-dom';
import Main from './pages/Main';
import Signin from './pages/Signin';
import { LoadScript } from '@react-google-maps/api';

function App() {
  return (
    <LoadScript
    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
    loadingElement={<div>Load...</div>}
    onError={(error) => console.error('Error loading Google Maps API:', error)}>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" />}/>
        <Route path="/signin" element={<Signin isExpired={false} />} />
        <Route path="/signout" element={<Signin isExpired={true} />} />
        <Route path="/*" element={<Main />}/> 
      </Routes>
    </LoadScript>
  );
}

export default App;