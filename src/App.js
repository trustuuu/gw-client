import React from 'react';
import {BrowserRouter} from 'react-router-dom';

import {AuthContextProvider} from './component/AuthContext';
import ThemeProvider from './utils/ThemeContext';
import Layout from './pages/Layout';


function App() {
  

  return (
    <BrowserRouter>
    <ThemeProvider>
        <AuthContextProvider>
          <Layout/>
        </AuthContextProvider>
      </ThemeProvider>

    </BrowserRouter>
  );
}

export default App;
