import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
import { findDOMNode } from "react-dom";
import { useNavigate } from "react-router-dom";
import "./orders.css";
import { InventoryContext } from "../../contexts/inventory.context";
import { OrdersContext } from "../../contexts/orders.context";
import { PinningContext } from "../../contexts/pinning.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { updateOrderItem } from "../../api/ordersAPI";
import {
  handleOrderDelivery,
  orderEnRouteTimer,
  pauseAllTimeouts,
} from "../../utils/orderHelpers";
import { authenticateUser } from "../../api/authenticationAPI";
import { useQuery } from "react-query";
import EditPopup from "./EditPopup";

import Swal from "sweetalert2";

function OrdersPreview({
  inventoryListScrollRef,
  ordersListScrollRef,
  setRowHeightState,
}) {
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

  const { setTempInStock, selectedItems, inventory } =
    useContext(InventoryContext);
  const {
    orders,
    activeOrders,
    reloadOrders,
    deliveriesOn,
    setDisplayOrderedDeliveredPopup,
    setOrderedDeliveryPopupContent,
  } = useContext(OrdersContext);
  const { pinnedItems } = useContext(PinningContext);
  const [ordersHighlightColors, setOrdersHighlightColors] = useState({});
  const [sortedOrders, setSortedOrders] = useState([]);

  // ----------- Sort orders based on the order of inventory items ---------
  const sortOrdersByInventory = (activeOrders, inventory) => {
    return activeOrders.slice().sort((a, b) => {
      const aIndex = inventory.findIndex((item) => item.id === a.product.id);
      const bIndex = inventory.findIndex((item) => item.id === b.product.id);
      return aIndex - bIndex;
    });
  };

  // Sort orders when the inventory changes
  useEffect(() => {
    // console.log('pinnedItems:  ', pinnedItems)
    setSortedOrders(sortOrdersByInventory(activeOrders, inventory));
    // reset orders list order when product is pinned -----------
  }, [inventory, activeOrders, pinnedItems]);

  // --------------- highlight orders based on selectedItems -----------------
  const findProductIndexInSelectedItems = (productId) => {
    return selectedItems.findIndex(
      (selectedItemId) => selectedItemId === productId,
    );
  };

  const updateHighlightedOrders = () => {
    const newOrderHighlightColors = {};

    orders.forEach((order) => {
      const productIndex = findProductIndexInSelectedItems(order.product.id);
      if (productIndex !== -1) {
        newOrderHighlightColors[order.id] =
          productIndex % 2 === 0
            ? "highlight-selected-even"
            : "highlight-selected-odd";
      } else {
        newOrderHighlightColors[order.id] = "";
      }
    });

    setOrdersHighlightColors(newOrderHighlightColors);
  };

  useEffect(() => {
    updateHighlightedOrders();
    // console.log(activeOrders.length)
  }, [selectedItems, orders]);

  /*   useEffect(() => {
      console.log(activeOrders);
    }, [activeOrders]); */

  // ------------------- synchronous scrolling (inventory and orders tables) --------------------
  // this sets the rowHeight based on the tr here in OrdersPreview because it is less cluttered than the inventory tr
  useLayoutEffect(() => {
    if (activeOrders) {
      const trElement = findDOMNode(
        document.querySelector('[data-row-height-ref="true"]'),
      );
      if (trElement) {
        setRowHeightState(trElement.offsetHeight);
      }
    }
  }, [activeOrders]);

  //-------------------------------- deliver orders -----------------------------------------------------

  // useRef used to maintain mutable data that doesn't cause any rerenders
  const timeouts = useRef({});

  useEffect(() => {
    if (deliveriesOn) {
      activeOrders.forEach((order) => {
        // if timeout was not paused (it has no value in the "timeouts" useRef), then call the orderEnRouteTimer function with a fresh start
        if (!timeouts.current[order.id]) {
          orderEnRouteTimer(
            order,
            timeouts,
            null,
            setTempInStock,
            setDisplayOrderedDeliveredPopup,
            setOrderedDeliveryPopupContent,
          );
        }
        // if the timeout was paused (then it has a value in "timeouts" useRef), call the orderEnRouteTimer function with the remaining time argument
        else {
          const { startTime, deliveryDuration } = timeouts.current[order.id];

          const elapsedTime = Date.now() - startTime;
          const remainingTimeCalc = deliveryDuration - elapsedTime;
          const remainingTime =
            remainingTimeCalc < 0 ? null : remainingTimeCalc;

          clearTimeout(timeouts.current[order.id].timeoutFunction); // Clear previous timeout
          timeouts.current[order.id].startTime = Date.now(); // Update startTime before resuming the timer
          orderEnRouteTimer(
            order,
            timeouts,
            remainingTime,
            setTempInStock,
            setDisplayOrderedDeliveredPopup,
            setOrderedDeliveryPopupContent,
          ); // Start a new timeout with the remaining time
        }
      });
      reloadOrders();
    } else {
      pauseAllTimeouts(timeouts);
    }
  }, [activeOrders, deliveriesOn]);

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
      <div className="order-container" id="orders">
        <table>
          <thead>
            <tr className="title-tr">
              <td>
                <h1>Active Orders</h1>
              </td>
              <td>
                <Link to="/orders" className="small-blue-button">
                  More
                </Link>
              </td>
            </tr>
          </thead>

          <tbody ref={ordersListScrollRef} className="order-items-container">
            <tr className="order-preview-header">
              <td>SKU</td>
              <td>QTY</td>
              <td>Arrival</td>
              <td>Total</td>
              <td>Edit</td>
            </tr>
            {Array.isArray(orders) &&
              sortedOrders.map((order, index) => (
                // use key here to get specific order to get (for popup) update or delete.
                // order.sku value - this will scroll to selected value from searchInput.jsx

                // the itemHeightRef is applied to the first tr to get its height and is used for synchronous scrolling
                <tr
                  key={order.id}
                  data-row-height-ref={index === 0 ? "true" : undefined}
                  className={ordersHighlightColors[order.id]}
                >
                  {/* the key above takes away the console log error. 
                            a unique key prop is necessary to map over an array to create multiple elements, 
                            each element should have a unique key to help React optimize rendering 
                            */}

                  <td>{order.SKU}</td>

                  <td>{order.orderQty}</td>

                  <td>{order.schedArrivalDate || "n/a"}</td>

                  <td>{`$${order.totalCost}`}</td>
                  <td>
                    <button
                      id="settings"
                      onClick={() => handleOpenPopup(order)}
                    >
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

export default OrdersPreview;
