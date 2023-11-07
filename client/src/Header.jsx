import { Link, Navigate, useNavigate } from 'react-router-dom';
import './Header.css';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';


function Header() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [redirect, setRedirect ] = useState(false);
  const {setUserInfo, userInfo} = useContext(UserContext);

  useEffect(() => {
    const apiUrl = `${process.env.API_URL}/profile`;

    

    fetch(apiUrl, {
      method: 'GET',
      credentials: 'include', 
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setUserInfo(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, []);

    function logout() {
      fetch(`${process.env.API_URL}/logout`, {
        credentials: 'include',
        method: 'GET',
      });
      setUserInfo({});
      setRedirect(true);

      
    }
    useEffect(() => {
      if (redirect) {
        navigate('/');
        setRedirect(false);
      }
    }, [redirect, navigate]);


  

  return (
    <header >
      <div className='fixed d-flex justify-content-between align-items-center mx-auto text-dark px-lg-5 px-md-5 px-sm-3 px-2 py-2 py-lg-4'>
      <Link to="/" className='logo fs-3 fw-bold user-select-none'>Zen</Link>
      <nav className='nav-menu'>
        
        
        {Object.keys(userInfo).length > 0 ? (
          <>
          <Link className='ps-3' to="/create-post">Create</Link>
          <a onClick={logout} className='ps-3'>Logout</a>
          </>
        ) : (
          <Link to="/login" className='ps-3'>Sign in</Link>
        )}
        <Link to="/contact" className="ps-3">
      Contact
      </Link>

      </nav>
      <a className='d-flex align-center pt-1'>
      {Object.keys(userInfo).length > 0  ?(
        <>
        <div> <h4>{userInfo.username}</h4> </div>
        </>
      ) : (
        <div>Not signed in</div>
      )}<span className="material-symbols-outlined" >person</span></a>
      
      
      </div>
    </header>
  );
}

export default Header;