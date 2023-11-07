import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import './First.css';

function First() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.API_URL}/post`)
      .then((response) => response.json())
      .then((postsData) => {
        const shuffledPosts = postsData.sort(() => 0.5 - Math.random());
        const randomPosts = shuffledPosts.slice(0, 5);
        setPosts(randomPosts);
      })
      .catch((error) => {
        console.error('Error fetching random posts:', error);
      });
  }, []);

  if (posts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mx-auto text-dark px-lg-5 px-md-5 px-sm-3 px-2 mb-lg-5 pb-lg-5 pt-lg-4 mt-lg-4 pt-2 mt-2'>
      <Carousel className='carousel'>
        {posts.map((post, index) => (
          <Carousel.Item key={post._id}>
            <Link to={`/post/${post._id}`}>
              <img
                className="car w-100 img-fluid"
                src={`https://firebasestorage.googleapis.com/v0/b/zenblog-8e899.appspot.com/o/${post.cover}?alt=media`}
                alt={`Slide ${index}`}
              />
            </Link>
            <Carousel.Caption>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default First;
