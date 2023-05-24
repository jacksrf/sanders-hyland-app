import React, {
  useState,
  useEffect,
  useRef
} from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useAuth0 } from "@auth0/auth0-react";

const NavBar = () => {
  const profile_menu = useRef(null);
  var items;

  var profile_items;

  var profile;

    const start = <img alt="logo" src="/static/media/sanders-hyland-logo-lg.73e6d73e07d28542ec37.png" height="40" className="mr-2"></img>;
    // const end = <InputText placeholder="Search" type="text" className="w-full" />;

  const [isOpen, setIsOpen] = useState(false);
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
  console.log(isAuthenticated)
  console.log(user)

  const handleDataUpdate = async (email) => {
    console.log(email)
      var response = await fetch("https://sanders-hyland-server.herokuapp.com/user/"+ email, {
        // mode:'no-cors',
       method: "GET",
       headers: {
         "Content-Type": "application/json",
       }
    })
    .then((response) => response.json())
      console.log(response)
      return response
  }

   const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  const toggle = () => setIsOpen(!isOpen);

  if (isAuthenticated) {
      items = [
        {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-chart-bar',
            url: '/',
        },
        {
            label: 'Payments',
            icon: 'pi pi-fw pi-dollar',
            url: '/payments-submitted'
        },
        {
            label: 'Application',
            icon: 'pi pi-fw pi-envelope',
            url: '/lien-form'
        }
    ];
   
    

    profile_items = [
        {
            // label: 'Options',
            items: [
                // {
                //     label: 'Notifications',
                //     icon: 'pi pi-bell',
                //     url: '/notifications'
                // },
                {
                    label: 'Signout',
                    icon: 'pi pi-times',
                    command: () => {
                        logoutWithRedirect({})
                    }
                }
            ]
        }
        ];

    profile = <div>
                      <Menu model={profile_items} popup ref={profile_menu} />
                      <button onClick={(e) => profile_menu.current.toggle(e)} className={'w-full p-link flex align-items-center'}>
                          <Avatar image={user.picture} className="mr-2" shape="circle" />
                          <div className="flex flex-column align">
                              <span className="font-bold">{userFull.name}</span>
                              <span className="text-sm"></span>
                          </div>
                      </button>
                    </div>;
  } 

  if (!isAuthenticated) {
    items = [

    ];

    profile_items = []

    profile = <div>
        <Button    
        icon="pi pi-user" 
        label="Log in"
        raised              
                   severity="warning" rounded
                   onClick={() => loginWithRedirect({})}
                  > 
               
                  </Button>
    </div>
  }

 

    useEffect(() => {
    let isMounted = true;
    console.log(userFull._id)
    if (isAuthenticated) {
       handleDataUpdate(user.email).then((data) => {
      if (isMounted) {
        console.log(data)
        setUser(data)

      }
    });
    }

    return () => {
      // isMounted = false;
    };
    // }
  }, []);

  return (
    <div className="nav-container">

      <div className="card">
            <Menubar model={items} start={start} end={profile} />
        </div>
    </div>
  );
};

export default NavBar;
