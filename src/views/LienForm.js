import React, { useState } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import LienForm from "../components/LienForm";

export const LienFormComponent = () => {

  return (
    <>
      <div className="mb-5">

        <h1>Lien Form</h1>
        <p className="lead">

        </p>

        <LienForm />

      </div>

    </>
  );
};

export default withAuthenticationRequired(LienFormComponent, {
  onRedirecting: () => <Loading />,
});
