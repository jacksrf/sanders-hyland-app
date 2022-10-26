import React, { useState, useRef, useLayoutEffect } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import LienForm from "../components/LienForm";
import { useHistory, useLocation} from 'react-router-dom';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import SignatureCanvas from 'react-signature-canvas';
import moment from "moment";
import classNames from 'classnames';

import logo_small from "../assets/sanders-hyland-logo-lg.png";
import roboto from "../assets/fonts/Roboto-Regular.ttf"
import robotoBold from "../assets/fonts/Roboto-Bold.ttf"
// Create styles

Font.register({ family: 'Roboto', src: roboto })
Font.register({ family: 'Roboto Bold', src: robotoBold })



const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: 'white',
    fontFamily: "Roboto"
    // marginTop: "5%",
    // marginBottom: "5%"
  },
  section: {
    margin: "2.5%",
    padding: "10px",
    // flexGrow: 1,
    width: "95%",
    float: "left",
    boxSizing: "border-box"
  },
  pdf_logo: {
    width: 100
  },
  logo_row: {
    alignItems: 'center',
    width: '100%'
  },
  section_title: {
    fontSize: '20px',
    fontWeight: 'bold',
    paddingBottom: "10px",
    borderBottomWidth: "2px",
    borderBottomColor: "grey",
    marginBottom: "10px",
    marginTop: "30px",
    fontFamily: "Roboto Bold",
  },
  paragraph: {
    fontSize: "12px",
    lineHeight: "1.4",
    fontWeight: '300'
  },
  list: {
    width: "100%"
  },
  list_row_header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: 'center',
    fontSize: '12px',
    paddingBottom: "10px",
    borderBottomWidth: "1px",
    borderBottomColor: "grey",
    marginBottom: "8px",
  },
  list_row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: 'center',
    fontSize: '12px'
  },
  list_item_header: {
    textAlign: "center",
    width: "12%",
    fontWeight: "bold",
    fontFamily: "Roboto Bold",
    // borderBottomWidth: "1px",
    // borderBottomColor: "black",
    paddingBottom: "5px"
  },
  list_item_header_description: {
    textAlign: "center",
    width: "35%",
    fontWeight: "bold",
    fontFamily: "Roboto Bold",
    // borderBottomWidth: "1px",
    // borderBottomColor: "black",
    paddingBottom: "5px"
  },
  list_item: {
    textAlign: "center",
    width: "12%",
    paddingTop: "5px",
    paddingBottom: "5px"
  },
  list_item_description: {
    textAlign: "center",
    width: "35%",
    paddingTop: "5px",
    paddingBottom: "5px"
  },
  list_item_blank: {
    textAlign: "center",
    width: "12%",
    paddingTop: "5px",
    paddingBottom: "5px",
  },
  list_item_blank_description: {
    textAlign: "center",
    width: "35%",
    paddingTop: "5px",
    paddingBottom: "5px",
  },
  copyText: {
    fontSize: "13px",
    lineHeight: "1.2",
    marginTop: "5px",
    marginBottom: "5px",
    width: "100%"
  },
  bold: {
    fontWeight: "bold",
    fontFamily: "Roboto Bold",
  },
  signature_section: {
    margin: "2.5%",
    padding: "10px",
    // flexGrow: 1,
    width: "95%",
    float: "left",
    boxSizing: "border-box"
  },
  signature_row: {
    width: "100%",
    marginTop: "20px",
    marginBottom: "0px"
  },
  name: {
    fontSize: "13px",
    lineHeight: "1.2",
    marginTop: "5px",
    marginBottom: "5px",
    width: "100%"
  },
  signature: {
    borderBottom: "2px",
    width: "200px",
    height: "50px"
  },
  copyTitle: {
    fontWeight: "bold",
    fontFamily: "Roboto Bold",
    fontSize: "14px"
  }
});




