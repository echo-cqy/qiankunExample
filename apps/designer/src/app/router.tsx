import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Designer from '../pages/designer';

interface RouterProps {
  basename?: string;
}

const Router: React.FC<RouterProps> = ({ basename }) => {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Designer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
