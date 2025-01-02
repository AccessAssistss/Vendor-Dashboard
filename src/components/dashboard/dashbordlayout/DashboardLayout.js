import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DashbordHome from './DashbordHome'; // You should already have this component
import { Button } from '@mui/material';
import Navbar from '../../Navbar';
import MemberHome from '../members/MemberHome';
import GroupsIcon from '@mui/icons-material/Groups';
import MemberProfile from '../members/MemberProfile';
import PurchaseHome from '../purchase/PurchaseHome';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SinglePurchase from '../purchase/SinglePurchase';
import AddPrice from '../addprice/AddPrice';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Price from '../addprice/Price';
import ViewQuotation from '../purchase/ViewQuotation';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [purchaseMenuOpen, setPurchaseMenuOpen] = useState(false);

  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (v) => {
    setSelectedTab(v);
    setSidebarOpen(false);
  };

  // useEffect(() => {
  //   const response = true
  //   if(jwtToken === null){
  //     navigate('/login')
  //   }else if(response === true){
  //     navigate('/dashboard/dashboardhome')
  //   }else{

  //     navigate('/login')
  //   }
  // },[])

  const TABS = [
    {
      label: "Dashboard",
      path: '',
      icon: <DashboardIcon />,
      component: <DashbordHome />
    },
    // {
    //   label: "Member",
    //   path: 'member',
    //   icon: <GroupsIcon />,
    //   component: <MemberHome />
    // },
    {
      label: "Purchase",
      path: 'purchase',
      icon: <StorefrontIcon />,
      component: <PurchaseHome />,
    },
    {
      label: "Price",
      path: 'price',
      icon: <CurrencyRupeeIcon />,
      component: <Price />,
    },
  ];

  return (
    <div className="flex " style={{ height: "100%" }}>
      <Navbar />
      {/* Sidebar */}
      <div
        className={`bg-gray-200 text-white p-6 w-64 min-h-full fixed top-16 left-0 transform transition-transform md:relative md:block z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <ul className="space-y-6">
          {
            TABS.map((item, index) => (
              item.label === 'Purchase' ? (
                <div key={index}>
                  <Button
                    onClick={() => {
                      setPurchaseMenuOpen(!purchaseMenuOpen); // Toggle sub-menu visibility
                      // handleTabChange(item?.label);
                      // navigate(`/${item?.path}`);
                    }}
                    startIcon={item.icon}
                    variant="text"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textTransform: 'none',
                      color: selectedTab === item?.label ? 'green' : 'black',
                      backgroundColor: selectedTab === item?.label ? 'rgba(0, 128, 0, 0.1)' : 'transparent',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: 18,
                      marginTop: 2,
                      fontWeight: '500',
                      boxShadow: selectedTab === item?.label ? '0 4px 12px rgba(0, 128, 0, 0.3)' : 'none',
                      transition: 'all 0.3s ease',
                      width: '200px',
                      '&:hover': {
                        backgroundColor: selectedTab === item?.label ? 'rgba(0, 128, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                        color: selectedTab === item?.label ? 'green' : '#555',
                        boxShadow: '0 6px 14px rgba(0, 0, 0, 0.15)',
                      },
                      '&:active': {
                        transform: 'scale(0.98)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    {item?.label}
                  </Button>

                  {/* Sub-menu under "Purchase" */}
                  {purchaseMenuOpen && (
                    <ul className="space-y-4">
                      <li>
                        <Button
                          onClick={() => {
                            handleTabChange()
                            handleButtonClick('subItem1');
                            navigate('/purchase');
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textTransform: 'none',
                            marginTop: 2,
                            padding: '8px 16px',
                            fontSize: 16,
                            fontWeight: '500',
                            color: activeButton === 'subItem1' ? '#00B251' : 'black', // Change text color when active
                            '&:hover': {
                              color: activeButton === 'subItem1' ? '#00B251' : 'black', // Hover text color
                            },
                            width: '200px', // Increase the width to 200px (can adjust to your preference)
                          }}
                        >
                          Rceived Purchase
                        </Button>
                      </li>

                      {/* <li>
                        <Button
                          onClick={() => {
                            handleTabChange()
                            handleButtonClick('subItem2');
                            navigate('/purchase/quotation');
                          }}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textTransform: 'none',
                            color: activeButton === 'subItem2' ? '#00B251' : 'black', // Change text color when active
                            padding: '8px 16px',
                            fontSize: 16,
                            fontWeight: '500',
                            '&:hover': {
                              color: activeButton === 'subItem2' ? '#00B251' : 'black', // Hover text color
                            },
                            width: '200px',
                          }}
                        >
                          View Quotation
                        </Button>
                      </li> */}
                      {/* Add more sub-menu items as needed */}
                    </ul>
                  )}
                </div>
              ) : (
                <Button
                  key={index}
                  onClick={() => {
                    setPurchaseMenuOpen(false);
                    handleTabChange(item?.label);
                    navigate(`/${item?.path}`);
                  }}
                  startIcon={item.icon}
                  variant="text"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textTransform: 'none',
                    color: selectedTab === item?.label ? 'green' : 'black',
                    backgroundColor: selectedTab === item?.label ? 'rgba(0, 128, 0, 0.1)' : 'transparent',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: 18,
                    marginTop: 2,
                    fontWeight: '500',
                    boxShadow: selectedTab === item?.label ? '0 4px 12px rgba(0, 128, 0, 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    width: '200px',
                    '&:hover': {
                      backgroundColor: selectedTab === item?.label ? 'rgba(0, 128, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                      color: selectedTab === item?.label ? 'green' : '#555',
                      boxShadow: '0 6px 14px rgba(0, 0, 0, 0.15)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  {item?.label}
                </Button>
              )
            ))
          }
        </ul>
      </div>

      <div className="flex-1 p-6 ml-0 md:ml-4 min-h-screen">
        <div className="flex justify-end items-center mt-16 mb-6">
          <button
            className="md:hidden text-black"
            onClick={toggleSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <Routes>
          <Route path="/" element={<DashbordHome />} />
          {/* <Route path="/member" element={<MemberHome />} />
          <Route path="/memberdetail/:id" element={<MemberProfile />} /> */}
          <Route path="/purchase" element={<PurchaseHome />} />
          <Route path="/purchase/quotation" element={<ViewQuotation />} />
          <Route path="/purchase/:request_code" element={<SinglePurchase />} />
          <Route path="/price" element={<Price />} />

        </Routes>
      </div>
    </div>
  );
};

export default DashboardLayout;
