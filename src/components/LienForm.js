import React, { Component } from "react";

import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


class LienForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'jobNumber': '',
      'contractor': ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    console.log(event)
   const target = event.target;
   console.log(target)
   const value = target.value;
   console.log(value)
   const name = target.name;
   console.log(name)

   this.setState({
     [name]: value
   });
 }

  handleSubmit(event) {
    console.log('A job number was submitted: ' + this.state.jobNumber);
    console.log('A contractor was submitted: ' + this.state.contractor);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
          <label>
            Contractor:
            <input type="text" name="contractor" value={this.state.contractor} onChange={this.handleInputChange} />
          </label>
          <label>
            Job Number:
            <input type="text" name="jobNumber" value={this.state.jobNumber} onChange={this.handleInputChange} />
          </label>
          <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default LienForm;
