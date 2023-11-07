import ReactQuill from "react-quill";
import { useState, useEffect, useContext} from "react";
import 'react-quill/dist/quill.snow.css';
import "./CreatePost.css";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";



export default function Edit() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);
    const [redirect, setRedirect] = useState('');
    const [postInfo, setPostInfo] = useState(null);
    const {id} = useParams();
    const {userInfo} = useContext(UserContext);

    useEffect(()=>{
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => {
                response.json().then(postInfo =>{
                    setPostInfo(postInfo);
                    setTitle(postInfo.title);
                    setSummary(postInfo.summary);
                    setContent(postInfo.content)


                    
                })
            })
    }, []);

    async function updatePost(ev){
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if(files?.[0]){
            data.set('file', files?.[0]);
        }
        const response = await fetch('http://localhost:4000/post', {
            method: 'PUT',
            body: data,
            credentials:'include',

        });
        if (response.ok){
            setRedirect(true);
        }
    }

    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          ['link', 'image'],
          ['clean']
        ]
      };
    
      const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ];
    

      if (redirect) {
        return <Navigate to={'/post/'+id} />;
      }
    return (

        <form className="mt-3 px-lg-5 px-md-5 px-sm-3 px-2 py-2 py-lg-4" onSubmit={updatePost}>
            <div className="row">
                <div>
                    <input className="mb-4" type="text" placeholder={'Title'} value={title} onChange={ev => setTitle(ev.target.value)} />
                </div>
                <div>
                    <input className="mb-4" type="text" placeholder={'Summary'} value={summary} onChange={ev => setSummary(ev.target.value)} />
                </div>
            </div>
            <input className="mb-4" type="file" name="" id="" onChange={ev => setFiles(ev.target.files)} />
            <ReactQuill value={content} modules={modules} formats={formats} onChange={newValue => setContent(newValue)} />
            <button className="mt-4">Update post</button>
        </form>
    )
}