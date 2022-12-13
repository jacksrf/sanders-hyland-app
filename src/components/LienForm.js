import React, { Component } from "react";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import ReactPDF from '@react-pdf/renderer';
import {useHistory} from 'react-router-dom';
import moment from "moment";
import {Form, Button} from 'react-bootstrap';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

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
      "contractor": {},
      'projectManagers': [{}],
      'jobs': []
    };
    this.handlePmJobs = this.handlePmJobs.bind(this);
    this.handleContractor = this.handleContractor.bind(this);
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
    this.handleJobs = this.handleJobs.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleLineItemDateChange = this.handleLineItemDateChange.bind(this)
    this.handleLineItemDateChange2 = this.handleLineItemDateChange2.bind(this)
    this.handleInvoiceNumber = this.handleInvoiceNumber.bind(this)
  };

  addInput(event) {
    event.preventDefault()
    console.log(event)
    const form = this.state.form;
    const current_lineItems = form.lineItems;
    const newLineItem = {
      "id": (current_lineItems.length+1),
      "date": moment().toDate(),
      "description": '',
      "product_code": '',
      "product_dimensions": '',
      "material": '',
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
      "date": moment().toDate(),
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

     var lineItemsTotal = 0;
     current_lineItems.map((item, i) => {
       lineItemsTotal += item.total;
       if (i === current_lineItems.length - 1) {
         form.lineItems = current_lineItems;
         form.lineItemsTotal = lineItemsTotal;
         this.setState({
           form: form
         });
       }
     })


  };

  handleLineItemDateChange(i, date) {
      // event.preventDefault();
      console.log(i)
     const form = this.state.form;
     const current_lineItems = form.lineItems;
     console.log(current_lineItems)
     console.log(current_lineItems[i])
     current_lineItems[i].date = date;

     var lineItemsTotal = 0;
     current_lineItems.map((item, i) => {
       lineItemsTotal += item.total;
       if (i === current_lineItems.length - 1) {
         form.lineItems = current_lineItems;
         form.lineItemsTotal = lineItemsTotal;
         this.setState({
           form: form
         });
       }
     })


  };

  handleLineItemDateChange2(i, date) {
    // event.preventDefault();
     const form = this.state.form;
     const current_lineItems = form.lineItems_manHours;
     console.log(current_lineItems)
     console.log(current_lineItems[i])
     current_lineItems[i].date = date;

     var lineItemsTotal = 0;
     current_lineItems.map((item, i) => {
       lineItemsTotal += item.total;
       if (i === current_lineItems.length - 1) {
         form.lineItems_manHours = current_lineItems;
         form.lineItems_manHours_total = lineItemsTotal;
         this.setState({
           form: form
         });
       }
     })


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
     var lineItemsTotal = 0;
     current_lineItems.map((item, i) => {
       lineItemsTotal += item.total;
       if (i === current_lineItems.length - 1) {
         form.lineItems_manHours = current_lineItems;
         form.lineItems_manHours_total = lineItemsTotal;
         console.log(form)
         this.setState({
           form: form
         });
       }
     })

  };

    deleteLineItem(event) {
      console.log(event);
      const id = event.target.id;
      console.log(id)

       const form = this.state.form;
       const current_lineItems = form.lineItems;
       current_lineItems.splice(id-1, 1);

       var lineItemsTotal = 0;
       current_lineItems.map((item, i) => {
         lineItemsTotal += item.total;
         if (i === current_lineItems.length - 1) {
           form.lineItems = current_lineItems;
           form.lineItemsTotal = lineItemsTotal;
           this.setState({
             form: form
           });
         }
       })
    }

    deleteHourlyLineItem(event) {
      console.log(event);
      const id = event.target.id;
      console.log(id)

       const form = this.state.form;
       const current_lineItems = form.lineItems_manHours;
       current_lineItems.splice(id-1, 1);

       var lineItemsTotal = 0;
       current_lineItems.map((item, i) => {
         lineItemsTotal += item.total;
         if (i === current_lineItems.length - 1) {
           form.lineItems_manHours = current_lineItems;
           form.lineItems_manHours_total = lineItemsTotal;
           this.setState({
             form: form
           });
         }
       })
    }

    async handlePmJobs (id) {
      console.log(id)
        var jobs = await fetch("http://localhost:4000/jobs/"+ id, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         }
      })
      .then((jobs) => jobs.json())
      console.log(jobs)

      this.setState({
        jobs: jobs
      });
    }

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
       console.log(event)
       console.log(this.state.projectManagers)
       var projectManagerCurrent = this.state.projectManagers.find(x => x.name === target.value);
       console.log(projectManagerCurrent)

       form.projectManagerId = projectManagerCurrent._id
       this.handlePmJobs(projectManagerCurrent._id);
     }
     if (name === 'jobNumber') {
       var jobCurrent = this.state.jobs.find(x => x.number === target.value);
       console.log(jobCurrent);
       var contractorFromJob = jobCurrent.contractors.find(x => x.id === this.state.contractor._id);
       console.log(contractorFromJob)
       form.retention = contractorFromJob.retention;
       form.job_id = jobCurrent._id;
     }
     this.setState({
       form: form
     });
 }

 handleDateChange(name, value) {
     console.log(name);
     console.log(value)
    const form = this.state.form;
    form[name] = value;
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
       var response = await fetch("http://localhost:4000/lien/update/"+ studentId, {
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
       var response = await fetch("http://localhost:4000/lien/add", {
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
      if (studentId != undefined) {
        console.log(this.state.form)
        var response = await fetch("http://localhost:4000/lien/update/"+ studentId, {
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
        var response = await fetch("http://localhost:4000/lien/add", {
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
      "http://localhost:4000/pdf/"+ studentId
    ).then((response) => response.json());
    console.log(response)
    console.log(response.contractor)
    console.log(response.contractor_id)
    console.log(response.contractor_signature)
    console.log(response.date)
    console.log(response.endDate)
    console.log(response.jobNumber)
    console.log(response.lineItems)
    console.log(response.lineItemsTotal)
    console.log(response.lineItems_manHours)
    console.log(response.lineItems_manHours_total)
    console.log(response.pm_signature)
    console.log(response.projectManager)
    console.log(response.projectManagerId)
    console.log(response.startDate)
    console.log(response.status)
    console.log(response._id)
    this.setState({
      form: {
        invoice: response.invoice,
        contractor: response.contractor,
        contractor_id: response.contractor_id,
        contractor_signature: response.contractor_signature,
        date: response.date,
        endDate: response.endDate,
        jobNumber: response.jobNumber,
        lineItems: response.lineItems,
        lineItemsTotal: response.lineItemsTotal,
        lineItems_manHours: response.lineItems_manHours,
        lineItems_manHours_total: response.lineItems_manHours_total,
        pm_signature: response.pm_signature,
        projectManager: response.projectManager,
        projectManagerId: response.projectManagerId,
        startDate: response.startDate,
        status: response.status,
        _id: response._id
      },
    });
  }

  async handlePms() {
    var response = await fetch("http://localhost:4000/project-managers", {
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

  async handleJobs() {
    var response = await fetch("http://localhost:4000/jobs", {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((response) => response.json())

    this.setState({
      jobs: response
    });
  }

  async handleInvoiceNumber() {
    var response = await fetch("http://localhost:4000/invoice-number", {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((response) => response.json())

    const currentForm = this.state.form;
    currentForm.invoice = response+1;

    this.setState({
      form: currentForm
    });
  }

  async handleContractor() {
    var contractor = await fetch("http://localhost:4000/user/"+ this.props.user.email, {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((contractor) => contractor.json())
    console.log(contractor)
    const formNow = this.state.form;
    formNow.contractor_id = contractor._id;
    formNow.contractor = contractor.name;

    this.setState({
      form: formNow,
      contractor: contractor
    });
  }


  componentDidMount() {
    this.handleContractor()
    this.handlePms()
    this.handleJobs()
    this.handleInvoiceNumber()
    const studentId = window.location.href.split('/')[4];
    console.log(studentId)
    if (studentId != '/lien-form') {
      this.handleDataUpdate()
    }

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
                <option id="none" key="none">Select One</option>
            {this.state.projectManagers.map((item, i) => {
               return (
                 <option id={i} key={i} value={item.name}>{item.name}</option>
               );
             })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="form_row full">
            <Form.Label>
              <span>Job Number:</span>
            </Form.Label>
            <Form.Select name="jobNumber" value={this.state.form.jobNumber} onChange={this.handleInputChange}  aria-label="Default select example">
            <option id="none" key="none">Select One</option>
            {this.state.jobs.map((item, i) => {
               return (
                 <option key={i} value={item.number}>{item.number} - {item.name}</option>
               );
             })}
            </Form.Select>
          </Form.Group>

          <Form.Group className="form_row notFull">
            <Form.Label>
              <span>Start Date:</span>

              <DatePicker name="startDate" selected={moment(this.state.form.startDate).toDate()} onChange={(date:Date) => this.handleDateChange('startDate', date)} />
            </Form.Label>
          </Form.Group>
          <Form.Group className="form_row notFull">
            <Form.Label>
              <span>End Date:</span>
              <DatePicker name="endDate" selected={moment(this.state.form.endDate).toDate()} onChange={(date:Date) => this.handleDateChange('endDate', date)} />
            </Form.Label>
          </Form.Group>
          <div className="formDivider"></div>
          <Form.Group className="form_row section">
            <div className="section_title">Scope(s) of Work Completed Requesting Payment:</div>
            <Form.Group className="form_row">
            {this.state.form.lineItems.map((item, i) => {
               return (
                 <div className="multiInputRow" key={item.id}>
                 <Form.Group className="lineitem_row">
                 <Form.Label className="small_input">
                   <span>Date:</span>
                   <DatePicker name="date" id={item.id} selected={moment(this.state.form.lineItems[i].date).toDate()} onChange={(date:Date) => this.handleLineItemDateChange(i, date)} />
                 </Form.Label>
                 <Form.Label className="large_input">
                   <span>Description:</span>
                   <Form.Control type="text" id={item.id} name="description" value={this.state.form.lineItems[i].description} onChange={this.handleLineItemChange} />
                 </Form.Label>
                   <Form.Label className="medium_input">
                     <span>Product Code:</span>
                     <Form.Control type="text" id={item.id} name="product_code" value={this.state.form.lineItems[i].product_code} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="medium_input">
                     <span>Product Dimensions:</span>
                     <Form.Control type="text" id={item.id} name="product_dimensions" value={this.state.form.lineItems[i].product_dimensions} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Material:</span>
                     <Form.Select id={item.id} name="material" value={this.state.form.lineItems[i].material} onChange={this.handleLineItemChange}>
                        <option id="none" key="none">Select One</option>
                        <option value="Hard tile">Hard tile</option>
                        <option value="Stone tile">Stone tile</option>
                        <option value="Broadloom carpet">Broadloom carpet</option>
                        <option value="Carpet tile">Carpet tile</option>
                        <option value="Wood flooring">Wood flooring</option>
                        <option value="Resilient flooring">Resilient flooring</option>
                        <option value="Resilient base">Resilient base</option>
                        <option value="Resinous flooring">Resinous flooring</option>
                        <option value="Sheet Vinyl">Sheet Vinyl</option>
                        <option value="Brick">Brick</option>
                        <option value="Mortar bed">Mortar bed</option>
                        <option value="Leveling and Patch">Leveling and Patch</option>
                        <option value="Other">Other</option>
                     </Form.Select>
                   </Form.Label>
                   </Form.Group>
                   <Form.Group className="lineitem_row">
                   <Form.Label className="small_input">
                     <span>Quantity:</span>
                     <Form.Control type="text" id={item.id}  name="quantity" value={this.state.form.lineItems[i].quantity} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Type:</span>
                     <Form.Select id={item.id} name="type" value={this.state.form.lineItems[i].type} onChange={this.handleLineItemChange}>
                        <option id="none" key="none">Select One</option>
                        <option value="sf">SF - square feet</option>
                        <option value="sy">SY - square yards</option>
                        <option value="lf">LF - linear feet</option>
                        <option value="ea">EA - Each</option>
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
                  </Form.Group>
                 </div>
               );
             })}
             </Form.Group>
           <Button className="addLineButton" variant="success" onClick={this.addInput}>Add Work Line Item</Button>

           <div className="total_holder">
               <span>Line Items Total:</span>
               <div>${this.state.form.lineItemsTotal}</div>
           </div>
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
                     <DatePicker name="date" id={item.id} selected={moment(this.state.form.lineItems_manHours[i].date).toDate()} onChange={(date:Date) => this.handleLineItemDateChange2(i, date)} />
                   </Form.Label>
                   <Form.Label className="large_input">
                     <span>Description:</span>
                     <Form.Control type="textarea" id={item.id} name="description" value={this.state.form.lineItems_manHours[i].description} onChange={this.handleLineItemChange2} />
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
           <Button className="addLineButton" variant="success" onClick={this.addInput_hours}>Add Hours Line Item</Button>
           <div className="total_holder">
               <span>Hourly Items Total:</span>
               <div>${this.state.form.lineItems_manHours_total}</div>
           </div>
          </Form.Group>
          <div className="formDivider"></div>
          <div className="total_holder grand">
              <span>Grand Total (before retention):</span>
              <div>${this.state.form.lineItemsTotal + this.state.form.lineItems_manHours_total}</div>
          </div>
          <div className="form_row submit d-grid gap-2">
            <Button variant="info" size="lg" onClick={this.handleSave}>SAVE</Button>{" "}{" "}
            <Button variant="warning" size="lg" onClick={this.handleSubmit}>SUBMIT</Button>
          </div>
      </Form>
    );
  }
}

export default LienForm;
