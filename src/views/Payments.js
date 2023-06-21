import React, {useRef} from "react";
import { Container, Row, Col } from "reactstrap";
import { useEffect, useState } from "react";
import Highlight from "../components/Highlight";
import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import {Form} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
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

import 'primeicons/primeicons.css';  
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";

export const PaymentsComponent = () => {
  console.log(useAuth0())
  const { user } = useAuth0();
  console.log(user)
  const [userFull, setUser] = useState({
    "_id": "",
    "name": ""
  });

  const menu1 = useRef(null);
  const menu2 = useRef(null);
  const menu3 = useRef(null);
  const menu4 = useRef(null);
    //const router = useRouter();
  const toast = useRef(null);

  const history = useHistory();
  const [payments, setPayments] = useState([]);
  const [ascending, setAscending] = useState(false)
  const [currentSort, setCurrentSort] = useState("")

  const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        projectManger: { value: null, matchMode: FilterMatchMode.EQUALS },
        value: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        jobNumber: { value: null, matchMode: FilterMatchMode.EQUALS },
        invoice: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        console.log()

        _filters['global'].value = value;
        console.log(_filters)
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

  const goToPDF = async (item) => {
    console.log(item)
    history.push('/pdf/'+item._id)
  }

  const deleteApp = async (item) => {
    var response = await fetch("https://sanders-hyland-server.herokuapp.com/lien/delete/" + item._id, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((response) => response.json())
    console.log(response)
    handleSubmit()
  }

      const formatCurrency = (value) => {
        console.log(value)
        if (value != null) {
          return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        } else {
          return "$0.00";
        }
        
    }

    const balanceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.value);
    }

  const getSeverity = (lien) => {
        console.log(lien.status)
        switch (lien.status) {

            case 'started':
                return 'primary';

            case 'unsubmitted':
                return 'primary';

            case 'signed':
                return 'primary';

            case 'in review':
                return 'info';

            case 'rejected':
                return 'danger';

            case 'approved':
                return 'warning';

            case 'completed':
                return 'success';
                
            default:
                return null;
        }
    };

  const statusBodyTemplate = (lien) => {
    return <Tag value={lien.status} severity={getSeverity(lien)}></Tag>;
  };

  var modalOpenTemplate = (lien) => {
    console.log(lien.status)
        if (lien.status === "started") {
           return (
              <div className="button_flex">
              <Button icon="pi pi-file-edit" raised aria-label="Options" onClick={(e) => goToPDF(lien)} />
              <Button icon="pi pi-trash" raised severity="danger" aria-label="Options" onClick={(e) => deleteApp(lien)} />
             </div>
           );
       } else if (lien.status === "unsubmitted") {
          return (
              <div className="button_flex">
              <Button icon="pi pi-send"  raised aria-label="Options" onClick={(e) => goToPDF(lien)} />
              <Button icon="pi pi-trash" raised severity="danger" aria-label="Options" onClick={(e) => deleteApp(lien)} />
             </div>
           );
        } else if (lien.status === "approved") {
          return (
              <div className="button_flex">
              <Button icon="pi pi-eye" outlined raised severity="info" aria-label="Options" onClick={(e) => goToPDF(lien)} />
             </div>
           );
       } else if (lien.status === "rejected") {

          return (
              <div className="button_flex">
              <Button icon="pi pi-file-edit" raised severity="warning" aria-label="Options" onClick={(e) => goToPDF(lien)} />
             </div>
           );
       } else if ( lien.status === "signed") {
          return (
              <div className="button_flex">
              <Button icon="pi pi-send"  raised aria-label="Options" onClick={(e) => goToPDF(lien)} />
             </div>
           );
       } else if ( lien.status === "completed") {
         return (
              <div className="button_flex">
              <Button icon="pi pi-eye" outlined raised severity="info" aria-label="Options" onClick={(e) => goToPDF(lien)} />
             </div>
           );
        } else if ( lien.status === "in review") {
            return (
              <div className="button_flex">
              <Button icon="pi pi-eye" outlined raised severity="info" aria-label="Options" onClick={(e) => goToPDF(lien)} />
             </div>
           );
         } 
  };
  

  

  // const header = (
  //       <div className="flex flex-wrap align-items-center justify-content-between gap-2">
  //           <h2 className="text-xl text-900 font-bold">Latest Payments Submitted:</h2>
  //           {/* <Button icon="pi pi-refresh" rounded raised /> */}
  //       </div>
  //   );

  const renderHeader = () => {
        return (
            <div className="flex justify-space-between">
                <h2 className="text-xl text-900 font-bold">Latest Payments Submitted:</h2>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        );
    };
  const header = renderHeader();
  const footer = `In total there are ${payments ? payments.length : 0} payments.`;

  // const sortPayments = async (column) => {
  //   if (ascending === false) {
  //     setAscending(true)
  //   } else {
  //     setAscending(false)
  //   }
  //   setCurrentSort(column)
  //   console.log(column)
  //    const response = await fetch(
  //     "https://sanders-hyland-server.herokuapp.com/liens-sort/" + userFull._id + "/" + column + "/" + ascending
  //   ).then((response) => response.json());
  //   console.log(response)
  //   setPayments(response)
  // }

  const handleSubmit = async () => {
    var contractor = await fetch("https://sanders-hyland-server.herokuapp.com/user/"+ user.email, {
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((contractor) => contractor.json())
    setUser(contractor)
    const response = await fetch(
      "https://sanders-hyland-server.herokuapp.com/liens-clean/" + contractor._id
    ).then((response) => response.json());
    console.log(response)
    setPayments(response.reverse())
  };

  

  useEffect(() => {
    handleSubmit();
  }, []);

  return (

    <Container className="mb-5">
      <DataTable header={header}  footer={footer} value={payments} filters={filters} filterDisplay="row" sortMode="multiple" showGridlines stripedRows paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }} globalFilterFields={['invoice', 'value', 'projectManger', 'status']} emptyMessage="No Payments found.">
        <Column field="date" sortable header="Date"></Column>
        <Column field="value" sortable header="Value" dataType="numeric" body={balanceBodyTemplate}></Column>
        <Column field="jobNumber" sortable header="Job Number"></Column>
        <Column field="invoice" sortable header="Invoice"></Column>
        <Column field="projectManager" sortable header="Project Manager"></Column>
        <Column field="status" body={statusBodyTemplate} sortable header="Status"></Column>
        <Column body={modalOpenTemplate}></Column>
      </DataTable>
    </Container>
  );
};

export default withAuthenticationRequired(PaymentsComponent, {
  onRedirecting: () => <Loading />,
});
