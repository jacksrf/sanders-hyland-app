import React, { Component } from "react";

import { Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


class LienForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'jobNumber': '',
      'contractor': '',
      'lineItems': [
        {
          "id": 1,
          "description": '',
          "quantity": '',
          "type": '',
          "price_per": '',
          "total": ''
        }
      ]
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };


addInput(e) {
  e.preventDefault()
};

// handleLineItemChange(e) {
//     e.preventDefault();
//
//     const index = e.target.id;
//     // setArr(s => {
//     //   const newArr = s.slice();
//     //   newArr[index].value = e.target.value;
//     //
//     //   return newArr;
//     // });
//   };

  handleInputChange(event) {
      console.log(event);
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
      <form>
          <div className="form_row full">
            <label>
              <span>Contractor:</span>
              <input type="text" name="contractor" value={this.state.contractor} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className="form_row full">
            <label>
              <span>Job Number:</span>
              <input type="text" name="jobNumber" value={this.state.jobNumber} onChange={this.handleInputChange} />
            </label>
          </div>
          <div className="form_row section">
          <div className="section_title">Scope(s) of Work Completed Requesting Payment:</div>
          {this.state.lineItems.map((item, i) => {
             return (
               <div className="multiInputRow" key={item.id}>
                 <label className="medium_input">
                   <span>Description:</span>
                   <textarea type="text" name="description" value={this.state.lineItems[i].description} onChange={this.handleLineItemChange} />
                 </label>
                 <label className="small_input">
                   <span>Quantity:</span>
                   <input type="text" name="quantity" value={this.state.lineItems[i].quantity} onChange={this.handleLineItemChange} />
                 </label>
                 <label className="small_input">
                   <span>Type:</span>
                   <input type="text" name="type" value={this.state.lineItems[i].type} onChange={this.handleLineItemChange} />
                 </label>
                 <label className="small_input">
                   <span>Price Per:</span>
                   <input type="text" name="price_per" value={this.state.lineItems[i].price_per} onChange={this.handleLineItemChange} />
                 </label>
                 <label className="small_input">
                   <span>Total:</span>
                   <input type="text" name="total" value={this.state.lineItems[i].total} onChange={this.handleLineItemChange} />
                 </label>
               </div>
             );
           })}

           <button onChange={this.addInput}>+</button>
          </div>
          <div className="form_row">

          </div>
      </form>
    );
  }
}

export default LienForm;
