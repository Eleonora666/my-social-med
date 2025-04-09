import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProfile from "../components/elements/userProfile/UserProfile";
import Feed from "./pages/feed/Feed";
import MyProfile from "./pages/myProfile/MyProfile";
import HackerAuth from "./pages/Auth/Auth"
import './app.scss';
import Search from "./pages/search/Search";
import EditProfile from "./elements/editProfile/EditProfile"
import Followings from "./pages/follow/Followings";
import Followers from "./pages/follow/Followers";
import Navigation from "./elements/nav/Nav"; 
import { Outlet } from 'react-router-dom';
import Footer from "./elements/footer/Footer"; 
import CreatePost from "./elements/createPost/CreatePost"
import Tic from './pages/games/tic/Tic';
import GamePage from "./pages/games/GamePage";
import Puzzle from "./pages/games/puzzle/Puzzle";
import Snake from "./pages/games/snake/Snake";


const Layout = () => (
  <>
    <Navigation />
    <Outlet />
    <Footer />
  </>
);

const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HackerAuth />} />
        <Route element={<Layout />}>
          <Route path='/feed' element={<Feed />} />
          <Route path='/followings' element={<Followings />} />
          <Route path='/followers' element={<Followers />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path='/myProfile' element={<MyProfile />} />
          <Route path='/search' element={<Search />} />
          <Route path='/editProfile' element={<EditProfile />} />
          <Route path='/createPost' element={<CreatePost />} />
          <Route path='/gamepage' element={<GamePage />} />
          <Route path="/tic" element={<Tic />} />
          <Route path="/puzzle" element={<Puzzle />} />
          <Route path="/snake" element={<Snake />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
