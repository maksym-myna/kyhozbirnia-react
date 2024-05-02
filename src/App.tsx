import { useState, useContext, useEffect } from 'react';

import './App.css';
import Home from "./pages/Home";
import Works from "./pages/Works";
import Authors from "./pages/Authors";
import AuthorByName from "./pages/Authors/AuthorByName";
import Publishers from "./pages/Publishers";
import PublisherByName from "./pages/Publishers/PublisherByName";
import Subjects from "./pages/Subjects";
import SubjectByName from "./pages/Subjects/SubjectByName";
import OAauthRedirectHandler from "./pages/OAauthRedirectHandler";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import WorkByIsbn from "./pages/WorkByIsbn";
import NoPage from "./pages/NoPage";
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext, UserState, unauthorizedUser } from './contexts/AuthContext';
import { SnackBarContext, defaultSnackBar, SnackBarState } from './contexts/SnackBarContext';
import axios from 'axios';
import { serverURL } from './config';
import { Alert, Snackbar } from '@mui/material';


function App() {
  const [user, setUser] = useState<UserState>(unauthorizedUser);
  user.fetchUser = () => {
    axios.get(`${serverURL}/users/`, { withCredentials: true }).then(response => setUser({ ...response.data }));
  }

  const [snack, setSnackBar] = useState<SnackBarState>(defaultSnackBar);
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBar(prev => ({ ...prev, open: false }));
  };

  return (
    <AuthContext.Provider value={{ ...user, setUser }}>
      <SnackBarContext.Provider value={{ ...snack, setSnackBar }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="works" element={<Works />} />
            <Route path="works/isbn/:isbn" element={<WorkByIsbn />} />
            <Route path="authors" element={<Authors />} />
            <Route path="authors/:name" element={<AuthorByName />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="subjects/:name" element={<SubjectByName />} />
            <Route path="publishers" element={<Publishers />} />
            <Route path="publishers/:name" element={<PublisherByName />} />
            <Route path="oauth2/redirect" element={<OAauthRedirectHandler />} />
            <Route path="login" element={<PrivateRoute requiredRole='UNAUTHORIZED' path="login" element={<Profile />} />} />
            <Route path="profile" element={<PrivateRoute requiredRole='USER' path="profile" element={<Profile />} />} />
            <Route path="profile/:userId" element={<PrivateRoute requiredRole='ADMIN' path="profile" element={<Profile />} />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter >
        <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={snack.open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={snack.severity} variant="outlined" sx={{ background: "var(--primary-color)", width: '125%', maxWidth: "75vw" }}>
            {snack.message}
          </Alert>
        </Snackbar>
      </SnackBarContext.Provider>
    </AuthContext.Provider >
  );
}

export default App;