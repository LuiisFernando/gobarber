import React from 'react';
import { useSelector } from 'react-redux';

import createRouter from './routes';

export default function App() {
  // useSelect to listen the attribute signed when becomes true, createRouter is called and recreate routes
  const signed = useSelector(state => state.auth.signed);

  const Routes = createRouter(signed);

  return <Routes />;
}
