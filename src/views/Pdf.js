import React, { useState, useRef, useLayoutEffect } from "react";
import { Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import LienForm from "../components/LienForm";
import Signature from "../components/signature";
import { useHistory, useLocation} from 'react-router-dom';
import ReactDOM from 'react-dom';
import { PDFDownloadLink, PDFViewer, BlobProvider } from '@react-pdf/renderer';
import ReactPDF ,{ Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import SignatureCanvas from 'react-signature-canvas';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Ripple } from 'primereact/ripple';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import moment from 'moment-timezone';

import 'primeicons/primeicons.css';  
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";


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
    fontFamily: "Roboto",
    // marginTop: "5%",
    // marginBottom: "5%"
    // margin: "2.5%",
    padding: "5%",
    // flexGrow: 1,
    // width: "95%",
    float: "left",
    boxSizing: "border-box"
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
  list_row_details: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "space-between",
    alignItems: 'center',
    fontSize: '12px',
    borderBottomWidth: "1px",
    borderBottomColor: "grey",
  },
  list_inner_row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: 'center',
    fontSize: '12px'
  },
  list_inner_row_top: {
    flexDirection: "column",
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
    textAlign: "left",
    width: "100%",
    paddingTop: "5px",
    paddingBottom: "5px"
  },
  list_item_description: {
    textAlign: "left",
    width: "100%",
    paddingTop: "5px",
    paddingBottom: "5px"
  },
  list_item_material: {
    textAlign: "left",
    width: "100%",
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
    width: "200px",
    height: "100px",
    marginTop: "20px",
    marginBottom: "0px"
  },
  signature_date: {
    width: "200px",
    height: "30px",
    marginTop: "0px",
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
    height: "0px"
  },
  copyTitle: {
    fontWeight: "bold",
    fontFamily: "Roboto Bold",
    fontSize: "14px"
  },
  footer: {
    fontSize: "12px",
    textAlign: "center",
    paddingBottom: "15px",
    bottom: "0px",
    position: "fixed"
  },
  signature_image: {
    width: "150px",
    marginTop: "10px",
    marginBottom: "5px",
    borderBottom: "2px",
    paddingBottom: "5px"
    // height: "157px"
  }
});




