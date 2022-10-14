import React, { useState, useEffect } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import LienForm from "../components/LienForm";
import { useHistory, useLocation} from 'react-router-dom';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import SignatureCanvas from 'react-signature-canvas';

import logo_small from "../assets/sanders-hyland-logo-lg.png";
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  pdf_logo: {
    width: 100
  },
  logo_row: {
    alignItems: 'center',
    width: '100%'
  }
});





export const PdfComponent = () => {

  const [data, setData] = useState({});

  // Create Document Component
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.logo_row}>
            <Image src={logo_small} style={styles.pdf_logo}></Image>
          </View>
          <Text>{data.date}</Text>
          <Text>Contractor: {data.contractor}</Text>
          <Text>Job Number: {data.jobNumber}</Text>
          <Text>Project Manager: {data.projectManager}</Text>
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
    // update the state
    // setUsers(response);
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <>
    <PDFViewer>
      <MyDocument />
    </PDFViewer>
    </>
  );
};

export default withAuthenticationRequired(PdfComponent, {
  onRedirecting: () => <Loading />,
});
