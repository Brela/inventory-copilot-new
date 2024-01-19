import React, { useContext } from 'react';
// import OrdersContent from '../components/Orders/OrdersContent.jsx';
import ActiveOrders from '../components/Orders/ActiveOrders'
import OrderHistory from '../components/Orders/OrderHistory'


function OrdersPage() {
  return (
      <div className='orderpage-container'>
        <ActiveOrders />
        <OrderHistory />
      </div>
  );
}

export default OrdersPage;