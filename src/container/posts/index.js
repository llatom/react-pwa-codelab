import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Link } from "react-router-dom";
import clientFetch from '../../util/fetch'
import { connect } from "react-redux";
import businessImg from "../../assets/home/business.jpg"
import Mp3 from "../../assets/starSky.mp3";
import "./index.less";

function ListPageContainer(props) {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = () => {
    clientFetch({
      url: 'https://progwebnews-app.azurewebsites.net/ghost/api/v3/content/posts/?key=7bcf4d0fbd1d518e7da4c74465'
    }).then(res=>{
      if(res && res.posts && res.posts.length>0){
        setPosts(res.posts)
      }else{
        console.warn('获取post接口失败')
      }
    })
  }

  return (
    <div className="page-list">
      <header>
        <ul className="navbar">
          <Link to={`/list`}>Home</Link>
          <Link to={`/posts`}>Posts</Link>
        </ul>
      </header>
      <article>
        <h1>Posts</h1>
        <section className="posts"> 
          {posts.length > 0 && posts.map((post, index) =>
          <div className="post-card">
            <div className="post-pic">
              <img src={post.feature_image} />
            </div>
            <div className="post-info">
              {post.title}
            </div>
          </div>
          )}
        </section>
      </article>
      <section>
        <div className="right column">
          <p className="content">
            I love cheese, especially manchego swiss. ☺ Fromage queso jarlsberg cheesy
          </p>
        </div>
      </section>
      <footer>
        <a href="#" className="footer-link">Twitter</a>
        <a href="#" className="footer-link">Facebook</a>
        <a href="#" className="footer-link">Google+</a>
        <a href="#" className="footer-link">Digg</a>
      </footer>

    </div>
  );
}

export default connect(
  (state) => ({}),
  (dispatch) => ({
    actions: {},
  })
)(ListPageContainer);

