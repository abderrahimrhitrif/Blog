import React, { useState, useEffect } from "react";
import "./Section.css";
import { Link } from 'react-router-dom';





function Section() {
    const [posts, setPosts] = useState([]);
      

    useEffect(() => {
        fetch(`https://blog-api-seven-murex.vercel.app/post`)
            .then(response => response.json())
            .then(postsData => {
                setPosts(postsData);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    if (posts.length === 0) {
        return <div>Loading...</div>;
    }

    function formatDate(post) {
        
        const createdAtDate = new Date(post.createdAt);
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
      
        const day = createdAtDate.getDate();
        const month = monthNames[createdAtDate.getMonth()];
        const year = createdAtDate.getFullYear();
      
        const formattedDate = `${day} ${month} ${year}`;
      
        return formattedDate;
      }


    return (
        <div className="section row px-lg-5 px-md-5 px-sm-3 px-2 py-2 py-lg-4 pt-5">
            <div className="main-article col-4 pe-lg-4">
                <Link to={`/post/${posts[0]._id}`}>
                    <img src={`https://firebasestorage.googleapis.com/v0/b/zenblog-8e899.appspot.com/o/${posts[0].cover}?alt=media`} alt="" className="main-image" />
                </Link>
                <p className="info text-secondary">{formatDate(posts[0])}</p>
                <Link to={`/post/${posts[0]._id}`}>
                    <h2>{posts[0].title}</h2>
                </Link>
                <p className="summary">{posts[0].summary}</p>
                <div className="autor d-flex align-items-center">
                    <h4 className="text-secondary">{posts[0].author.username}</h4>
                </div>
            </div>

            <div className="first-col col-lg-2">
                {posts.slice(1, 4).map((post, index) => (
                    <div key={post._id} className="post">
                        <Link to={`/post/${post._id}`}>
                            <img src={`https://firebasestorage.googleapis.com/v0/b/zenblog-8e899.appspot.com/o/${post.cover}?alt=media`} alt="" />
                        </Link>
                        <p className="info text-secondary">{formatDate(post)}</p>
                        <Link to={`/post/${post._id}`}>
                            <h4 className="Titles">{post.title}</h4>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="second-col col-lg-2">
                {posts.slice(4, 7).map((post, index) => (
                    <div key={post._id} className="post">
                        <Link to={`/post/${post._id}`}>
                        <img src={`https://firebasestorage.googleapis.com/v0/b/zenblog-8e899.appspot.com/o/${post.cover}?alt=media`} alt="" />
                        </Link>
                        <p className="info text-secondary">{formatDate(post)}</p>
                        <Link to={`/post/${post._id}`}>
                            <h4>{post.title}</h4>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="new col-lg-2 my-5 p">
                <table className="border border-secondary">
                    <tbody>
                        <tr className="border border-secondary">
                            <th><h2 className="p-3">Latest</h2></th>
                        </tr>
                        {posts.slice(0, 5).map((post, index) => (
                            <tr key={post._id} className="border border-secondary">
                                <td>
                                    <Link to={`/post/${post._id}`}>
                                        <h5 className="p-3">{post.title}</h5>

                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Section;
