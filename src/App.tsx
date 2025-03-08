import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProductComparison = lazy(() => import('./pages/ProductComparison'));
const PriceHistory = lazy(() => import('./pages/PriceHistory'));
const Alerts = lazy(() => import('./pages/Alerts'));
const SellerAnalysis = lazy(() => import('./pages/SellerAnalysis'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<ProductComparison />} />
            <Route path="/historial-precios" element={<PriceHistory />} />
            <Route path="/alertas" element={<Alerts />} />
            <Route path="/sellers" element={<SellerAnalysis />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
