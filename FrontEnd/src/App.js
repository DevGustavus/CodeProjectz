// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Nav/Header'; // Importa o componente de cabeçalho
import Sidebar from './Nav/Sidebar'; 
import LoginPage from './Login/LoginPage';
import SignUpPage from './Login/SignUpPage';
import HomePage from './Home/HomePage'; // Importa a página inicial
import AddScreen from './AddScreen/AddScreen';
import ViewScreen from './ViewScreen/ViewScreen';
import ProfileScreen from './ProfileScreen/ProfileScreen';
import EditProfileScreen from './ProfileScreen/EditProfileScreen';
import SearchScreen from './SearchScreen/SearchScreen';
import TutorialScreen from './TutorialScreen/TutorialScreen';


function App() {
  return (
    <Router>
      <div>
        <Header /> {/* Renderiza o cabeçalho em todas as páginas */}
        <Sidebar /> {/* Renderiza a barra lateral */}
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* Rota para a página inicial */}
          <Route path="/signup" element={<SignUpPage />} /> {/* Rota para a página de cadastro */}
          <Route path="/home" element={<HomePage />} /> {/* Rota para a página de login */}
          <Route path="/add" element={<AddScreen />} /> {/* Rota para a página de novo curso/projeto */}
          <Route path="/view/:artigoID" element={<ViewScreen />} /> {/* Rota para a página de novo curso/projeto */}
          <Route path="/profile" element={<ProfileScreen />} /> {/* Rota para a página de novo curso/projeto */}
          <Route path="/editprofile" element={<EditProfileScreen />} />
          <Route path='/search' element={<SearchScreen />} />{}
          <Route path="/tutorial" element={<TutorialScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
