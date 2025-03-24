
import React, {useEffect, useState} from 'react';
import api from '../services/api';


function AboutPage() {
  
    const [message, setMessage] = useState('');
    useEffect(() => {
      api.get('/test/hello').then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error query', error);

      });
    }, []);
    
    return (
      <div>
        <h1>Backend answer:</h1>
        <p>{message}</p>
      </div>
    );
    
    
};

export default AboutPage;
