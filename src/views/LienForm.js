import React, { useState, useEffect } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import LienForm from "../components/LienForm";
import { useHistory } from 'react-router-dom';


export const LienFormComponent = () => {

  const {user} = useAuth0();
  const history= useHistory();



  useEffect(() => {
  }, []);

  return (
    <>
      <div className="mb-5">

        <h1>Lien Form</h1>
        <p className="lead">

        </p>

        <LienForm user={user} history={history} />

      </div>

    </>
  );
};

export default withAuthenticationRequired(LienFormComponent, {
  onRedirecting: () => <Loading />,
});
