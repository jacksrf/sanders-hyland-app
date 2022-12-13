import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useEffect, useState } from "react";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import {Form, Button} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'



export const PaymentsComponent = () => {
  console.log(useAuth0())
  const { user } = useAuth0();
  console.log(user)
  const [userFull, setUser] = useState({
    "_id": "",
    "name": ""
  });

  const history = useHistory();
  const [payments, setPayments] = useState([]);

  const goToPDF = async (item) => {
    console.log(item)
    history.push('/pdf/'+item._id)
  }

  const handleSubmit = async () => {
    var contractor = await fetch("http://localhost:4000/user/"+ user.email, {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((contractor) => contractor.json())
    setUser(contractor)
    const response = await fetch(
      "http://localhost:4000/liens/" + contractor._id
    ).then((response) => response.json());
    console.log(response)
    setPayments(response)
  };

  const deleteApp = async (item) => {
    var response = await fetch("http://localhost:4000/lien/delete/" + item._id, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((response) => response.json())
    console.log(response)
    handleSubmit()
  }

  useEffect(() => {
    handleSubmit();
  }, []);

  return (

    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md>
          <h2>Latest Payments Submitted:</h2>
        </Col>
      </Row>
      <Row className="application_row_header">
        <div className="date">DATE</div>
        <div className="invoice_value">VALUE</div>
        <div className="job_number">JOB NUMBER</div>
        <div className="project_manager">PM</div>
        <div className="status">STATUS</div>
        <Button className="hide"></Button>
        <Button className="hide"></Button>
      </Row>
      {payments.map((item, i) => {
        if (item.status === "started") {
          return (
           <Row className="application_row" key={i}>
             <div className="date">{moment(item.date.replace(' ', "T")).format("MM/DD/YY")}</div>
             <div className="invoice_value">${(Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) - ((Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) * (item.retention/100))}</div>
             <div className="job_number">{item.jobNumber}</div>
             <div className="project_manager">{item.projectManager}</div>
             <div className={classNames('status', item.status)}>{item.status}</div>
             <Button className="view" variant="secondary" id={item._id} onClick={(e)=>{goToPDF(item)}}>FINISH</Button>
             <Button className="delete" variant="danger" id={item._id} onClick={(e)=>{deleteApp(item)}}><FontAwesomeIcon icon={faTrash} /></Button>
           </Row>
         );
       } else if (item.status === "unsubmitted") {
          return (
           <Row className="application_row" key={i}>
             <div className="date">{moment(item.date.replace(' ', "T")).format("MM/DD/YY")}</div>
             <div className="invoice_value">${(Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) - ((Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) * (item.retention/100))}</div>
             <div className="job_number">{item.jobNumber}</div>
             <div className="project_manager">{item.projectManager}</div>
             <div className={classNames('status', item.status)}>{item.status}</div>
             <Button className="view" variant="info" id={item._id} onClick={(e)=>{goToPDF(item)}}>SUBMIT</Button>
             <Button className="delete" variant="danger" id={item._id} onClick={(e)=>{deleteApp(item)}}><FontAwesomeIcon icon={faTrash} /></Button>
           </Row>
         );
        } else if (item.status === "approved") {
          return (
           <Row className="application_row" key={i}>
             <div className="date">{moment(item.date.replace(' ', "T")).format("MM/DD/YY")}</div>
             <div className="invoice_value">${(Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) - ((Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) * (item.retention/100))}</div>
             <div className="job_number">{item.jobNumber}</div>
             <div className="project_manager">{item.projectManager}</div>
             <div className={classNames('status', item.status)}>{item.status}</div>
             <Button className="view" variant="success" id={item._id} onClick={(e)=>{goToPDF(item)}}>VIEW</Button>
           </Row>
         );
       } else if (item.status === "rejected") {
          return (
           <Row className="application_row" key={i}>
             <div className="date">{moment(item.date.replace(' ', "T")).format("MM/DD/YY")}</div>
             <div className="invoice_value">${(Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) - ((Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) * (item.retention/100))}</div>
             <div className="job_number">{item.jobNumber}</div>
             <div className="project_manager">{item.projectManager}</div>
             <div className={classNames('status', item.status)}>{item.status.replace('_', " ")}</div>
             <Button className="view" variant="secondary" id={item._id} onClick={(e)=>{goToPDF(item)}}>EDIT</Button>
           </Row>
         );
       } else if ( item.status === "signed") {
          return (
           <Row className="application_row" key={i}>
             <div className="date">{moment(item.date.replace(' ', "T")).format("MM/DD/YY")}</div>
             <div className="invoice_value">${(Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) - ((Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) * (item.retention/100))}</div>
             <div className="job_number">{item.jobNumber}</div>
             <div className="project_manager">{item.projectManager}</div>
             <div className={classNames('status', item.status)}>{item.status.replace('_', " ")}</div>
             <Button className="view" variant="info" id={item._id} onClick={(e)=>{goToPDF(item)}}>SUBMIT</Button>
             <Button className="hide"></Button>
           </Row>
         );
        } else {
          return (
           <Row className="application_row" key={i}>
             <div className="date">{moment(item.date.replace(' ', "T")).format("MM/DD/YY")}</div>
             <div className="invoice_value">${(Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) - ((Number(item.lineItems_manHours_total) + Number(item.lineItemsTotal)) * (item.retention/100))}</div>
             <div className="job_number">{item.jobNumber}</div>
             <div className="project_manager">{item.projectManager}</div>
             <div className={classNames('status', item.status)}>{item.status.replace('_', " ")}</div>
             <Button className="view" variant="success" id={item._id} onClick={(e)=>{goToPDF(item)}}>VIEW</Button>
             <Button className="hide"></Button>
           </Row>
         );
        }

      })}
    </Container>
  );
};

export default withAuthenticationRequired(PaymentsComponent, {
  onRedirecting: () => <Loading />,
});
