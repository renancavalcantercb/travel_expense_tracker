import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './components/loginForm';
import ExpensesTable from './components/ExpensesTable';
import Navbar from './components/NavBar';

function App() {
  return (
      <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            pauseOnHover={false}
            closeOnClick
            draggable
          />
          <Navbar />

          <Routes>
            <Route path="/" element={<ExpensesTable />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/expenses" element={<ExpensesTable />} />
          </Routes>

      </BrowserRouter>
  );
}


export default App;
