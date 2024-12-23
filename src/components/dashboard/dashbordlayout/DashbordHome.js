import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Storefront, LocalShipping, ShoppingCart, Agriculture } from '@mui/icons-material';
import StockTable from './StockTable';
import { useSelector } from 'react-redux';

const DashboardHome = () => {
  const userEmail = useSelector((state) => state.user.userEmail)

  console.log(userEmail)

  return (
    <>
    <div className=''>
    <div className="flex flex-wrap justify-center gap-6 md:flex-row md:justify-start">
      {/* Farmer Card */}
      {/* <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #48C78E, #34D399, #10B981)', 
            color: 'white',
          }}
        >
          <Agriculture sx={{ fontSize: 60 }} className="mb-4 animate-pulse" /> 
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Farmer
          </Typography>
        </CardContent>
      </Card> */}

      {/* Sales Card */}
      <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #60A5FA, #3B82F6, #1D4ED8)', 
            color: 'white',
          }}
        >
          <Storefront sx={{ fontSize: 60 }} className="mb-4 animate-pulse" />
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Sales
          </Typography>
        </CardContent>
      </Card>

      {/* Order Card */}
      <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #FDBA74, #FB923C, #F97316)', // Orange gradient
            color: 'white',
          }}
        >
          <ShoppingCart sx={{ fontSize: 60 }} className="mb-4 animate-pulse" /> {/* Increased size with sx */}
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Orders
          </Typography>
        </CardContent>
      </Card>

      {/* Purchase Card */}
      {/* <Card className="w-64 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <CardContent
          className="flex flex-col items-center"
          style={{
            background: 'linear-gradient(to right, #F87171, #EF4444, #DC2626)', 
            color: 'white',
          }}
        >
          <LocalShipping sx={{ fontSize: 60 }} className="mb-4 animate-pulse" /> 
          <Typography variant="h6" component="div" className="font-semibold text-center text-xl">
            Purchase
          </Typography>
        </CardContent>
      </Card> */}
    </div>
    {/* <div>
        <StockTable/>
    </div> */}
    </div>
    </>
  );
}

export default DashboardHome;
