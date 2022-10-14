import React, { Component } from "react";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import ReactPDF from '@react-pdf/renderer';
import {useHistory} from 'react-router-dom';
import moment from "moment";

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
    var date = moment().format("DD-MM-YYYY hh:mm:ss")
    this.state = {
      "form": {
        'date': date,
        'contractor_id': user.sub,
        'jobNumber': '',
        'projectManager': '',
        'projectManagerId': null,
        'contractor': user.name,
        'lineItems': [
          {
            "id": 1,
            "description": '',
            "quantity": '',
            "type": 'sf',
            "price_per": '',
            "total": '',
            "hours": false
          }
        ]
      },
      'projectManagers': [{}]
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addInput = this.addInput.bind(this);
    this.handleLineItemChange = this.handleLineItemChange.bind(this);
    this.handlePms = this.handlePms.bind(this)
  };

  addInput(event) {
    event.preventDefault()
    console.log(event)
    const form = this.state.form;
    const current_lineItems = form.lineItems;
    const newLineItem = {
      "id": (current_lineItems.length+1),
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
    console.log('A job number was submitted: ' + this.state.form.jobNumber);
    console.log('A contractor was submitted: ' + this.state.form.contractor);
    console.log(this.state.form.lineItems)
    e.preventDefault();

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
  }


  render() {
    return (
      <form>
          <div className="form_row full">
            <label>
              <span>Contractor:</span>
              <input type="text" name="contractor" value={this.state.form.contractor} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className="form_row full">
            <label>
              <span>Project Manager:</span>
              <select name="projectManager" value={this.state.form.projectManager} onChange={this.handleInputChange}>
              {this.state.projectManagers.map((item, i) => {
                 return (
                   <option key={i} value={item.name}>{item.name}</option>
                 );
               })}
              </select>
            </label>
          </div>
          <div className="form_row full">
            <label>
              <span>Job Number:</span>
              <input type="text" name="jobNumber" value={this.state.form.jobNumber} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className="form_row section">
          <div className="section_title">Scope(s) of Work Completed Requesting Payment:</div>
          {this.state.form.lineItems.map((item, i) => {
             return (
               <div className="multiInputRow" key={item.id}>
                 <label className="medium_input">
                   <span>Description:</span>
                   <textarea type="text" id={item.id} name="description" value={this.state.form.lineItems[i].description} onChange={this.handleLineItemChange} />
                 </label>
                 <label className="small_input">
                   <span>Quantity:</span>
                   <input type="text" id={item.id}  name="quantity" value={this.state.form.lineItems[i].quantity} onChange={this.handleLineItemChange} />
                 </label>
                 <label className="small_input">
                   <span>Type:</span>
                   <select id={item.id} name="type" value={this.state.form.lineItems[i].type} onChange={this.handleLineItemChange}>
                      <option value="sf">SF - square feet</option>
                      <option value="sy">SY - square yards</option>
                      <option value="lf">LF - linear feet</option>
                      <option value="hrs">HRS</option>
                   </select>
                 </label>
                 <label className="small_input">
                   <span>Price Per:</span>
                   <input type="text" id={item.id}  name="price_per" value={this.state.form.lineItems[i].price_per} onChange={this.handleLineItemChange} />
                 </label>
                 <label className="small_input">
                   <span>Total:</span>
                   <input type="text" id={item.id}  name="total" value={this.state.form.lineItems[i].total} onChange={this.handleLineItemChange} />
                 </label>
               </div>
             );
           })}
           <button onClick={this.addInput}>+</button>
          </div>
          <div className="form_row">
            <button onClick={this.handleSubmit}>SUBMIT</button>
          </div>
      </form>
    );
  }
}

export default LienForm;
