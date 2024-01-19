import { createContext, useState, useEffect } from "react";
import { updateSetting } from "../api/settingsAPI";

export const PinningContext = createContext({
  pinnedItems: [],
  pinItem: () => {},
  unpinItem: () => {},
  isPinned: () => {},
});

export const PinningProvider = ({ children, userData, userSettings }) => {
  const [pinnedItems, setPinnedItems] = useState(userSettings?.pinned || []);

  useEffect(() => {
    // Load pinned items from the user's settings when the component mounts
    // or when userSettings updates
    if (userSettings?.pinned) {
      setPinnedItems(userSettings.pinned);
    }
  }, [userSettings]);

  const pinItem = async (itemId) => {
    try {
      const updatedPinnedItems = [...pinnedItems, itemId];
      // const updatedSettings = { ...userData.settings, pinned: updatedPinnedItems };
      const updatedSettings = { pinned: updatedPinnedItems };
      const response = await updateSetting(userData.username, updatedSettings);
      // userData.settings = updatedSettings;
      setPinnedItems(updatedPinnedItems);
    } catch (error) {
      console.error(error);
    }
  };

  const unpinItem = async (itemId) => {
    try {
      const updatedPinnedItems = pinnedItems.filter((id) => id !== itemId);
      // const updatedSettings = { ...userData.settings, pinned: updatedPinnedItems };
      const updatedSettings = { pinned: updatedPinnedItems };
      const response = await updateSetting(userData.username, updatedSettings);
      setPinnedItems(updatedPinnedItems);
    } catch (error) {
      console.error(error);
    }
  };

  const isPinned = (itemId) => {
    return pinnedItems.includes(itemId);
  };

  const value = {
    pinnedItems,
    pinItem,
    unpinItem,
    isPinned,
  };

  return (
    <PinningContext.Provider value={value}>{children}</PinningContext.Provider>
  );
};
