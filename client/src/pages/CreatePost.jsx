import ReactQuill from "react-quill";
import React from "react"
import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import "./CreatePost.css";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false); // Change 'false' to false (boolean).
  const {id} = useParams();

  async function createNewPost(ev) {
    ev.preventDefault();

    if (typeof FormData !== 'undefined' && files && files.length > 0) {
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('file', files[0]);

      try {
        const response = await fetch(`https://blog-api-seven-murex.vercel.app/post`, {
          method: 'POST',
          body: data,
          credentials: 'include',
        });

        console.log(await response.json());

        if (response.ok) {
          setRedirect(true);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('No file selected');
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
    return <Navigate to={'/'} />;
  }

  return (
    <form className="mt-3 px-lg-5 px-md-5 px-sm-3 px-2 py-2 py-lg-4" onSubmit={createNewPost}>
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
      <button className="mt-4">Create post</button>
    </form>
  );
}
