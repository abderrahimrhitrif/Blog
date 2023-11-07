import React, { useEffect, useState, useMemo, useContext } from "react";
import { useParams } from "react-router-dom";
import "./Post.css";
import "../Section.css";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

export default function Post() {
    const [posts, setPosts] = useState([]);
    const [postInfo, setPostInfo] = useState(null);
    const { id } = useParams();
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        fetch('https://blog-api-seven-murex.vercel.app/post/')
            .then(response => response.json())
            .then(postsData => {
                setPosts(postsData);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, [id]);

    useEffect(() => {
        fetch(`https://blog-api-seven-murex.vercel.app/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                });
            });
    }, [id]);

    const randomPosts = useMemo(() => {

        const shuffledPosts = [...posts].sort(() => 0.5 - Math.random());

        return shuffledPosts.slice(0, 6).filter(post => post._id !== id);;
    }, [posts]);

    
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

    if (posts.length === 0 || postInfo === null) {
        return <div>Loading...</div>;
    }
    if (!postInfo) return '';

    return (
        <div className="section row px-lg-5 px-md-5 px-sm-3 px-2 py-2 py-lg-4 ">
            <div className="d-felx col-lg-9 pe-3 main-post mt-4">
                <h2 className="title">{postInfo.title}</h2>
                <p className="text-secondary main-info">
                    {formatDate(postInfo)} • By {postInfo.author.username}
                </p>
                {userInfo && userInfo.id === postInfo.author._id && (
                    <div className="mx-auto d-flex col-lg">
                        <Link to={`/edit/${postInfo._id}`} className="edit btn btn-primary mx-auto px-4">
                            Edit
                        </Link>
                    </div>
                )}

                <Link to={`/post/${id}`}>
                    <img className="mx-auto post-image" src={`https://firebasestorage.googleapis.com/v0/b/zenblog-8e899.appspot.com/o/${postInfo.cover}?alt=media`} alt="" />
                </Link>

                <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
            </div>
            <div className="side col mt-5 ">
                <h2 className="p-3">You might also like</h2>

                {randomPosts.map((post, index) => (
                    <div className="post" key={post._id}>
                        <Link to={`/post/${post._id}`}>
                        <img src={`https://firebasestorage.googleapis.com/v0/b/zenblog-8e899.appspot.com/o/${post.cover}?alt=media`} alt=""  />
                        </Link>
                        <p className="info text-secondary">{formatDate(post)}</p>
                        <Link to={`/post/${post._id}`}>
                            <h4 className="Titles">{post.title}</h4>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
