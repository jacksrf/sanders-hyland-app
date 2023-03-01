import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import SignaturePad from 'react-signature-canvas'
import { Button, Alert } from "reactstrap";

import styles from './styles.module.css'

class Signature extends Component {

  constructor(props) {
    console.log(props)
    super(props);
    const user = this.props.user;
    this.state = {
      "trimmedDataURL": null,
      "signActive": false,
      "signError": false,
    }
    this.editApp = this.editApp.bind(this);
    this.signApp = this.signApp.bind(this);
    this.trim = this.trim.bind(this);
    this.updateSigImage = this.updateSigImage.bind(this);
  };

  sigPad = {}
  clear = () => {
    this.sigPad.clear()
  }

  async updateSigImage() {
    console.log(this.state)
  }
  async trim() {
    const checkForSignature = this.sigPad.isEmpty(); 
    console.log(checkForSignature)
    console.log(this.sigPad.getTrimmedCanvas().toDataURL('image/png'))
    if (checkForSignature === false) {
      var signature_image = this.sigPad.getTrimmedCanvas().toDataURL('image/png').toString();
    this.setState({
      trimmedDataURL: signature_image,
      signActive: false
    });
    var newData = this.props.data;
    newData.contractor_signature = signature_image;
    newData.pm_signature = '';
    newData.status = 'signed';
    console.log(newData)
    var response = await fetch("https://sanders-hyland-server.herokuapp.com/update-signature/" + this.props.data._id, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(newData),
    })
    .then((response) => response.json())
    console.log(response)
    window.location.reload(false);
    } else {
      this.setState({
        signError: true
      });

    }
    
  }
  signApp() {
    this.setState({signActive:true});
  }
  editApp() {
    this.props.history.push('/lien-form/' + this.props.data._id)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(prevState)
    console.log(snapshot)
    console.log(this.state)
  }
  render () {
    return <div>
    <div className={ this.state.signActive ? 'signature active' : 'signature' }>
      <div className="signatureInner">
          <div className={this.state.signError ? 'error active' : 'error'}>Please sign your name before you submit!</div>
        <div className="instructions">Sign Here (use your finger or mouse):</div>
        <div className={styles.container}>
          <div className={styles.sigContainer}>
          <SignaturePad canvasProps={{height: 200, width: 400, className: styles.sigPad}}
            ref={(ref) => { this.sigPad = ref }} />
          </div>
          <div>
            <button className={styles.buttons} onClick={this.clear}>
              CLEAR
            </button>
            <button className={styles.buttons} onClick={this.trim}>
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>

    <div className='status started'>
      <Button variant="warning" size="Lg" onClick={this.editApp}>EDIT</Button>
      <Button variant="success" size="Lg" onClick={this.signApp}>SIGN</Button>
    </div>

    </div>
  }
}

export default Signature;
