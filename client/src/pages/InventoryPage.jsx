import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useQuery } from "react-query";
import InventoryContent from "../components/Inventory/Inventory.jsx";
import OrdersPreview from "../components/Orders/OrdersPreview";
import { authenticateUser } from "../api/authenticationAPI.js";
import SalesGraph from "../components/SalesChart.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";

import "./invOrdContainer.css";
import { InventoryProvider } from "../contexts/inventory.context.jsx";

function InventoryPage() {
  const [username, setUsername] = useState(null);
  const inventoryListScrollRef = useRef(null);
  const ordersListScrollRef = useRef(null);
  // this state is shared between the invenotry and ordersPreview and set by the ordersPreview component - it is used for sync scrolling
  const [rowHeightState, setRowHeightState] = useState(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [tabRotated, setTabRotated] = useState(false);

  useLayoutEffect(() => {
    const updateContainerHeight = () => {
      const salesGraphContainer = document.querySelector(
        ".sales-graph-container",
      );
      const inventoryOrdersContainer = document.querySelector(
        ".inventory-orders-container",
      );

      if (chartVisible) {
        salesGraphContainer.style.height = "260px";
        inventoryOrdersContainer.style.marginTop = "";
      } else {
        salesGraphContainer.style.height = "0";
        inventoryOrdersContainer.style.marginTop = "0";
      }
    };

    updateContainerHeight();
  }, [chartVisible]);

  return (
    <>
      <div className={`sales-graph-container ${chartVisible ? "visible" : ""}`}>
        {chartVisible && <SalesGraph />}
        <div
          className={`tab ${tabRotated ? "rotated" : ""}`}
          onClick={() => {
            setChartVisible(!chartVisible);
            setTabRotated(!tabRotated);
          }}
        >
          <FontAwesomeIcon icon={faChartColumn} className="bar-icon" />
        </div>
      </div>
      <div className="inventory-orders-container">
        <div className="inventory-section">
          <InventoryContent
            inventoryListScrollRef={inventoryListScrollRef}
            ordersListScrollRef={ordersListScrollRef}
            rowHeightState={rowHeightState}
          />
        </div>
        <div className="orders-section">
          <OrdersPreview
            inventoryListScrollRef={inventoryListScrollRef}
            ordersListScrollRef={ordersListScrollRef}
            rowHeightState={rowHeightState}
            setRowHeightState={setRowHeightState}
          />
        </div>
      </div>
    </>
  );
}

export default InventoryPage;
