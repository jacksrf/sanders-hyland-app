import React, { useState, useEffect } from "react";
import { Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import LienForm from "../components/LienForm";
import { useHistory, useLocation } from 'react-router-dom';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

import 'primeicons/primeicons.css';  
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "react-datepicker/dist/react-datepicker.css";

export const LienFormComponent = () => {
  const location = useLocation();
  console.log(location.pathname)
  const id = location.pathname.replace('/lien-form', '').replace('/', '')
  console.log('id', id);
  const {user} = useAuth0();
  const history= useHistory();
  var date = moment().format()
  console.log(user)
  const [data, setData] = useState({
    "date":date,
    "invoice": "",
    "contractor_id": user._id,
    "jobNumber":"",
    "job_id": "",
    "projectManager":"",
    "projectManagerId":"",
    "contractor":user.name,
    "contractorCompany": user.company,
    "startDate":date,
    "endDate":date,
    "lineItems":[],
    "lineItemsTotal": 0,
    "lineItems_manHours":[],
    "lineItems_manHours_total": 0,
    "lineItems_other":[],
    "lineItems_other_total": 0,
    "status":"started",
    "contractor_signature": "",
    "pm_signature": "",
    "comments": "",
    "retention": "",
    "invoice": 0,
    "attachment_url": ""
  });

  const handleDataUpdate = async (id) => {
    const response = await fetch(
      "https://api.sandershylandtest.com/pdf/"+ id
    ).then((response) => response.json());
    console.log(response)
    return response
  }

  // useEffect(() => {
  //
  //   if (id) {
  //     handleDataUpdate(id)
  //   }
  // }, []);

  useEffect(() => {
    let isMounted = true;
    if (id != "") {
    handleDataUpdate(id).then((data) => {
        if(isMounted ){
        setData(data)
        }
      });
     return () => {
      isMounted = false;
      };
    }
    }, []);


  if (data.comments) {
    return (
      <>
        <div className="mb-5">

          <h1>Lien Form</h1>
          <p className="lead">

          <div className="pm_comments_holder">
            <div className="pm_comments_title">Project Managers Comments:</div>
            <div className="pm_comments">
              {data.comments}
            </div>
          </div>

          </p>

          <LienForm user={user} history={history} data={data} />

        </div>

      </>
    )
  } else {
    return (
      <>
        <div className="mb-5">

          <Card style={{marginBottom: '20px'}}>
            <h1>Lien Form</h1>
          </Card>
          
 

          <LienForm user={user} history={history} data={data} />

        </div>

      </>
    )
  }
};

export default withAuthenticationRequired(LienFormComponent, {
  onRedirecting: () => <Loading />,
});