export const PdfComponent = () => {


  const history = useHistory();
  // const history = '';
  const {user} = useAuth0();
  // var sigCanvas = {}
  const [data, setData] = useState({
    "_id":"",
    "date":"",
    "contractor_id":"",
    "jobNumber":"",
    "job_id": "",
    "projectManager":"",
    "projectManagerId":"",
    "contractor":"",
    "contractorCompany":"",
    "startDate":"",
    "endDate":"",
    "lineItems":[],
    "lineItemsTotal": 0,
    "lineItems_manHours":[],
    "lineItems_manHours_total": 0,
    "lineItems_other":[],
    "lineItems_other_total": 0,
    "status":"started",
    "pm_signature": "",
    "contractor_signature": "",
    "comments": "",
    "retention": "",
    "invoice": 0
  });

  // Create Document Component
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
          <View style={styles.logo_row}>
            <Image src={logo_small} style={styles.pdf_logo}></Image>
          </View>
          <View style={styles.section_title}>
            <Text>Application for Payment and Partial Release of Lien</Text>
          </View>

          <Text style={[styles.paragraph, {paddingTop: "5px", paddingBottom: "5px", fontSize: "16px"}]}><Text style={styles.bold}>Invoice Number:</Text> #{data.invoice.toString().padStart(5, '0')}</Text>
          <Text style={[styles.paragraph, {paddingTop: "5px", paddingBottom: "5px", fontSize: "16px"}]}>{moment(data.date.replace(' ', "T")).format("MMMM Do, YYYY")}</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Contractor:</Text> {data.contractorCompany}</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Job Number:</Text> {data.jobNumber}</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Project Manager:</Text> {data.projectManager}</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>Start Date:</Text> {moment(data.startDate.replace(' ', "T")).format("MM/DD/YYYY")}</Text>
          <Text style={styles.paragraph}><Text style={styles.bold}>End Date:</Text> {moment(data.endDate.replace(' ', "T")).format("MM/DD/YYYY")}</Text>

          <View style={styles.section_title}>
            <Text>Work Details</Text>
          </View>

          <View style={styles.list}>
              <View style={styles.list_row_header}>
                <Text style={styles.list_item_header}>Date</Text>
                <Text style={styles.list_item_header}>Code</Text>
                <Text style={styles.list_item_header}>Dimensions</Text>
                <Text style={styles.list_item_header}>Quantity</Text>
                <Text style={styles.list_item_header}>Type</Text>
                <Text style={styles.list_item_header}>Price Per</Text>
                <Text style={styles.list_item_header}>Total</Text>
              </View>
            {data.lineItems.map((item, i) => {
              
               return (
                <View style={styles.list_row_details} key={i}>
                  <div style={styles.list_inner_row_top}>
                    <Text style={styles.list_item_description}>DESCRIPTION: {item.description}</Text>
                    <Text style={styles.list_item_material}>MATERIAL: {item.material}</Text>
                  </div>
                  <div style={styles.list_inner_row}>
                    <Text style={styles.list_item}>{moment(item.date.replace(' ', "T")).format("MM/DD/YYYY")}</Text>
                    <Text style={styles.list_item}>{item.product_code}</Text>
                    <Text style={styles.list_item}>{item.product_dimensions}</Text>
                    <Text style={styles.list_item}>{item.quantity}</Text>
                    <Text style={styles.list_item}>{item.type}</Text>
                    <Text style={styles.list_item}>${item.price_per}</Text>
                    <Text style={styles.list_item}>${Number(item.total).toFixed(2)}</Text>
                  </div>

                </View>
              )
            })}
            <View style={styles.list_row}>
              <Text style={styles.list_item_blank}></Text>
              <Text style={styles.list_item_blank_description}></Text>
              <Text style={styles.list_item_blank}></Text>
              <Text style={styles.list_item_blank}></Text>
              <Text style={[styles.list_item_blank, {width: "24%", textAlign: "right", paddingRight: "2.5%", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px"}]}>Work Total:</Text>
              <Text style={[styles.list_item_blank, { textAlign: "center", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px"}]}> ${Number(data.lineItemsTotal).toFixed(2)}</Text>
            </View>
            </View>
     
            <View style={styles.section_title}>
              <Text>Hourly Details</Text>
            </View>

            <View style={styles.list}>
              <View style={styles.list_row_header}>
                <Text style={styles.list_item_header}>Date</Text>
                <Text style={styles.list_item_header}>Hours</Text>
                <Text style={styles.list_item_header}>Men</Text>
                <Text style={styles.list_item_header}>Rate</Text>
                <Text style={styles.list_item_header}>Total</Text>
              </View>
            {data.lineItems_manHours.map((item, i) => {
               return (
                <View style={styles.list_row_details} key={i}>
                <div style={styles.list_inner_row_top}>
                  <Text style={styles.list_item_description}>DESCRIPTION: {item.description}</Text>
                </div>
                  <div style={styles.list_inner_row}>
                    <Text style={styles.list_item}>{moment(item.date.replace(' ', "T")).format("MM/DD/YYYY")}</Text>
                    <Text style={styles.list_item}>{item.hours}</Text>
                    <Text style={styles.list_item}>{item.men}</Text>
                    <Text style={styles.list_item}>${item.rate}</Text>
                    <Text style={styles.list_item}>${item.total}</Text>
                  </div>
                </View>
              )
            })}
          <View style={styles.list_row}>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank_description}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={[styles.list_item_blank, {width: "24%", textAlign: "right", paddingRight: "2.5%", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px"}]}>Hourly Total:</Text>
            <Text style={[styles.list_item_blank, { textAlign: "center", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px"}]}> ${Number(data.lineItems_manHours_total).toFixed(2)}</Text>
          </View>
          </View>
   
          <View style={styles.section_title}>
              <Text>Other Details</Text>
            </View>

            <View style={styles.list}>
              <View style={styles.list_row_header}>
                <Text style={styles.list_item_header}>Date</Text>
                <Text style={styles.list_item_header}>Quantity</Text>
                <Text style={styles.list_item_header}></Text>
                <Text style={styles.list_item_header}>Price_Per</Text>
                <Text style={styles.list_item_header}>Total</Text>
              </View>
            {data.lineItems_other.map((item, i) => {
               return (
                <View style={styles.list_row_details} key={i}>
                <div style={styles.list_inner_row_top}>
                  <Text style={styles.list_item_description}>DESCRIPTION: {item.description}</Text>
                </div>
                  <div style={styles.list_inner_row}>
                    <Text style={styles.list_item}>{moment(item.date.replace(' ', "T")).format("MM/DD/YYYY")}</Text>
                    <Text style={styles.list_item}>{item.quantity}</Text>
                    <Text style={styles.list_item}></Text>
                    <Text style={styles.list_item}>${item.price_per}</Text>
                    <Text style={styles.list_item}>${item.total}</Text>
                  </div>
                </View>
              )
            })}
          <View style={styles.list_row}>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank_description}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={[styles.list_item_blank, {width: "24%", textAlign: "right", paddingRight: "2.5%", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px"}]}>Other Total:</Text>
            <Text style={[styles.list_item_blank, { textAlign: "center", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px"}]}> ${Number(data.lineItems_other_total).toFixed(2)}</Text>
          </View>
          </View>
  
          <View style={[styles.list, {marginTop: "20px"}]}>
          <View style={styles.list_row}>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank_description}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={[styles.list_item_blank, {width: "24%", textAlign: "right", paddingRight: "2.5%", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px"}]}>Total:</Text>
            <Text style={[styles.list_item_blank, { textAlign: "center", paddingTop: "10px", marginTop: "10px", borderTopWidth: "1px" }]}> ${((Number(data.lineItems_manHours_total) + Number(data.lineItemsTotal) + Number(data.lineItems_other_total))).toFixed(2)}</Text>
          </View>
          </View>

          <View style={[styles.list, {marginTop: "20px"}]}>
          <View style={styles.list_row}>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank_description}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={[styles.list_item_blank, { width: "50%", textAlign: "right",paddingRight: "20px", paddingTop: "10px", marginTop: "10px", borderTopWidth: "2px", borderBottomWidth: "2px", borderRightWidth: "2px", borderLeftWidth: "2px"}]}>Retention: {data.retention}%</Text>
          </View>
          </View>

          <View style={[styles.list, {marginTop: "20px"}]}>
          <View style={styles.list_row}>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank_description}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={[styles.list_item_blank, {width: "50%", textAlign: "right", paddingRight: "20px", paddingTop: "10px", marginTop: "10px", borderTopWidth: "2px", borderBottomWidth: "2px", borderRightWidth: "2px", borderLeftWidth: "2px"}]}>Retention Total: ${Number( (Number(data.lineItems_manHours_total) + Number(data.lineItemsTotal) + Number(data.lineItems_other_total) ) * (Number(data.retention)/100)).toFixed(2)}</Text>
          </View>
          </View>

          <View style={[styles.list, {marginTop: "20px"}]}>
          <View style={styles.list_row}>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank_description}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={styles.list_item_blank}></Text>
            <Text style={[styles.list_item_blank, {width: "50%",  textAlign: "right",paddingRight: "20px", paddingTop: "10px", marginTop: "10px", borderTopWidth: "2px", borderBottomWidth: "2px", borderRightWidth: "2px", borderLeftWidth: "2px"}]}>Application Total: ${Number((Number(data.lineItems_manHours_total) + Number(data.lineItemsTotal) + Number(data.lineItems_other_total)) - ((Number(data.lineItems_manHours_total) + Number(data.lineItemsTotal) + Number(data.lineItems_other_total)) * (data.retention/100))).toFixed(2)}</Text>
          </View>
          </View>
      </Page>
      <Page size="A4" style={styles.page}>
          <Text style={styles.copyTitle}>Terms & Conditions</Text>
          <Text style={styles.copyText}>Having first been duly sworn, the undersigned authorized representative of the Subcontractor or on behalf of the Subcontractor, hereby warrants and certifies that Subcontractor has fully paid for all labor, equipment, services, incidentals and other bills and obligations of every kind or nature that relate to the subcontract, purchase orders, or other agreements, whether oral or written, between Subcontractor and Sanders Hyland Corp. for the referenced project.</Text>
          <Text style={styles.copyText}>Subcontractor hereby warrants that the premises of the above named project cannot be made subject to any valid lien or claim by anyone who furnishes material, supplies, labor, equipment, or services to Subcontractor for use in the above named project, and in consideration of the payment by Sanders Hyland Corp. Subcontractor hereby releases and waives any and all claims and liens whatsoever kind or nature against Sanders Hyland Corp., the Owner, the Architect and Engineers, and against the building, improvements or project and the land on which same is located with respect to work performed for obligations undertaken by Subcontractor or by any of Subcontractor’s laborers, Subcontractor’s suppliers, or equipment providers which in any way relates to the above mentioned construction improvements or project through the date of execution of this document, except those stated below (if none, so state):</Text>
          <Text style={styles.copyText}>The Subcontractor covenants to indemnify and save harmless and exonerate the Contractor, Owner, Architect and their respective directors, officers, employees and agents (the Indemnities) from and against all liability, claims and demands for bodily injury and property damage, arising out of any of the work undertaken by the Subcontractor, its directors, officers, employees, agents or its subcontractors, and arising out of any other operation no matter by whom performed for or on behalf of the Subcontractor, regardless of whether the claim, demand or suit is alleged to arise out of, in whole or in part, the negligence of any of the Indemnities.</Text>

          <View style={styles.signature_section}>
            <View style={styles.signature_row}>
              <Text style={styles.copyTitle}>Signature:</Text>
              {data.contractor_signature != '' && (
                <Image src={data.contractor_signature} style={styles.signature_image}/>
              )}
              <Text style={styles.name}>{data.contractor} - {moment(data.date.replace(' ', "T")).format("MMMM Do, YYYY")}</Text>
            </View>

            <View style={styles.signature_row}>
              <Text style={styles.copyTitle}>Witness/Approved by:</Text>
              {data.pm_signature != '' && (
                <Image src={data.pm_signature} style={styles.signature_image}/>
              )}
              <Text style={styles.name}>{data.projectManager}</Text>
            </View>
          </View>

        <Text style={styles.footer} fixed>
        This document was created on {moment(data.date.replace(' ', "T")).format("MMMM Do, YYYY")} and SHOULD NOT BE EDITED
        </Text>
      </Page>
    </Document>
  );



  const location = useLocation();
  const id = location.pathname.replace('/pdf/', '')
  // console.log('id', id);
  const toast = useRef(null);

  const handleSubmit = async () => {
    const response = await fetch(
      "https://sanders-hyland-server.herokuapp.com/pdf/"+ id
    ).then((response) => response.json());
    // console.log(response)
    response.invoice = response.invoice.toString().padStart(5, '0')
    if (!response.lineItems_other) {
      response.lineItems_other = [];
      response.lineItems_other_total = 0;
      setData(response)
    } else {
      setData(response)
    }
    
  };


  
  const editApp = async (item) => {
    console.log(item)
    history.push('/lien-form/' + item._id)
  };

  const show = async () => {
        toast.current.show({ severity: 'success', summary: 'Submission Received', detail: 'Thank you, we have received your submission.' });
    };

    const clear = async (submit, item) => {
      if (submit === false) {
        toast.current.clear();
      } else {
        toast.current.clear();
         var response = await fetch("https://sanders-hyland-server.herokuapp.com/lien/submit/"+ item._id, {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           }
        })
        .then((response) => response.json())
        // console.log(response)
        history.push('/payments-submitted/')
      }
        
       
    };

  const submitApp = async (item) => {
    var lien = item;
      var m = moment().day();
      console.log(m)
      if (m === 3) {
        var a = moment().hour();
        var b = moment().minute();
        console.log(a)
        console.log(b)
        if (a > 9) {
            toast.current.show({
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
                          <Button onClick={(e) => clear(true, lien)} type="button" label="Confirm" className="p-button-success w-6rem" />
                          <Button onClick={(e) => clear(false, lien)} type="button" label="Cancel" className="p-button-warning w-6rem" />
                      </div>
                  </div>
              )
          });
        } else {
          // toast.current.show({ severity: 'success', summary: 'Submission Received', detail: 'Its Wednesday before 10' });
          // console.log('')
          clear(true, lien)
        }
      } else {
        clear(true, lien)
      }
    
  }


  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    // console.log(data)
    if (firstUpdate.current) {
      firstUpdate.current = false;
      handleSubmit();
      return;
    }

  });



  if (data.status === 'started') {
    return (
      <>
      <div className='pdf_buttons'>
        <Button raised rounded severity="info" size="Lg" onClick={(e)=>{handleSubmit(data)}}>REFRESH</Button>
        </div>
      <Signature user={user} history={history} data={data}/>
       <PDFDownloadLink 
      className="PDFDownload"
      document={<MyDocument />}
      fileName={"invoice-" + data.invoice + ".pdf"}
    >
      {({ blob, loading, url }) => {
        return loading
          ? "Loading..."
          : "Download";
      }}
    </PDFDownloadLink>
       <PDFViewer><MyDocument /></PDFViewer>
      </>
    );
  } else if (data.status === 'unsubmitted') {
    return (
      <>
      <div className='pdf_buttons'>
       <Button raised rounded severity="info" size="Lg" onClick={(e)=>{handleSubmit(data)}}>REFRESH</Button>
       </div>
      <Signature user={user} history={history} data={data}/>
       <PDFDownloadLink 
      className="PDFDownload"
      document={<MyDocument />}
      fileName={"invoice-" + data.invoice + ".pdf"}
    >
      {({ blob, loading, url }) => {
        return loading
          ? "Loading..."
          : "Download";
      }}
    </PDFDownloadLink>
       <PDFViewer><MyDocument /></PDFViewer>
      </>
    );
  } else if (data.status === 'approved') {
    return (
      <>

      <div className='pdf_buttons status approved'>

      </div>

       <PDFDownloadLink 
      className="PDFDownload"
      document={<MyDocument />}
      fileName={"invoice-" + data.invoice + ".pdf"}
    >
      {({ blob, loading, url }) => {
        return loading
          ? "Loading..."
          : "Download";
      }}
    </PDFDownloadLink>
       <PDFViewer><MyDocument /></PDFViewer>
      </>
    );
  } else if (data.status === 'rejected') {
    return (
      <>

      <div className='pdf_buttons status rejected'>
      <Button raised rounded severity="info" size="Lg" onClick={(e)=>{handleSubmit(data)}}>REFRESH</Button>
        <Button raised rounded className="edit" severity="warning" size="Lg" onClick={(e)=>{editApp(data)}}>EDIT</Button>
        <Button raised rounded className="success" severity="success" size="Lg" onClick={(e)=>{submitApp(data)}}>RESUBMIT</Button>
      </div>

      <div className="pm_comments_holder">
        <div className="pm_comments_title">Project Managers Comments:</div>
        <div className="pm_comments">
          {data.comments}
        </div>
      </div>

       <PDFDownloadLink 
      className="PDFDownload"
      document={<MyDocument />}
      fileName={"invoice-" + data.invoice + ".pdf"}
    >
      {({ blob, loading, url }) => {
        return loading
          ? "Loading..."
          : "Download";
      }}
    </PDFDownloadLink>
       <PDFViewer><MyDocument /></PDFViewer>
      </>
    );
  } else if (data.status === "signed") {
    return (
      <>

      <div className='pdf_buttons status rejected'>
        <Button raised rounded severity="info" size="Lg" onClick={(e)=>{handleSubmit(data)}}>REFRESH</Button>
        <Button raised rounded className="edit" severity="warning" size="Lg" onClick={(e)=>{editApp(data)}}>EDIT</Button>
        <Button raised rounded className="success" severity="success" size="Lg" onClick={(e)=>{submitApp(data)}}>SUBMIT</Button>
      </div>

       <PDFDownloadLink 
      className="PDFDownload"
      document={<MyDocument />}
      fileName={"invoice-" + data.invoice + ".pdf"}
    >
      {({ blob, loading, url }) => {
        return loading
          ? "Loading..."
          : "Download";
      }}
    </PDFDownloadLink>
       <PDFViewer><MyDocument /></PDFViewer>

          <Toast ref={toast} position="center" />
      </>
    );
  } else {
    return (
      <>
      <div className='pdf_buttons status approved'>

      </div>

       <PDFDownloadLink 
      className="PDFDownload"
      document={<MyDocument />}
      fileName={"invoice-" + data.invoice + ".pdf"}
    >
      {({ blob, loading, url }) => {
        return loading
          ? "Loading..."
          : "Download";
      }}
    </PDFDownloadLink>
       <PDFViewer><MyDocument /></PDFViewer>

      
      </>
      )
  }

};

export default withAuthenticationRequired(PdfComponent, {
  onRedirecting: () => <Loading />,
});
