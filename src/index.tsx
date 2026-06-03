import React from 'react';
import { createRoot } from 'react-dom/client';
import "./styles/App.css"

import { BrowserRouter } from "react-router-dom";
import { MainRoutes } from './Routes';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <MainRoutes/>
    </BrowserRouter>
  </React.StrictMode>
);
