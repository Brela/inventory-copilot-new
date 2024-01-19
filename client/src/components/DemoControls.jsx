import React, { useContext, useState, useEffect } from "react";
import './demoControls.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRotateLeft, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { InventoryContext } from "../contexts/inventory.context";
import { OrdersContext } from "../contexts/orders.context";
import { Switch, FormControlLabel, Slider } from "@mui/material";

export default function DemoControls() {
    const { startUsage, stopUsage, resetInventory, useSelectedOnlyOn, setUseSelectedOnlyOn, isUsingStock } = useContext(InventoryContext);
    const { deliveriesOn, setDeliveriesOn } = useContext(OrdersContext);
    // keep track of buttons active for css .active colors
    const [isPlaying, setIsPlaying] = useState(false);
    const [resetActive, setResetActive] = useState(false);

    const [expandDemoControls, setExpandDemoControls] = useState(false);
    const toggleDemoControlsBox = (event) => {
        setExpandDemoControls(!expandDemoControls);
    };

    // Synchronize isPlaying state with isUsingStock
    useEffect(() => {
        setIsPlaying(isUsingStock);
    }, [isUsingStock]);

    useEffect(() => {
        // This empty useEffect will force the component to re-render whenever deliveriesOn changes.
    }, [deliveriesOn]);

    const startUsageWithState = () => {
        startUsage();
        setIsPlaying(true);
        setResetActive(false);

    };

    const pauseUsageWithState = () => {
        stopUsage();
        setIsPlaying(false);
        setResetActive(false);
    };

    const resetInventoryWithState = () => {
        resetInventory();
        setIsPlaying(false);
        setResetActive(true);
        setTimeout(() => {
            setResetActive(false);
        }, 500);
    };

    const handleDeliveriesToggleChange = (event) => {
        setDeliveriesOn(event.target.checked);
    };
    const handleUseSelectedOnlyToggleChange = (event) => {
        setUseSelectedOnlyOn(event.target.checked);
    };

    const togglePlayStop = () => {
        if (isPlaying) {
            pauseUsageWithState();
        } else {
            startUsageWithState();
        }
    };

    return (
        <div className={`demo-container ${expandDemoControls ? "demo-container-expanded" : ""}`}>
            <div className="title-and-button-container">
                <h5>Demo Controls</h5>
                <button
                    onClick={toggleDemoControlsBox}
                >
                    <FontAwesomeIcon
                        icon={expandDemoControls ? faChevronDown : faChevronUp}
                        className="fa-icon"
                    />

                </button>
            </div>
            {expandDemoControls && (
                <div className={`expanded-container ${expandDemoControls ? "expanded-container-expanded" : ""}`}>
                    <div className="use-inventory-and-deliveries-container">
                        <div className="use-inventory-container">
                            <p>Use Inventory</p>
                            <div className="play-reset-buttons-container">
                                <button
                                    className={`${isPlaying ? "active" : ""}`}
                                    onClick={togglePlayStop}
                                >
                                    <FontAwesomeIcon
                                        icon={isPlaying ? faPause : faPlay}
                                        className="fa-icon"
                                    />
                                </button>
                                <button
                                    className={`${resetActive ? "active" : ""}`}
                                    onClick={resetInventoryWithState}
                                >
                                    <FontAwesomeIcon
                                        icon={faRotateLeft}
                                        className="fa-icon"
                                    />
                                </button>
                            </div>
                        </div>
                        <div className="delivery-switch-container">
                            <p>Deliveries</p>
                            <FormControlLabel
                                control={
                                    <Switch
                                        size="small"
                                        className="delivery-switch"
                                        checked={deliveriesOn}
                                        onChange={handleDeliveriesToggleChange}
                                        inputProps={{ "aria-label": "Toggle switch" }}
                                        sx={{
                                            '& .MuiSwitch-thumb': {
                                                backgroundColor: 'var(--light-grey)',
                                            },
                                            '& .MuiSwitch-track': {
                                                backgroundColor: 'grey',
                                            },
                                            '&.Mui-checked .MuiSwitch-thumb': {
                                                backgroundColor: 'rgb(134, 208, 199)',
                                            },
                                            '&.Mui-checked .MuiSwitch-track': {
                                                backgroundColor: 'rgb(134, 208, 199)',
                                            },
                                        }}
                                    />
                                }
                            // label="Toggle"
                            />
                        </div>
                    </div>
                    <div className="instructions">
                        <p>
                            Select a few products from the inventory then hit play.
                            This will run down the stock for those products.
                            When the "Stock" hits the "Target", you should see an order created for that product.
                            You can turn deliveries on (this delivers orders at random times between 2 and 20 seconds) or manually deliver each order with the edit icon. Click reset  to get the original stock numbers.
                        </p>
                    </div>
                    {/* this below section was used to have play-selected-products-only option */}
                    {/* <div className="use-selected-switch-container">
                        <p>Use Selected Only</p>
                        <FormControlLabel
                            control={
                                <Switch
                                    size="small"
                                    className="play-selected-only-switch"
                                    checked={useSelectedOnlyOn}
                                    onChange={handleUseSelectedOnlyToggleChange}
                                    inputProps={{ "aria-label": "Toggle switch" }}
                                    sx={{
                                        '& .MuiSwitch-thumb': {
                                            backgroundColor: 'var(--light-grey)',
                                        },
                                        '& .MuiSwitch-track': {
                                            backgroundColor: 'grey',
                                        },
                                        '&.Mui-checked .MuiSwitch-thumb': {
                                            backgroundColor: 'rgb(134, 208, 199)',
                                        },
                                        '&.Mui-checked .MuiSwitch-track': {
                                            backgroundColor: 'rgb(134, 208, 199)',
                                        },
                                    }}
                                />
                            }
                        // label="Toggle"
                        />
                    </div> */}
                    {/* usageSpeed slider */}
                    {/*  <div className="slider-container">
                        <p>Usage Speed</p>
                        <div className="slider">
                            <Slider
                                aria-label="Temperature"
                                defaultValue={1}
                                valueLabelDisplay="slow"
                                step={1}
                                marks
                                min={1}
                                max={5}
                                sx={{
                                    width: '100px',
                                    '& .MuiSlider-thumb': {
                                        backgroundColor: 'var(--light-grey)',
                                        borderColor: '',
                                    },
                                    '& .MuiSlider-track': {
                                        backgroundColor: 'rgb(134, 208, 199)',
                                        borderColor: 'rgb(134, 208, 199)',
                                    },
                                    '& .MuiSlider-rail': {
                                        backgroundColor: 'grey',
                                    },
                                }}
                            />
                        </div>
                    </div> */}
                </div>
            )}

        </div >

    )
}