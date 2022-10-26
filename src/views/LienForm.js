import React, { useState, useEffect } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import LienForm from "../components/LienForm";
import { useHistory, useLocation } from 'react-router-dom';
import moment from "moment";

export const LienFormComponent = () => {
  const location = useLocation();
  const id = location.pathname.replace('/lien-form/', '')
  console.log('id', id);
  const {user} = useAuth0();
  const history= useHistory();
  var date = moment().format()
  const [data, setData] = useState({
    "date":date,
    "contractor_id": user.sub,
    "jobNumber":"",
    "projectManager":"",
    "projectManagerId":"",
    "contractor":user.name,
    "startDate":"",
    "endDate":"",
    "lineItems":[],
    "lineItemsTotal": 0,
    "lineItems_manHours":[],
    "lineItems_manHours_total": 0,
    "status":"started"
  });

  const handleDataUpdate = async (id) => {
    const response = await fetch(
      "https://sanders-hyland-server.herokuapp.com/pdf/"+ id
    ).then((response) => response.json());
    console.log(response)
    setData(response)
  }

  useEffect(() => {

    if (id) {
      handleDataUpdate(id)
    }
  }, []);

  return (
    <>
      <div className="mb-5">

        <h1>Lien Form</h1>
        <p className="lead">

        </p>

        <LienForm user={user} history={history} data={data} />

      </div>

    </>
  );
};

export default withAuthenticationRequired(LienFormComponent, {
  onRedirecting: () => <Loading />,
});
