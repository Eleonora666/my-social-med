import React, { useState, useEffect } from 'react';
import Profile from "../../elements/profile/Profile";
import Post from "../../elements/post/Post";
import './feed.scss';
import User from "../../elements/user/User";
import Weather from "../../elements/weather/Weather";
import ScrollUp from '../../elements/scroll/ScrollUp';
const Feed = () => {


  return (
    <div className="Home">
      <section className="row">
        <Profile />
        <Post />
        <div className="col-4">
          <User />
          <Weather />
        </div>
      </section>
    <ScrollUp/>
    </div>
  );
};

export default Feed;
