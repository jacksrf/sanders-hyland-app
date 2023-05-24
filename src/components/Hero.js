import React, {
  useState,
  useEffect
} from "react";

import logo from "../assets/sanders-hyland-logo-lg.png";
import { Card } from 'primereact/card';
import { useAuth0 } from "@auth0/auth0-react";
import { Chart } from 'primereact/chart';

import 'primeicons/primeicons.css';  
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import { Skeleton } from 'primereact/skeleton';

const Hero = () => {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const [userFull, setUser] = useState({
    "_id": "",
    "name": ""
  });

//     if (isAuthenticated) {
//     return (
//       <div className="dashboard">
//         <div className="card_stats_view">
//           <Card title="Payments this Month">
//             <Skeleton width="100%" height="6rem" borderRadius="16px"></Skeleton>
//           </Card>
// 
//           <Card title="Retention This Month">
//             <Skeleton width="100%" height="6rem" borderRadius="16px"></Skeleton>
//           </Card>
// 
//           <Card title="Payments - Year to Date">
//             <Skeleton width="100%" height="6rem" borderRadius="16px"></Skeleton>
//           </Card>
//         </div>
//         
//         
//         <Card title="Payments this Month">
//             <div className="card chart">
//                 <Skeleton height=".5rem"></Skeleton>
//             </div>
//         </Card>
//       </div>
//     )
//   } else {
    return (
    <div className="dashboard">
        <div className="text-center hero my-5">
          <img className="mb-3 app-logo" src={logo} alt="React logo" />
          <h1 className="mb-4">Contractors Dashboard</h1>

          <p className="lead">

          </p>
        </div>
    </div>
    )
  // }
}

export default Hero;
