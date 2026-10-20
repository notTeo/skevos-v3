import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import LanguageSync from './i18n/LanguageSync';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Products from './pages/Products';
import Category from './pages/Category';
import Product from './pages/Product';
import Materials from './pages/Materials';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <div className="app-shell">
      <LanguageSync />
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:categoryId" element={<Category />} />
        <Route path="/product/:productId/:finishIndex" element={<Product />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <CartDrawer />
    </div>
  );
}
