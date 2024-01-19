import { useState, useEffect, useRef } from 'react';

export const useDropdown = () => {
  const [isDropOpen, setIsDropOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropOpen(!isDropOpen);
  };

  const handleDropClose = () => {
    setIsDropOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return { isDropOpen, setIsDropOpen, dropdownRef, toggleDropdown, handleDropClose };

};
