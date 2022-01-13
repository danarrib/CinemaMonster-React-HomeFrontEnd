import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import MainPage from './components/MainPage';
import MoviePage from './components/MoviePage';
import CinemaPage from './components/CinemaPage';
import SessionsPage from './components/SessionsPage';
import MovieGenrePage from './components/MovieGenrePage';
import UserDashboard from "./components/UserDashboard";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
          <Route path="/" exact={true} element={<MainPage />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="movie" element={<MoviePage />} >
            <Route path=":movieId" element={<MoviePage/>}></Route>
          </Route>
          <Route path="cinema" element={<CinemaPage />} >
            <Route path=":cinemaId" element={<CinemaPage/>}></Route>
          </Route>
          <Route path="sessions" element={<SessionsPage />} >
            <Route path=":cinemaId" element={<SessionsPage/>}>
              <Route path=":movieId" element={<SessionsPage/>}></Route>
            </Route>
          </Route>
          <Route path="moviegenre" element={<MovieGenrePage />} >
            <Route path=":genreId" element={<MovieGenrePage/>}></Route>
          </Route>
        </Routes>
    </BrowserRouter>
  , document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
