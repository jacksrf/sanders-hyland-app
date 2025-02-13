import React, { Component, useRef } from "react";
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import ReactPDF from '@react-pdf/renderer';

import Loading from "../components/Loading";
import {useHistory} from 'react-router-dom';
// import moment from "moment";
import moment from 'moment-timezone';

import {Form} from 'react-bootstrap';
import DatePicker from "react-datepicker";

import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import 'primeicons/primeicons.css';  
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
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

moment().tz("America/Chicago").format();

class LienForm extends Component {


  constructor(props) {
    console.log(props)
    super(props);
    const user = this.props.user;
    this.toast = React.createRef(null);
    this.toastBC = React.createRef(null);
    var date = moment().format()
    this.state = {
      "data": this.props.data,
      "form": this.props.data,
      "contractor": {
        "_id": ""
      },
      'projectManagers': [{}],
      'jobs': [],
      'materials': [],
      'errorStatus': false,
      'errorState': "",
      "attachementStatus": false,
      "attachementStatusError": false,
      "loadingStatus": false
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
    this.handleLineItemChange3 = this.handleLineItemChange3.bind(this);
    this.handlePms = this.handlePms.bind(this)
    this.deleteLineItem = this.deleteLineItem.bind(this);
    this.deleteHourlyLineItem = this.deleteHourlyLineItem.bind(this);
    this.handleDataUpdate = this.handleDataUpdate.bind(this);
    this.handleJobs = this.handleJobs.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleLineItemDateChange = this.handleLineItemDateChange.bind(this)
    this.handleLineItemDateChange2 = this.handleLineItemDateChange2.bind(this)
    this.handleLineItemDateChange3 = this.handleLineItemDateChange3.bind(this)
    this.handleInvoiceNumber = this.handleInvoiceNumber.bind(this)
    this.handleMaterials = this.handleMaterials.bind(this)
    this.closeError = this.closeError.bind(this);
    this.addInput_other = this.addInput_other.bind(this);
    this.setSelectedFile = this.setSelectedFile.bind(this);
    this.confirm = this.confirm.bind(this);
    this.show = this.show.bind(this);
    this.clear = this.clear.bind(this);
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

    show() {
        this.toast.current.show({ severity: 'success', summary: 'Submission Received', detail: 'Thank you, we have received your submission.' });
    };

    clear(submit) {
        this.toastBC.current.clear();
        this.handleSubmit()
    };

    confirm(e) {
      this.clear(true)
      e.preventDefault();
      var m = moment().day();
      console.log(m)
      if (m === 3) {
        var a = moment().hour();
        console.log(a)
        if (a > 10) {
          this.toastBC.current.show({
            severity: 'info',
            sticky: true,
            className: 'border-none',
            content: (
                <div className="flex flex-column align-items-center" style={{ flex: '1' }}>
                    <div className="text-center">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                        <div className="font-bold text-xl my-3">Please be aware that this was submitted after the 10am Central cut off and will be approved for next weeks pay period.<br></br><br></br>Click accept if you understand.<br></br></div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={(e) => this.clear(true)} type="button" label="Confirm" className="p-button-success w-6rem" />
                        <Button onClick={(e) => this.clear(false)} type="button" label="Cancel" className="p-button-warning w-6rem" />
                    </div>
                </div>
            )
        });
        } else {
          // this.toast.current.show({ severity: 'success', summary: 'Submission Received', detail: 'Its Wednesday before 10' });
          // console.log('')
          this.clear(true)
        }
      } else {
        this.clear(true)
      }

        
    };

  async setSelectedFile(event) {
    this.setState({
          loadingStatus: true
    }); 
    console.log(event)
    const form = this.state.form;
    const file_data = new FormData();
    console.log(event.target.files[0])
    file_data.append('file', event.target.files[0]);
    file_data.append('contractor_id', this.state.contractor._id)
    console.log(file_data.get('file'))

    // var response = await fetch("http://localhost:4000/file_upload/", {
    var response = await fetch("https://sanders-hyland-server.herokuapp.com/file_upload/", {
      method: "POST",
      body: file_data
    })
    .then((response) => response.json())
    console.log(response)
    if (response.status === "success") {
      form.attachment_url = response.filePath.replace('https://sanders-hyland.s3.amazonaws.com/uploads/', "");
      this.setState({
        attachementStatus: true,
        attachementStatusError: false,
        form: form,
        loadingStatus: false,
      });
      console.log(this.state.form)
    } else {
      this.setState({
        attachementStatusError: true,
        attachementStatus: false,
        loadingStatus: false,
      });
    }
  }

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

  addInput_other(event) {
    event.preventDefault()
    console.log(event)
    const form = this.state.form;
    const current_lineItems_other = form.lineItems_other;
    const newLineItem2 = {
      "id": (current_lineItems_other.length+1),
      "date": moment().toDate(),
      "description": '',
      "quantity": '',
      "price_per": '',
      "total": ''
    };
    current_lineItems_other.push(newLineItem2)
    console.log(current_lineItems_other)
    form.lineItems_other = current_lineItems_other;
    this.setState({
      form: form
    });
  };

  handleLineItemChange(event) {
    event.preventDefault();
    console.log(event);
    const id = Number(event.target.id);
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
     console.log(current_lineItems[id])
     current_lineItems[id][name] = value;
     if (name === "price_per" || name === "quantity") {
       var total = current_lineItems[id].quantity * current_lineItems[id].price_per;
       current_lineItems[id].total = total;
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
    const id = Number(event.target.id);
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
     console.log(current_lineItems[id])
     current_lineItems[id][name] = value;
     var total = Number(current_lineItems[id].men) * Number(current_lineItems[id].hours) * Number(current_lineItems[id].rate);
     current_lineItems[id].total = total;
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

  handleLineItemChange3(event) {
    event.preventDefault();
    console.log(event);
    const id = Number(event.target.id);
    console.log(id)
     const target = event.target;
     console.log(target)
     const value = target.value;
     console.log(value)
     const name = target.name;
     console.log(name)
     const form = this.state.form;
     const current_lineItems = form.lineItems_other;
     console.log(current_lineItems)
     console.log(current_lineItems[id])
     current_lineItems[id][name] = value;
     var total = Number(current_lineItems[id].quantity) *  Number(current_lineItems[id].price_per);
     current_lineItems[id].total = total;
     var lineItemsTotal = 0;
     current_lineItems.map((item, i) => {
       lineItemsTotal += item.total;
       if (i === current_lineItems.length - 1) {
         form.lineItems_other = current_lineItems;
         form.lineItems_other_total = lineItemsTotal;
         console.log(form)
         this.setState({
           form: form
         });
       }
     })

  };

    handleLineItemDateChange3(i, date) {
    // event.preventDefault();
     const form = this.state.form;
     const current_lineItems = form.lineItems_other;
     console.log(current_lineItems)
     console.log(current_lineItems[i])
     current_lineItems[i].date = date;

     var lineItemsTotal = 0;
     current_lineItems.map((item, i) => {
       lineItemsTotal += item.total;
       if (i === current_lineItems.length - 1) {
         form.lineItems_other = current_lineItems;
         form.lineItems_other_total = lineItemsTotal;
         this.setState({
           form: form
         });
       }
     })


  };

    deleteLineItem(event, key) {
      event.preventDefault()
      console.log(event);
      console.log(key)
       const form = this.state.form;
       const current_lineItems = form.lineItems;
       console.log(current_lineItems)
       current_lineItems.splice(key, 1);

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

    deleteHourlyLineItem(event, key) {
      event.preventDefault()
      console.log(event);
      // const id = event.target.id;
      // console.log(id)

       const form = this.state.form;
       const current_lineItems = form.lineItems_manHours;
       console.log(current_lineItems)
       current_lineItems.splice(key, 1);

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


    deleteOtherLineItem(event, key) {
      event.preventDefault()
      console.log(event);
      // const id = event.target.id;
      console.log(key)

       const form = this.state.form;
       const current_lineItems = form.lineItems_other;
       console.log(current_lineItems)
       current_lineItems.splice(key, 1);

       var lineItemsTotal = 0;
       current_lineItems.map((item, i) => {
         lineItemsTotal += item.total;
         if (i === current_lineItems.length - 1) {
           form.lineItems_other = current_lineItems;
           form.lineItems_other_total = lineItemsTotal;
           this.setState({
             form: form
           });
         }
       })
    }

    async handlePmJobs (id, id2) {
      console.log(id)
        var jobs = await fetch("https://sanders-hyland-server.herokuapp.com/jobs/"+ id+ "/" + id2, {
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
      const form = this.state.form;
      console.log(this.state.data.jobNumber)
      form.jobNumber = this.state.data.jobNumber;
      this.setState({
        form: form
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
     
     if (name === 'projectManager') {
       console.log(event)
       console.log(this.state.projectManagers)
       var projectManagerCurrent = this.state.projectManagers.find(x => x.name === target.value);
       console.log(projectManagerCurrent)

       form.projectManagerId = projectManagerCurrent._id
       this.handlePmJobs(projectManagerCurrent._id, this.state.contractor._id);
     } else if (name === 'jobNumber') {

       var jobCurrent = this.state.jobs.find(x => x._id === target.value);
       console.log(jobCurrent);
       console.log(this.state.contractor)
       var contractorFromJob = jobCurrent.contractors.find(x => x.id === this.state.contractor._id);
       console.log(contractorFromJob)
       form.retention = contractorFromJob.retention;
       form.job_id = jobCurrent._id;
       form.jobNumber = jobCurrent.number;
       form.projectManagerId = jobCurrent.project_managers[0].id;
       form.projectManager = jobCurrent.project_managers[0].name;
     } else {
        form[name] = value;
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
    const studentId = window.location.href.replace('https://', '').replace('http://', '').split('/')[2]
    // e.preventDefault();
     const form = this.state.form;
     console.log(form)
     if (this.state.form.jobNumber != "" && this.state.form.job_id != "") {
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
        this.show();
        var current_props = this.props;
        setTimeout(function() {
          current_props.history.push('/pdf/'+response.id)
        }, 1000)
        
      }
     } else {
       this.setState({
          errorStatus: true,
          errorText: "Please select a Job Number to be able to save!"
        }); 
      }

  }



  

  async handleSave(e) {
    console.log(this.state.form)
    const studentId = window.location.href.replace('https://', '').replace('http://', '').split('/')[2]
    e.preventDefault();
      console.log(studentId)
      console.log(this.state.form)
      if (this.state.form.jobNumber != "" && this.state.form.job_id != "") {
      if (studentId != undefined) {
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
      } else {
       this.setState({
          errorStatus: true,
          errorText: "Please select a Job Number to be able to save!"
        }); 
      }
  }

  closeError(event) {
    event.preventDefault()
   this.setState({
          errorStatus: false,
          errorText: ""
        }); 
  }
  
  
  async handleDataUpdate() {
    const studentId = window.location.href.replace('https://', '').replace('http://', '').split('/')[2]
    const response = await fetch(
      "https://sanders-hyland-server.herokuapp.com/pdf/"+ studentId
    ).then((response) => response.json());
    console.log(response)
    console.log(response.contractorCompany)
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
    if (!response.lineItems_other) {
      response.lineItems_other = [];
      response.lineItems_other_total = 0;
      this.setState({
      data: response,
      form: response
    });
    } else {
      this.setState({
      data: response,
      form: response
    });
    }
    
    console.log(response.projectManagerId)
    this.handlePmJobs(response.projectManagerId, response.contractor_id);
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

    this.setState({
      projectManagers: response
    });
  }

  async handleJobs(id, id2) {
    var response = await fetch("https://sanders-hyland-server.herokuapp.com/jobs/", {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((response) => response.json())
    console.log(response)
    this.setState({
      jobs: response
    });
    // const form = this.state.form;
    console.log(response)
    // form.jobNumber = this.state.data.jobNumber;
  }

  async handleMaterials() {
    var materials = await fetch("https://sanders-hyland-server.herokuapp.com/materials", {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((materials) => materials.json())

    this.setState({
      materials: materials
    });
  }

  async handleInvoiceNumber() {
    var response = await fetch("https://sanders-hyland-server.herokuapp.com/invoice-number", {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((response) => response.json())
    console.log(response)
    const currentForm = this.state.form;
    var setNumber = Number(response);
    currentForm.invoice = setNumber.toString().padStart(5, '0');

    this.setState({
      form: currentForm
    });
  }

  async handleContractor() {
    var contractor = await fetch("https://sanders-hyland-server.herokuapp.com/user/"+ this.props.user.email, {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((contractor) => contractor.json())
    console.log(contractor)
    const formNow = this.state.form;
    console.log(contractor)
    formNow.contractor_id = contractor._id;
    formNow.contractor = contractor.name;
    formNow.contractorCompany = contractor.company;

    this.setState({
      form: formNow,
      contractor: contractor
    });
  }


  componentDidMount() {
    this.handleContractor()
    this.handleJobs()
    this.handleMaterials()

    // this.handleJobs()
    if (this.state.form.invoice === 0) {
      this.handleInvoiceNumber()
    }
    console.log(window.location.href.replace('https://', '').replace('http://', '').split('/'))
    const studentId = window.location.href.replace('https://', '').replace('http://', '').split('/')[2]
    console.log(studentId)
    if (studentId != undefined) {
      this.handleDataUpdate()
    }

  }


  render() {
    return (
      <Card>
      <Form>
          <div className={ this.state.errorStatus ? 'error_popup active' : 'error_popup' }>
            <div className="error_popup_holder">
              <div className="errortext">{ this.state.errorText }</div>
              <Button raised rounded severity="info" size="lg" label="CLOSE" onClick={(e) => this.closeError(e)} />
            </div>
          </div>
          <div className={ this.state.loadingStatus ? 'loading active' : 'loading' }>
            <Loading />
          </div>
          <Form.Control type="hidden" name="contractor" value={this.state.form.contractor} onChange={this.handleInputChange} />
          <Form.Control type="hidden" name="projectManagerId" value={this.state.form.projectManagerId}/>

          <Form.Group className="form_row full">
            <Form.Label>
              <span>Job Number:</span>
            </Form.Label>
            <Form.Select name="jobNumber" value={this.state.form.job_id} onChange={this.handleInputChange}  aria-label="Default select example">
            <option id="none" key="none">Select One</option>
            {this.state.jobs.map((job, i) => {
              // if (job.project_manager_name != "Trey Jackson") {
              // console.log(job.contractors)
              if (job.contractors) {
                // console.log(this.state.contractor._id)
                var jobCheck = job.contractors.find(x => x.id === this.state.contractor._id);
                // console.log(jobCheck)
                if (jobCheck != undefined) {
                   return (
                 <option key={i} value={job._id}>{job.number} - {job.name}</option>
               );
                }
              
              }
            // }
              
             })}
            </Form.Select>
          </Form.Group>

          <Form.Group className="form_row full">
            <Form.Label>
              <span>Project Manager:</span>
            </Form.Label>
            <Form.Control type="text" name="projectManager" value={this.state.form.projectManager} disabled/>
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
              if (i === 0) {
                   return (
                 <div className="multiInputRow" key={0}>
                 <Form.Group className="lineitem_row">
                 <Form.Label className="small_input">
                   <span>Date:</span>
                   <DatePicker name="date" id={0} selected={moment(this.state.form.lineItems[i].date).toDate()} onChange={(date:Date) => this.handleLineItemDateChange(i, date)} />
                 </Form.Label>
                 <Form.Label className="large_input">
                   <span>Description:</span>
                   <Form.Control type="text" id={0} name="description" value={this.state.form.lineItems[i].description} onChange={this.handleLineItemChange} />
                 </Form.Label>
                   <Form.Label className="medium_input">
                     <span>Product Code:</span>
                     <Form.Control type="text" id={0} name="product_code" value={this.state.form.lineItems[i].product_code} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="medium_input">
                     <span>Product Dimensions:</span>
                     <Form.Control type="text" id={0} name="product_dimensions" value={this.state.form.lineItems[i].product_dimensions} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Material:</span>
                     <Form.Select id={0} name="material" value={this.state.form.lineItems[i].material} onChange={this.handleLineItemChange}>
                        <option id="none" key="none">Select One</option>
                        {this.state.materials.map((item, i) => {
                           return (
                             <option key={i} value={item.name}>{item.name}</option>
                           );
                         })}
                     </Form.Select>
                   </Form.Label>
                   </Form.Group>
                   <Form.Group className="lineitem_row">
                   <Form.Label className="small_input">
                     <span>Quantity:</span>
                     <Form.Control type="number" id={0}  name="quantity" value={this.state.form.lineItems[i].quantity} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Type:</span>
                     <Form.Select id={0} name="type" value={this.state.form.lineItems[i].type} onChange={this.handleLineItemChange}>
                        <option id="none" key="none">Select One</option>
                        <option value="sf">SF - square feet</option>
                        <option value="sy">SY - square yards</option>
                        <option value="lf">LF - linear feet</option>
                        <option value="ea">EA - Each</option>
                     </Form.Select>
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Price Per:</span>
                     <Form.Control type="number" id={0}  name="price_per" value={this.state.form.lineItems[i].price_per} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Total:</span>
                     <Form.Control type="number" id={0}  name="total" value={this.state.form.lineItems[i].total} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <div></div>
                     <Button raised rounded severity="danger" label="DELETE" id={0} onClick={(e) => this.deleteLineItem(e, i)} />
                  </Form.Label>
                  </Form.Group>
                 </div>
               );
              } else {
                   return (
                 <div className="multiInputRow" key={i}>
                 <Form.Group className="lineitem_row">
                 <Form.Label className="small_input">
                   <span>Date:</span>
                   <DatePicker name="date" id={i} selected={moment(this.state.form.lineItems[i].date).toDate()} onChange={(date:Date) => this.handleLineItemDateChange(i, date)} />
                 </Form.Label>
                 <Form.Label className="large_input">
                   <span>Description:</span>
                   <Form.Control type="text" id={i} name="description" value={this.state.form.lineItems[i].description} onChange={this.handleLineItemChange} />
                 </Form.Label>
                   <Form.Label className="medium_input">
                     <span>Product Code:</span>
                     <Form.Control type="text" id={i} name="product_code" value={this.state.form.lineItems[i].product_code} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="medium_input">
                     <span>Product Dimensions:</span>
                     <Form.Control type="text" id={i} name="product_dimensions" value={this.state.form.lineItems[i].product_dimensions} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Material:</span>
                     <Form.Select id={i} name="material" value={this.state.form.lineItems[i].material} onChange={this.handleLineItemChange}>
                        <option id="none" key="none">Select One</option>
                        {this.state.materials.map((item, i) => {
                           return (
                             <option key={i} value={item.name}>{item.name}</option>
                           );
                         })}
                     </Form.Select>
                   </Form.Label>
                   </Form.Group>
                   <Form.Group className="lineitem_row">
                   <Form.Label className="small_input">
                     <span>Quantity:</span>
                     <Form.Control type="number" id={i}  name="quantity" value={this.state.form.lineItems[i].quantity} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Type:</span>
                     <Form.Select id={i} name="type" value={this.state.form.lineItems[i].type} onChange={this.handleLineItemChange}>
                        <option id="none" key="none">Select One</option>
                        <option value="sf">SF - square feet</option>
                        <option value="sy">SY - square yards</option>
                        <option value="lf">LF - linear feet</option>
                        <option value="ea">EA - Each</option>
                     </Form.Select>
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Price Per:</span>
                     <Form.Control type="number" id={i}  name="price_per" value={this.state.form.lineItems[i].price_per} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Total:</span>
                     <Form.Control type="number" id={i}  name="total" value={this.state.form.lineItems[i].total} onChange={this.handleLineItemChange} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <div></div>
                     <Button raised rounded severity="danger" label="DELETE" id={i} onClick={(e) => this.deleteLineItem(e, i)} />
                  </Form.Label>
                  </Form.Group>
                 </div>
               );
              }
             
             })}
             </Form.Group>
           <Button className="addLineButton" raised rounded severity="success" onClick={this.addInput} label="Add Work Line Item" />

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
              if (i === 0) {
return (
                 <div className="multiInputRow" key={0}>
                   <Form.Label className="small_input">
                     <span>Date:</span>
                     <DatePicker name="date" id={0} selected={moment(this.state.form.lineItems_manHours[i].date).toDate()} onChange={(date:Date) => this.handleLineItemDateChange2(i, date)} />
                   </Form.Label>
                   <Form.Label className="large_input">
                     <span>Description:</span>
                     <Form.Control type="textarea" id={0} name="description" value={this.state.form.lineItems_manHours[i].description} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Men:</span>
                     <Form.Control type="number" id={0}  name="men" value={this.state.form.lineItems_manHours[i].men} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Hours:</span>
                     <Form.Control type="number" id={0}  name="hours" value={this.state.form.lineItems_manHours[i].hours} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>rate:</span>
                     <Form.Control type="number" id={0}  name="rate" value={this.state.form.lineItems_manHours[i].rate} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Total:</span>
                     <Form.Control type="number" id={0}  name="total" value={this.state.form.lineItems_manHours[i].total} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <div></div>
                     <Button raised rounded severity="danger" id={0} label="DELETE" onClick={(e) => this.deleteHourlyLineItem(e, i)} />
                  </Form.Label>
                 </div>
               );
              } else {
                return (
                 <div className="multiInputRow" key={item.id}>
                   <Form.Label className="small_input">
                     <span>Date:</span>
                     <DatePicker name="date" id={i} selected={moment(this.state.form.lineItems_manHours[i].date).toDate()} onChange={(date:Date) => this.handleLineItemDateChange2(i, date)} />
                   </Form.Label>
                   <Form.Label className="large_input">
                     <span>Description:</span>
                     <Form.Control type="textarea" id={i} name="description" value={this.state.form.lineItems_manHours[i].description} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Men:</span>
                     <Form.Control type="number" id={i}  name="men" value={this.state.form.lineItems_manHours[i].men} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Hours:</span>
                     <Form.Control type="number" id={i}  name="hours" value={this.state.form.lineItems_manHours[i].hours} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>rate:</span>
                     <Form.Control type="number" id={i}  name="rate" value={this.state.form.lineItems_manHours[i].rate} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Total:</span>
                     <Form.Control type="number" id={i}  name="total" value={this.state.form.lineItems_manHours[i].total} onChange={this.handleLineItemChange2} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <div></div>
                     <Button raised rounded severity="danger" id={item.key} label="DELETE" onClick={(e) => this.deleteHourlyLineItem(e, i)} />
                  </Form.Label>
                 </div>
               );
              }
               
             })}
             </Form.Group>
           <Button className="addLineButton" raised rounded severity="success" label="Add Hours Line Item" onClick={this.addInput_hours} />
           <div className="total_holder">
               <span>Hourly Items Total:</span>
               <div>${this.state.form.lineItems_manHours_total}</div>
           </div>
          </Form.Group>
          <div className="formDivider"></div>

          <Form.Group className="form_row section">
            <div className="section_title">Scope(s) of Other Work Requesting Payment:</div>
            <Form.Group className="form_row">
            {this.state.form.lineItems_other.map((item, i) => {
              if (i === 0) {
                  return (
                 <div className="multiInputRow" key={0}>
                   <Form.Label className="small_input">
                     <span>Date:</span>
                     <DatePicker name="date" id={0} selected={moment(this.state.form.lineItems_other[i].date).toDate()} onChange={(date:Date) => this.handleLineItemDateChange3(i, date)} />
                   </Form.Label>
                   <Form.Label className="large_input">
                     <span>Description:</span>
                     <Form.Control type="textarea" id={0} name="description" value={this.state.form.lineItems_other[i].description} onChange={this.handleLineItemChange3} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Quantity:</span>
                     <Form.Control type="number" id={0}  name="quantity" value={this.state.form.lineItems_other[i].quantity} onChange={this.handleLineItemChange3} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Price Per:</span>
                     <Form.Control type="number" id={0}   name="price_per" value={this.state.form.lineItems_other[i].price_per} onChange={this.handleLineItemChange3} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Total:</span>
                     <Form.Control type="number" id={0}   name="total" value={this.state.form.lineItems_other[i].total} onChange={this.handleLineItemChange3} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <div></div>
                     <Button raised rounded severity="danger" id={0} label="DELETE" onClick={(e) => this.deleteOtherLineItem(e, i)} />
                  </Form.Label>
                 </div>
               );
              } else {
                return (
                 <div className="multiInputRow" key={i}>
                   <Form.Label className="small_input">
                     <span>Date:</span>
                     <DatePicker name="date" id={i} selected={moment(this.state.form.lineItems_other[i].date).toDate()} onChange={(date:Date) => this.handleLineItemDateChange3(i, date)} />
                   </Form.Label>
                   <Form.Label className="large_input">
                     <span>Description:</span>
                     <Form.Control type="textarea" id={i} name="description" value={this.state.form.lineItems_other[i].description} onChange={this.handleLineItemChange3} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Quantity:</span>
                     <Form.Control type="number" id={i}  name="quantity" value={this.state.form.lineItems_other[i].quantity} onChange={this.handleLineItemChange3} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Price Per:</span>
                     <Form.Control type="number" id={i}  name="price_per" value={this.state.form.lineItems_other[i].price_per} onChange={this.handleLineItemChange3} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <span>Total:</span>
                     <Form.Control type="number" id={i}  name="total" value={this.state.form.lineItems_other[i].total} onChange={this.handleLineItemChange3} />
                   </Form.Label>
                   <Form.Label className="small_input">
                     <div></div>
                     <Button raised rounded severity="danger" id={i} label="DELETE" onClick={(e) => this.deleteOtherLineItem(e, i)} />
                  </Form.Label>
                 </div>
               );
              }
               
             })}
             </Form.Group>
           <Button className="addLineButton" raised rounded severity="success" label="Add Other Line Item" onClick={this.addInput_other} />
           <div className="total_holder">
               <span>Other Items Total:</span>
               <div>${this.state.form.lineItems_other_total}</div>
           </div>
          </Form.Group>


          <div className="total_holder">
              <span>Retention ({this.state.form.retention}%):</span>
              <div>${Number((Number(this.state.form.lineItemsTotal) + Number(this.state.form.lineItems_manHours_total) + Number(this.state.form.lineItems_other_total)) * (Number(this.state.form.retention)/100)).toFixed(2)}</div>
          </div>
          <div className="formDivider"></div>
          <div className="total_holder grand">
              <span>Grand Total (after retention):</span>
              <div>${Number(Number(this.state.form.lineItemsTotal) + Number(this.state.form.lineItems_manHours_total) + Number(this.state.form.lineItems_other_total)) - ((Number(this.state.form.lineItemsTotal) + Number(this.state.form.lineItems_manHours_total) + Number(this.state.form.lineItems_other_total)) * (Number(this.state.form.retention)/100)).toFixed(2)}</div>
          </div>

          <Form.Group className="form_row section attachment">
            <div className="section_title">Add File Attachment:</div>
            <div className={this.state.form.attachment_url ? 'attachementSaved active' : 'attachementSaved'}>Current attachment: {this.state.form.attachment_url}</div>
            <Form.Control type="file" onChange={(e) => this.setSelectedFile(e)}/>
            <span className={this.state.attachementStatusError ? 'attachementError active' : 'attachementError'}>Attachment Upload Failed!</span>
            <span className={this.state.attachementStatus ? 'attachementSuccess active' : 'attachementSuccess'}>Attachment Upload Successful! Click save or submit to connect it to the application!</span>
          </Form.Group>

         
      </Form>

       <div className="form_row submit d-grid gap-2">
            <Button raised rounded severity="info" size="lg" label="SAVE" onClick={this.handleSave} />{" "}{" "}
            <Button raised rounded severity="warning" size="lg" label="SUBMIT" onClick={this.confirm} />
          </div>

          <Toast ref={this.toast} />
          <Toast ref={this.toastBC} position="bottom-center" />
      </Card>
      
    );
  }
}

export default LienForm;
