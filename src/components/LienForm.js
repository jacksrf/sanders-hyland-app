import React, { Component } from "react";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import ReactPDF from '@react-pdf/renderer';
import {useHistory} from 'react-router-dom';
import moment from "moment";
import {Form, Button} from 'react-bootstrap';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

class LienForm extends Component {


  constructor(props) {
    console.log(props)
    super(props);
    const user = this.props.user;
    var date = moment().format()
    this.state = {
      "form": this.props.data,
      'projectManagers': [{}]
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.addInput = this.addInput.bind(this);
    this.addInput_hours = this.addInput_hours.bind(this);
    this.handleLineItemChange = this.handleLineItemChange.bind(this);
    this.handleLineItemChange2 = this.handleLineItemChange2.bind(this);
    this.handlePms = this.handlePms.bind(this)
    this.deleteLineItem = this.deleteLineItem.bind(this);
    this.deleteHourlyLineItem = this.deleteHourlyLineItem.bind(this);
    this.handleDataUpdate = this.handleDataUpdate.bind(this);
  };

  addInput(event) {
    event.preventDefault()
    console.log(event)
    const form = this.state.form;
    const current_lineItems = form.lineItems;
    const newLineItem = {
      "id": (current_lineItems.length+1),
      "date": '',
      "description": '',
      "quantity": '',
      "type": 'sf',
      "price_per": '',
      "total": '',
      "hours": false
    };
    current_lineItems.push(newLineItem)
    console.log(current_lineItems)
    form.lineItems = current_lineItems;
    this.setState({
      form: form
    });
  };

  addInput_hours(event) {
    event.preventDefault()
    console.log(event)
    const form = this.state.form;
    const current_lineItems = form.lineItems_manHours;
    const newLineItem = {
      "id": (current_lineItems.length+1),
      "date": '',
      "men": '',
      "hours": '',
      "rate": '',
      "total": '',
    };
    current_lineItems.push(newLineItem)
    console.log(current_lineItems)
    form.lineItems_manHours = current_lineItems;
    this.setState({
      form: form
    });
  };

  handleLineItemChange(event) {
    event.preventDefault();
    console.log(event);
    const id = event.target.id;
    console.log(id)
     const target = event.target;
     console.log(target)
     const value = target.value;
     console.log(value)
     const name = target.name;
     console.log(name)
     const form = this.state.form;
     const current_lineItems = form.lineItems;
     console.log(current_lineItems)
     console.log(current_lineItems[id-1])
     current_lineItems[id-1][name] = value;
     if (name === "price_per") {
       var total = current_lineItems[id-1].quantity * current_lineItems[id-1].price_per;
       current_lineItems[id-1].total = total;
     }

     form.lineItems = current_lineItems;
     this.setState({
       form: form
     });
  };

  handleLineItemChange2(event) {
    event.preventDefault();
    console.log(event);
    const id = event.target.id;
    console.log(id)
     const target = event.target;
     console.log(target)
     const value = target.value;
     console.log(value)
     const name = target.name;
     console.log(name)
     const form = this.state.form;
     const current_lineItems = form.lineItems_manHours;
     console.log(current_lineItems)
     console.log(current_lineItems[id-1])
     current_lineItems[id-1][name] = value;
     var total = Number(current_lineItems[id-1].men) * Number(current_lineItems[id-1].hours) * Number(current_lineItems[id-1].rate);
     current_lineItems[id-1].total = total;

     form.lineItems_manHours = current_lineItems;
     this.setState({
       form: form
     });
  };

    deleteLineItem(event) {}

    deleteHourlyLineItem(event) {}

  handleInputChange(event) {
      console.log(event);
     const target = event.target;
     console.log(target)
     const value = target.value;
     console.log(value)
     const name = target.name;
     console.log(name)
     const form = this.state.form;
     form[name] = value;
     if (name === 'projectManager') {
       var projectManager = this.state.projectManagers[event.key]
       form.projectManagerId = projectManager._id
     }
     this.setState({
       form: form
     });
 }

  async handleSubmit(e) {
    const studentId = window.location.href.split('/')[4];
    e.preventDefault();
     const form = this.state.form;
     form.status = 'unsubmitted';
     this.setState({
       form: form
     });

     if (this.state.form._id) {
       var response = await fetch("https://sanders-hyland-server.herokuapp.com/lien/update/"+ studentId, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.state.form),
       })
       .then((response) => response.json())
       console.log(response)
       this.props.history.push('/pdf/'+studentId)
     } else {
       var response = await fetch("https://sanders-hyland-server.herokuapp.com/lien/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.state.form),
       })
       .then((response) => response.json())
       console.log(response)
       this.props.history.push('/pdf/'+response.id)
     }


  }

  async handleSave(e) {
    const studentId = window.location.href.split('/')[4];
    e.preventDefault();
      console.log(studentId)
      if (studentId != '') {
        console.log(this.state.form)
        var response = await fetch("https://sanders-hyland-server.herokuapp.com/lien/update/"+ studentId, {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(this.state.form),
        })
        .then((response) => response.json())
        .catch(function(error) {
          console.log(error);
        });

        console.log(response)
        this.props.history.push('/payments-submitted/')
      } else {
        var response = await fetch("https://sanders-hyland-server.herokuapp.com/lien/add", {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify(this.state.form),
        })
        .then((response) => response.json())
        console.log(response)
        this.props.history.push('/payments-submitted/')
      }

  }

  async handleDataUpdate() {
    const studentId = window.location.href.split('/')[4];
    const response = await fetch(
      "https://sanders-hyland-server.herokuapp.com/pdf/"+ studentId
    ).then((response) => response.json());
    console.log(response)
    this.setState({
      form: response,
    });
  }

  async handlePms() {
    var response = await fetch("https://sanders-hyland-server.herokuapp.com/project-managers", {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((response) => response.json())
    const form = this.state.form;
    form.projectManager = response[0].name;
    form.projectManagerId = response[0]._id

    this.setState({
      form: form,
      projectManagers: response
    });
  }


  componentDidMount() {
    this.handlePms()
    this.handleDataUpdate()
  }


  render() {
    return (
      <Form>
          <Form.Group className="form_row full">
            <Form.Label>
              <span>Contractor:</span>
              <Form.Control type="text" name="contractor" value={this.state.form.contractor} onChange={this.handleInputChange} />
            </Form.Label>
          </Form.Group>
          <Form.Group className="form_row full">
            <Form.Label>
              <span>Project Manager:</span>
            </Form.Label>
            <Form.Select name="projectManager" value={this.state.form.projectManager} onChange={this.handleInputChange}  aria-label="Default select example">
            {this.state.projectManagers.map((item, i) => {
               return (
                 <option key={i} value={item.name}>{item.name}</option>
               );
             })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="form_row notFull">
            <Form.Label>
              <span>Job Number:</span>
              <Form.Control type="text" name="jobNumber" value={this.state.form.jobNumber} onChange={this.handleInputChange} />
            </Form.Label>
          </Form.Group>

          <Form.Group className="form_row notFull">
            <Form.Label>
              <span>Start Date:</span>
              <Form.Control type="text" name="startDate" value={this.state.form.startDate} onChange={this.handleInputChange} />
            </Form.Label>
          </Form.Group>
          <Form.Group className="form_row notFull">
            <Form.Label>
              <span>End Date:</span>
              <Form.Control type="text" name="endDate" value={this.state.form.endDate} onChange={this.handleInputChange} />
            </Form.Label>
          </Form.Group>
          <div className="formDivider"></div>
          <Form.Group className="form_row section">
            <div className="section_title">Scope(s) of Work Completed Requesting Payment:</div>
            <Form.Group className="form_row">
            {this.state.form.lineItems.map((item, i) => {
               return (
                 <div className="multiInputRow" key={item.id}>
                 <Form.Label className="small_input">
                   <span>Date:</span>
                   <Form.Control type="text" id={item.id}  name="date" value={this.state.form.lineItems[i].date} onChange={this.handleLineItemChange} />
                 </Form.Label>
                   <Form.Label className="medium_input">
                     <span>Description:</span>
                     <Form.Control type="textarea" id={item.id} name="description" value={this.state.form.lineItems[i].description} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Quantity:</span>
                     <Form.Control type="text" id={item.id}  name="quantity" value={this.state.form.lineItems[i].quantity} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Type:</span>
                     <Form.Select id={item.id} name="type" value={this.state.form.lineItems[i].type} onChange={this.handleLineItemChange}>
                        <option value="sf">SF - square feet</option>
                        <option value="sy">SY - square yards</option>
                        <option value="lf">LF - linear feet</option>
                        <option value="hrs">HRS</option>
                     </Form.Select>
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Price Per:</span>
                     <Form.Control type="text" id={item.id}  name="price_per" value={this.state.form.lineItems[i].price_per} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Total:</span>
                     <Form.Control type="text" id={item.id}  name="total" value={this.state.form.lineItems[i].total} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <div></div>
                     <Button variant="danger" id={item.key} onClick={this.deleteLineItem}>Delete</Button>
                  </Form.Label>
                 </div>
               );
             })}
             </Form.Group>
           <Button variant="success" onClick={this.addInput}>Add Work Line Item</Button>
          </Form.Group>
          <div className="formDivider"></div>
          <Form.Group className="form_row section">
            <div className="section_title">Scope(s) of Man Hours Requesting Payment:</div>
            <Form.Group className="form_row">
            {this.state.form.lineItems_manHours.map((item, i) => {
               return (
                 <div className="multiInputRow" key={item.id}>
                   <Form.Label className="small_input">
                     <span>Date:</span>
                     <Form.Control type="textarea" id={item.id} name="date" value={this.state.form.lineItems_manHours[i].date} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="medium_input">
                     <span>Description:</span>
                     <Form.Control type="textarea" id={item.id} name="description" value={this.state.form.lineItems_manHours[i].description} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Men:</span>
                     <Form.Control type="text" id={item.id}  name="men" value={this.state.form.lineItems_manHours[i].men} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Hours:</span>
                     <Form.Control type="text" id={item.id}  name="hours" value={this.state.form.lineItems_manHours[i].hours} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>rate:</span>
                     <Form.Control type="text" id={item.id}  name="rate" value={this.state.form.lineItems_manHours[i].rate} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Total:</span>
                     <Form.Control type="text" id={item.id}  name="total" value={this.state.form.lineItems_manHours[i].total} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <div></div>
                     <Button variant="danger" id={item.key} onClick={this.deleteHourlyLineItem}>Delete</Button>
                  </Form.Label>
                 </div>
               );
             })}
             </Form.Group>
           <Button variant="success" onClick={this.addInput_hours}>Add Hours Line Item</Button>
          </Form.Group>
          <div className="formDivider"></div>
          <div className="form_row submit d-grid gap-2">
            <Button variant="info" size="lg" onClick={this.handleSave}>SAVE</Button>{" "}{" "}
            <Button variant="warning" size="lg" onClick={this.handleSubmit}>SUBMIT</Button>
          </div>
      </Form>
    );
  }
}

export default LienForm;
