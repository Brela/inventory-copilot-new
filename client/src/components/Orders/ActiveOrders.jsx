import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './orders.css';
import { OrdersContext } from '../../contexts/orders.context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { authenticateUser } from '../../services/authenticationAPIcalls';
import { useQuery } from 'react-query';
import EditPopup from './EditPopup';
import Swal from 'sweetalert2';

function ActiveOrders() {
  const navigate = useNavigate();
  /*   const { data, isLoading, isError } = useQuery(
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
  const { orders, activeOrders, reloadOrders, deliveriesOn } =
    useContext(OrdersContext);

  /* useEffect(() => {
        console.log(activeOrders)
    }, [activeOrders]);

    useEffect(() => {
        console.log(deliveriesOn)
    }, [deliveriesOn]);

    const simulateDelivery = async (order) => {
        const deliveryTime = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;

        setTimeout(async () => {
            // Update the tempStockamount for this product
            console.log(order.shcedArrivalDate)
            console.log('sim prod delivered')

            // Send an update request to the backend to change the order status
            // await updateOrderStatusInBackend(order.id, "delivered");

            // Update the "in stock" amount for the inventory item in the React context
            // updateInventoryStock(order.inventoryItemId, order.quantity);

            // Send an update request to the backend to update the inventory
            // await updateInventoryStockInBackend(order.inventoryItemId, order.quantity);
        }, deliveryTime);
    };

    useEffect(() => {
        if (deliveriesOn) {
            activeOrders.forEach(order => {
                simulateDelivery(order);
            });
        }
    }, [activeOrders, deliveriesOn]);
 */

  // ---------- handle popup --------------------------

  const [orderForPopup, setOrderForPopup] = useState(null);

  const handleOpenPopup = (order) => {
    setOrderForPopup(order);
  };

  const handleClosePopup = () => {
    setOrderForPopup(null);
  };

  return (
    <>
      <div className="active-order-container" id="orders">
        <table id="orders" className="media">
          <thead>
            <tr className="orders-page-title-for-each-table">
              <td>
                <h1>Active Orders</h1>
              </td>
            </tr>
          </thead>
          <tbody className="active-orders-body">
            <tr className="order-table-header">
              <td>ID</td>
              <td>SKU</td>
              <td>Name</td>
              <td>Date</td>
              <td>Arrival</td>
              <td>QTY</td>
              <td>Shipper</td>
              <td>Total</td>
              <td>Edit</td>
            </tr>
            {Array.isArray(orders) &&
              activeOrders.map((item, index) => (
                // use key here to get specific item to get (for popup) update or delete.
                // item.sku value - this will scroll to selected value from searchInput.jsx
                <tr key={item.id}>
                  {/* this key will remove console log error for not having unique key id */}
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
                  <td>
                    <span className="mobile-span">Arrival</span>
                    {item.schedArrivalDate || "n/a"}
                  </td>
                  <td>
                    <span className="mobile-span">QTY</span>
                    {item.orderQty}
                  </td>
                  <td className="hide-on-small">{item.product.shipper}</td>
                  <td>
                    <span className="mobile-span">Total</span>
                    {`$${item.totalCost}`}
                  </td>
                  <td className="hide-on-small">
                    <button id="settings" onClick={() => handleOpenPopup(item)}>
                      <FontAwesomeIcon
                        icon={faPen}
                        className="edit-icon"
                        style={{ pointerEvents: "none" }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {orderForPopup && (
          <EditPopup
            handleClosePopup={handleClosePopup}
            order={orderForPopup}
          />
        )}
      </div>
    </>
  );
}

export default ActiveOrders;
