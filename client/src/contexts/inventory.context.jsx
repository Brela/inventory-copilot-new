import { createContext, useState, useEffect } from "react";
import { getInventoryList } from "../api/inventoryAPI";
import { getSettings } from "../api/settingsAPI";
import { updateSetting } from "../api/settingsAPI";
import { useTempInStock } from "../hooks/useTempStock";
import { useQuery } from "react-query";
import { authenticateUser } from "../api/authenticationAPI";

export const InventoryContext = createContext({
  userData: {},
  userSettings: {},
  inventory: [],
  reloadInventory: () => {},
  startUsage: () => {},
  stopUsage: () => {},
  resetInventory: () => {},
  useSelectedOnlyOn: false,
  setUseSelectedOnlyOn: () => {},
  isUsingStock: false,
  tempInStock: {},
  setTempInStock: () => {},
  selectedItems: [],
  setSelectedItems: () => {},
  toggleSelectedItem: () => {},
  isLoading: false,
});

export const InventoryProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [userSettings, setUserSettings] = useState({});
  const [inventory, setInventory] = useState([]);
  const [isUsingStock, setIsUsingStock] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tempInStock, setTempInStock] = useState({});
  // this is for demo controls to set the "Use Selected (products) Only" on or off
  const [useSelectedOnlyOn, setUseSelectedOnlyOn] = useState(false);
  const [hasFetchedUserSettings, setHasFetchedUserSettings] = useState(false);

  const fetchAndSetSettingsData = async () => {
    if (userData.id) {
      const freshSettingsData = await getSettings(userData.username);
      setUserSettings(freshSettingsData);
      setHasFetchedUserSettings(true); // Add this line
    }
  };
  /* 
  useEffect(() => {
    // console.log('userSettings:  ', userSettings)
    fetchAndSetSettingsData();
  }, [data]); */

  useEffect(() => {
    if (Object.keys(userSettings).length > 0) {
      reloadInventory();
    }
  }, [userSettings]);

  // Your existing reloadInventory function
  const reloadInventory = async (newInventory, updatedSettings) => {
    setIsLoading(true);
    if (newInventory) {
      setInventory(newInventory);
    } else {
      try {
        let updatedFilterBy, updatedSortOrder;
        if (updatedSettings) {
          let [filterBy, sortOrder] = updatedSettings;
          updatedFilterBy = filterBy;
          updatedSortOrder = sortOrder;
        }
        // if userData has a value and userSettings has at least one value,
        /*  if (userData && Object.keys(userSettings).length > 0) {
          const data = await getInventoryList(
            updatedFilterBy || userSettings.filterBy,
            updatedSortOrder || userSettings.sortOrder
            );
        } */
        const data = await getInventoryList();
        console.log(data);
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory list:", error);
      }
    }
    setIsLoading(false);
  };

  // load inventory on page load
  useEffect(() => {
    // authenticateUser();
    reloadInventory();
  }, []);

  // call the tempInStock hook that takes care of decreasing the inventory
  useTempInStock(
    inventory,
    isUsingStock,
    setIsUsingStock,
    tempInStock,
    setTempInStock,
    useSelectedOnlyOn,
    selectedItems,
    hasFetchedUserSettings,
  );

  // -----------------------  toggle selected items ---------------------
  const getInventoryIndex = (itemId) => {
    return inventory.findIndex((item) => item.id === itemId);
  };

  const toggleSelectedItem = async (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      const prevSelectedItemsArray = Array.from(prevSelectedItems);
      // Check if the item is already selected
      const itemIndexInSelected = prevSelectedItemsArray.indexOf(itemId);
      if (itemIndexInSelected !== -1) {
        // Remove the item from the selected items array
        console.log(
          "1) prevSelectedItemsArray before removing:  ",
          prevSelectedItemsArray,
        );
        prevSelectedItemsArray.splice(itemIndexInSelected, 1);
        console.log(
          "2) prevSelectedItemsArray after removing:  ",
          prevSelectedItemsArray,
        );
      } else {
        // Add the item to the selected items array in the correct order based on the inventory
        const inventoryIndex = getInventoryIndex(itemId);
        const insertIndex = prevSelectedItemsArray.findIndex(
          (selectedItemId) =>
            inventoryIndex < getInventoryIndex(selectedItemId),
        );
        if (insertIndex !== -1) {
          prevSelectedItemsArray.splice(insertIndex, 0, itemId);
        } else {
          prevSelectedItemsArray.push(itemId);
        }
      }
      // Filter out invalid item IDs
      const validSelectedItemsArray = prevSelectedItemsArray.filter(
        (selectedItemId) =>
          inventory.some((item) => item.id === selectedItemId),
      );

      // Update the settings after modifying the selected items array
      updateSetting(userData.username, { selected: prevSelectedItemsArray });
      // return the array
      return prevSelectedItemsArray;
    });
  };

  // ---------- save selected items to database and pull from db on page load --------
  const [attemptedToGetSelectedItems, setAttemptedToGetSelectedItems] =
    useState(false);
  useEffect(() => {
    // if selected items is empty and haven't attempted to get them yet and userSettings is defined, get selected items userSettings
    if (
      !selectedItems.length &&
      !attemptedToGetSelectedItems &&
      userSettings &&
      hasFetchedUserSettings &&
      // only match selectedItems array if it doesn't match user.settings
      selectedItems !== userSettings.selected
    ) {
      setSelectedItems(userSettings.selected || []);
      setAttemptedToGetSelectedItems(true);
    }
  }, [selectedItems, userSettings]);

  // --------------------- demo controls -------------------

  const startUsage = () => {
    setIsUsingStock(true);
  };

  const stopUsage = () => {
    setIsUsingStock(false);
  };

  const resetInventory = () => {
    reloadInventory();
  };
  // -----------------------------------

  const value = {
    userData,
    userSettings,
    inventory,
    reloadInventory,
    startUsage,
    stopUsage,
    resetInventory,
    useSelectedOnlyOn,
    setUseSelectedOnlyOn,
    isUsingStock,
    tempInStock,
    setTempInStock,
    selectedItems: Array.from(selectedItems),
    setSelectedItems,
    toggleSelectedItem,
    isLoading,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
