import { useNavigate, useParams } from 'react-router-dom';

import { useEffect } from 'react';
import { useSharingToken } from './service/sharing-service';

const SharePage = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    useSharingToken(token).then(() => {
      navigate('/');
    }).catch((error) => {
      // TODO: error handling
      console.log(error);
      navigate('/');
    });
  }, []);

  return (
    <></>
  );
};

export default SharePage;
