import React from "react";
import { Container, Row, Col } from "reactstrap";
import { useEffect } from "react";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

export const PaymentsComponent = () => {
  const { user } = useAuth0();

  //   async function handleSubmit(e) {
  //     await fetch("https://sanders-hyland-server.herokuapp.com/lien/" + user.sub, {
  //        method: "GET",
  //        headers: {
  //          "Content-Type": "application/json",
  //        },
  //     })
  //   .then(response => {
  //     console.log(response)
  //   })
  // }

  const handleSubmit = async () => {
    const response = await fetch(
      "https://sanders-hyland-server.herokuapp.com/lien/" + user.sub
    ).then((response) => response.json());
    console.log(response)
    // update the state
    // setUsers(response);
  };

  function componentDidMount() {
    this.handleSubmit();
  }

  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
      </Row>
      <Row>
        
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(PaymentsComponent, {
  onRedirecting: () => <Loading />,
});
