import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useEffect, useState } from "react";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

export const PaymentsComponent = () => {
  const { user } = useAuth0();

  const [payments, setPayments] = useState([]);

  const handleSubmit = async () => {
    const response = await fetch(
      "https://sanders-hyland-server.herokuapp.com/lien/" + user.sub
    ).then((response) => response.json());
    console.log(response)
    setPayments(response)
    // update the state
    // setUsers(response);
  };

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
      {payments.map((item, i) => {
         return (
          <Row key={i}>
            <div className="date">{item.date}</div>
            <div className="row_title">{item.jobNumber}</div>
            <div className="project_manager">{item.projectManager}</div>
            <div className="status">Under Review</div>
            <div className="view">VIEW</div>
          </Row>
        );
      })}
    </Container>
  );
};

export default withAuthenticationRequired(PaymentsComponent, {
  onRedirecting: () => <Loading />,
});
