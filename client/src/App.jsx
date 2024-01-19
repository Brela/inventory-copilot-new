import React, { useState, useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { PinningProvider } from "./contexts/pinning.context";
import {
  InventoryProvider,
  InventoryContext,
} from "./contexts/inventory.context";
import { AuthProvider } from "./contexts/AuthContext";
import {
  faBox,
  faGear,
  faBagShopping,
  faMagnifyingGlass,
  faCircleXmark,
  faFile,
  faSquarePlus,
  faCloudArrowUp,
  faHamburger,
  faFileLines,
  faXmarksLines,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import AppRouterContent from "./AppRouterContent";
// import { fab } from '@fortawesome/free-brands-svg-icons' this is if we decide to use any branded icons

library.add(
  faBox,
  faGear,
  faBagShopping,
  faMagnifyingGlass,
  faCircleXmark,
  faFile,
  faSquarePlus,
  faCloudArrowUp,
);

const App = () => {
  const { userData, userSettings } = useContext(InventoryContext);

  return (
    <>
      <Router>
        <div className="App">
          <div>
            <AuthProvider>
              <InventoryProvider>
                <PinningProvider
                  userData={userData}
                  userSettings={userSettings}
                >
                  <AppRouterContent />
                </PinningProvider>
              </InventoryProvider>
            </AuthProvider>
          </div>
        </div>
      </Router>
    </>
  );
};

export default App;
