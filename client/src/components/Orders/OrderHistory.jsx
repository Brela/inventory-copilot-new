import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './orders.css';
import { OrdersContext } from '../../contexts/orders.context';
import { clearAllOrderHistory } from '../../services/ordersAPIcalls';
import { authenticateUser } from '../../services/authenticationAPIcalls';
import { useQuery } from 'react-query';
import Swal from 'sweetalert2';

function OrderHistory() {
  const navigate = useNavigate();
  /*  const { data, isLoading, isError } = useQuery(
    'authenticateUser',
    authenticateUser,
    {
      onSuccess: (data) => {
        if (data === 'JsonWebTokenError' || data === 'TokenExpiredError') {
          navigate('/login');
        }
      },
    }
  );
  if (isError) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `Unable to communicate with the server. Please refresh the webpage.`,
      background: '#333',
      color: '#fff',
      confirmButtonColor: '#3b9893',
    });
  } */
  const { orders, reloadOrders } = useContext(OrdersContext);
  const orderHistory = orders.filter(
    (item) => item.orderStatus === "delivered"
  );

  const handleClearHistory = async () => {
    await clearAllOrderHistory();
    reloadOrders();
  };
  /*     useEffect(() => {
            console.log(orderHistory)
        }, [orderHistory]);
     */

  return (
    <div className="order-history-container">
      <table>
        <thead>
          <tr className="orders-page-title-for-each-table">
            <td>
              <h1>Order History</h1>
            </td>
            <td>
              <button
                className="small-blue-button"
                onClick={handleClearHistory}
              >
                Clear History
              </button>
            </td>
          </tr>
        </thead>
        <tbody className="order-history-body">
          <tr className="order-table-header">
            <td>ID</td>
            <td>SKU</td>
            <td>Name</td>
            <td>Date</td>
            <td>Arrived</td>
            <td>QTY</td>
            <td>Total</td>
          </tr>
          {Array.isArray(orders) &&
            orderHistory.map((item, index) => (
              // use key here to get specific item to get (for popup) update or delete.
              // item.sku value - this will scroll to selected value from searchInput.jsx
              <tr key={item.id}>
                {/* this key will remove console log error for not having unique key */}
                <td>
                  <span className="mobile-span">ID</span>
                  {item.id}
                </td>
                <td className="hide-on-small">{item.SKU}</td>
                <td>
                  <span className="mobile-span">Name</span>
                  {item.product.productName}
                </td>
                <td>
                  <span className="mobile-span">Date</span>
                  {item.orderedDate}
                </td>
                <td className="hide-on-small">{item.delivered || "n/a"}</td>
                <td>
                  <span className="mobile-span">QTY</span>
                  {item.orderQty}
                </td>
                <td>
                  <span className="mobile-span">Total</span>
                  {`$${item.totalCost}`}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
