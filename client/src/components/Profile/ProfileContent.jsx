import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../../api/authenticationAPI";
import { useQuery } from "react-query";
import Swal from "sweetalert2";

function ProfileContent() {
  const navigate = useNavigate();
  /*  const { data, isLoading, isError } = useQuery(
    'authenticateUser',
    authenticateUser,
    {
      onSuccess: (data) => {
        if (data === 'JsonWebTokenError' || data === 'TokenExpiredError') {
          navigate('/login');
        }
      },
    }
  );
  if (isError) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `Unable to communicate with the server. Please refresh the webpage.`,
      background: '#333',
      color: '#fff',
      confirmButtonColor: '#3b9893',
    });
  }

  useEffect(() => {
    authenticateUser();
  }, []);
  if (data.id) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `Unable to communicate with the server. Please refresh the webpage.`,
      background: '#333',
      color: '#fff',
      confirmButtonColor: '#3b9893',
    });
  } */
}

export default ProfileContent;