export const PdfComponent = () => {
  const history = useHistory();
  var sigPad = {}
  const [data, setData] = useState({
    "_id":"",
    "date":"",
    "contractor_id":"",
    "jobNumber":"",
    "projectManager":"",
    "projectManagerId":"",
    "contractor":"",
    "startDate":"",
    "endDate":"",
    "lineItems":[],
    "lineItemsTotal": 0,
    "lineItems_manHours":[],
    "lineItems_manHours_total": 0,
    "status":"started"
  });

  const [signActive, signActiveSet] = useState(false);
  const [signature, setSignature] = useState({'trimmedDataURL': ''})
  const [sigCanvas, setSigCanvas] = useState({"ref":''})
  // Create Document Component
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.logo_row}>
            <Image src={logo_small} style={styles.pdf_logo}></Image>
          </View>
          <View style={styles.section_title}>
            <Text>Application for Payment and Partial Release of Lien</Text>
          </View>

          <Text style={[styles.paragraph, {paddingTop: "5px", paddingBottom: "5px", fontSize: "16px"}]}>{moment(data.date.replace(' ', "T")).format("MMMM Do, YYYY")}</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Contractor:</Text> {data.contractor}</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Job Number:</Text> {data.jobNumber}</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Project Manager:</Text> {data.projectManager}</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Start Date:</Text> {data.startDate}</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>End Date:</Text> {data.endDate}</Text>

          <View style={styles.section_title}>
            <Text>Work Details</Text>
          </View>

          <View style={styles.list}>
            <View style={styles.list_row_header}>
              <Text style={styles.list_item_header}>Date</Text>
              <Text style={styles.list_item_header_description}>Description</Text>
              <Text style={styles.list_item_header}>Quantity</Text>
              <Text style={styles.list_item_header}>Type</Text>
              <Text style={styles.list_item_header}>Price Per</Text>
              <Text style={styles.list_item_header}>Total</Text>
            </View>
          {data.lineItems.map((item, i) => {
              // console.log(workTotal)
              // var total = total + Number(item.total);
              // setWorkTotal(total)
             return (
              <View style={styles.list_row} key={i}>
                <Text style={styles.list_item}>{item.date}</Text>
                <Text style={styles.list_item_description}>{item.description}</Text>
                <Text style={styles.list_item}>{item.quantity}</Text>
                <Text style={styles.list_item}>{item.type}</Text>
                <Text style={styles.list_item}>${item.price_per}</Text>
                <Text style={styles.list_item}>${item.total}</Text>
              </View>
            )
          })}
          <View style={styles.list_row}>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank_description}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={[styles.list_item_blank, {width: "24%", textAlign: "right", paddingRight: "2.5%", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px"}]}>Work Total:</Text>
            <Text style={[styles.list_item_blank, { textAlign: "center", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px"}]}> ${data.lineItemsTotal}</Text>
          </View>
          </View>

          <View style={styles.section_title}>
            <Text>Hourly Details</Text>
          </View>

          <View style={styles.list}>
            <View style={styles.list_row_header}>
              <Text style={styles.list_item_header}>Date</Text>
              <Text style={styles.list_item_header_description}>Description</Text>
              <Text style={styles.list_item_header}>Hours</Text>
              <Text style={styles.list_item_header}>Men</Text>
              <Text style={styles.list_item_header}>Rate</Text>
              <Text style={styles.list_item_header}>Total</Text>
            </View>
          {data.lineItems_manHours.map((item, i) => {
             return (
              <View style={styles.list_row} key={i}>
                <Text style={styles.list_item}>{item.date}</Text>
                <Text style={styles.list_item_description}>{item.description}</Text>
                <Text style={styles.list_item}>{item.hours}</Text>
                <Text style={styles.list_item}>{item.men}</Text>
                <Text style={styles.list_item}>${item.rate}</Text>
                <Text style={styles.list_item}>${item.total}</Text>
              </View>
            )
          })}
          <View style={styles.list_row}>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank_description}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={[styles.list_item_blank, {width: "24%", textAlign: "right", paddingRight: "2.5%", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px"}]}>Hourly Total:</Text>
            <Text style={[styles.list_item_blank, { textAlign: "center", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px"}]}> ${data.lineItems_manHours_total}</Text>
          </View>
          </View>

          <View style={[styles.list, {marginTop: "20px"}]}>
          <View style={styles.list_row}>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank_description}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={[styles.list_item_blank, {width: "24%", textAlign: "right", paddingRight: "2.5%", paddingTop: "10px", marginTop: "10px", borderTopWidth: "2px", borderBottomWidth: "2px", borderLeftWidth: "2px"}]}>Retention:</Text>
            <Text style={[styles.list_item_blank, { textAlign: "center", paddingTop: "10px", marginTop: "10px", borderTopWidth: "2px", borderBottomWidth: "2px", borderRightWidth: "2px"}]}>10%</Text>
          </View>
          </View>

          <View style={[styles.list, {marginTop: "20px"}]}>
          <View style={styles.list_row}>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank_description}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={[styles.list_item_blank, {width: "24%", textAlign: "right", paddingRight: "2.5%", paddingTop: "10px", marginTop: "10px", borderTopWidth: "2px", borderBottomWidth: "2px", borderLeftWidth: "2px"}]}>Retention Total:</Text>
            <Text style={[styles.list_item_blank, { textAlign: "center", paddingTop: "10px", marginTop: "10px", borderTopWidth: "2px", borderBottomWidth: "2px", borderRightWidth: "2px"}]}> ${((Number(data.lineItems_manHours_total) + Number(data.lineItemsTotal)) * .1)}</Text>
          </View>
          </View>

          <View style={[styles.list, {marginTop: "20px"}]}>
          <View style={styles.list_row}>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank_description}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={[styles.list_item_blank, {width: "24%", textAlign: "right", paddingRight: "2.5%", paddingTop: "10px", marginTop: "10px", borderTopWidth: "2px", borderBottomWidth: "2px", borderLeftWidth: "2px"}]}>Application Total:</Text>
            <Text style={[styles.list_item_blank, { textAlign: "center", paddingTop: "10px", marginTop: "10px", borderTopWidth: "2px", borderBottomWidth: "2px", borderRightWidth: "2px"}]}> ${(Number(data.lineItems_manHours_total) + Number(data.lineItemsTotal)) - ((Number(data.lineItems_manHours_total) + Number(data.lineItemsTotal)) * .1)}</Text>
          </View>
          </View>
        </View>
        <View style={styles.section} break>
          <Text style={styles.copyTitle}>Terms & Conditions</Text>
          <Text style={styles.copyText}>Having first been duly sworn, the undersigned authorized representative of the Subcontractor or on behalf of the Subcontractor, hereby warrants and certifies that Subcontractor has fully paid for all labor, equipment, services, incidentals and other bills and obligations of every kind or nature that relate to the subcontract, purchase orders, or other agreements, whether oral or written, between Subcontractor and Sanders Hyland Corp. for the referenced project.</Text>
          <Text style={styles.copyText}>Subcontractor hereby warrants that the premises of the above named project cannot be made subject to any valid lien or claim by anyone who furnishes material, supplies, labor, equipment, or services to Subcontractor for use in the above named project, and in consideration of the payment by Sanders Hyland Corp. Subcontractor hereby releases and waives any and all claims and liens whatsoever kind or nature against Sanders Hyland Corp., the Owner, the Architect and Engineers, and against the building, improvements or project and the land on which same is located with respect to work performed for obligations undertaken by Subcontractor or by any of Subcontractor’s laborers, Subcontractor’s suppliers, or equipment providers which in any way relates to the above mentioned construction improvements or project through the date of execution of this document, except those stated below (if none, so state):</Text>
          <Text style={styles.copyText}>The Subcontractor covenants to indemnify and save harmless and exonerate the Contractor, Owner, Architect and their respective directors, officers, employees and agents (the Indemnities) from and against all liability, claims and demands for bodily injury and property damage, arising out of any of the work undertaken by the Subcontractor, its directors, officers, employees, agents or its subcontractors, and arising out of any other operation no matter by whom performed for or on behalf of the Subcontractor, regardless of whether the claim, demand or suit is alleged to arise out of, in whole or in part, the negligence of any of the Indemnities.</Text>

          <View style={styles.signature_section}>
            <View style={styles.signature_row}>
              <Text style={styles.copyTitle}>Signature:</Text>
              <Text style={styles.name}>{data.contractor}</Text>
            </View>

            <View style={styles.signature_row}>
              <Text style={styles.copyTitle}>Date:</Text>
              <Text style={styles.name}>{moment(data.date.replace(' ', "T")).format("MMMM Do, YYYY")}</Text>
            </View>

            <View style={styles.signature_row}>
              <Text style={styles.copyTitle}>Witness/Approved by:</Text>
              <Text style={styles.signature}></Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

  const location = useLocation();
  const id = location.pathname.replace('/pdf/', '')
  console.log('id', id);

  const handleSubmit = async () => {
    const response = await fetch(
      "https://sanders-hyland-server.herokuapp.com/pdf/"+ id
    ).then((response) => response.json());
    console.log(response)
    setData(response)


  };

  const signApp = async (item) => {
    signActiveSet(true);
  }

  const closeSignature = async (item) => {
    signActiveSet(false);
  }

  const saveSignature = async (item) => {
    signActiveSet(false);
    var newData = data;
    newData.status = "signed";
    setData(newData)
    console.log(this.sigPad)
    setSignature({trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL('image/png')})
  }

  const editApp = async (item) => {
    history.push('/lien-form/' + item._id)
  };

  const submitApp = async (item) => {

      var response = await fetch("https://sanders-hyland-server.herokuapp.com/lien/submit/"+ item._id, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         }
      })
      .then((response) => response.json())
      console.log(response)
      history.push('/payments-submitted/')
  }


  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      handleSubmit();
      return;
    }

    console.log("componentDidUpdateFunction");
  });

  // useLayoutEffect(() => {
  //   // setWorkTotal(0);
  //   // setHourlyTotal(0);
  //   handleSubmit();
  // }, []);

  if (data.status === 'started') {
    return (
      <>
      <div className={ signActive ? 'signature active' : 'signature' }>
        <div className="signatureInner">
          <div className="instructions">Sign Here:</div>
          <SignatureCanvas penColor='black' canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} ref={(ref) => { this.sigPad = ref }}/>
          <div className="signature_buttons">
            <Button variant="warning" size="Lg" onClick={(e)=>{closeSignature(data)}}>CANCEL</Button>
            <Button variant="success" size="Lg" onClick={(e)=>{saveSignature(data)}}>SAVE</Button>
          </div>
        </div>
      </div>

      <div className='status started'>
        <Button variant="warning" size="Lg" onClick={(e)=>{editApp(data)}}>EDIT</Button>
        <Button variant="success" size="Lg" onClick={(e)=>{signApp(data)}}>SIGN</Button>
      </div>

      <PDFViewer>
        <MyDocument />
      </PDFViewer>
      </>
    );
  } else if (data.status === 'unsubmitted') {
    return (
      <>
      <div className={ signActive ? 'signature active' : 'signature' }>
        <div className="signatureInner">
          <div className="instructions">Sign Here:</div>
          <SignatureCanvas penColor='black' canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} />
          <div className="signature_buttons">
            <Button variant="warning" size="Lg" onClick={(e)=>{closeSignature(data)}}>CANCEL</Button>
            <Button variant="success" size="Lg" onClick={(e)=>{saveSignature(data)}}>SAVE</Button>
          </div>
        </div>
      </div>

      <div className='status unsubmitted'>
        <Button variant="warning" size="Lg" onClick={(e)=>{editApp(data)}}>EDIT</Button>
        <Button variant="success" size="Lg" onClick={(e)=>{signApp(data)}}>SIGN</Button>
      </div>

      <PDFViewer>
        <MyDocument />
      </PDFViewer>
      </>
    );
  } else if (data.status === 'approved') {
    return (
      <>

      <div className='status approved'>

      </div>

      <PDFViewer>
        <MyDocument />
      </PDFViewer>
      </>
    );
  } else if (data.status === 'rejected') {
    return (
      <>

      <div className='status rejected'>
        <Button variant="warning" size="Lg" onClick={(e)=>{editApp(data)}}>EDIT</Button>
        <Button variant="success" size="Lg" onClick={(e)=>{submitApp(data)}}>RESUBMIT</Button>
      </div>

      <PDFViewer>
        <MyDocument />
      </PDFViewer>
      </>
    );
  } else if (data.status === "signed") {
    return (
      <>

      <div className='status rejected'>
        <Button variant="warning" size="Lg" onClick={(e)=>{editApp(data)}}>EDIT</Button>
        <Button variant="success" size="Lg" onClick={(e)=>{submitApp(data)}}>SUBMIT</Button>
      </div>

      <PDFViewer>
        <MyDocument />
      </PDFViewer>
      </>
    );
  }

};

export default withAuthenticationRequired(PdfComponent, {
  onRedirecting: () => <Loading />,
});
