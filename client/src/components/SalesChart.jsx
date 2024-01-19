import React, { useState, useEffect } from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { useContext } from "react";
import { InventoryContext } from "../contexts/inventory.context";
import { getInventoryList } from "../api/inventoryAPI";
import "../components/SalesChart.css";

const SalesGraph = () => {
  const { inventory } = useContext(InventoryContext);

  const chartData = inventory.map((item) => ({
    SKU: item.productName,
    Stock: item.inStock,
    Target: item.reorderAt,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <XAxis
          stroke="#33b5af"
          dataKey="SKU"
          interval={0}
          tick={({ x, y, payload }) => (
            <g transform={`translate(${x},${y})`}>
              <text
                x={0}
                y={12}
                fontSize={9}
                textAnchor="end"
                angle={-40}
                fill="#666"
                transform={`rotate(-40)`}
              >
                {payload.value}
              </text>
            </g>
          )}
        />
        <YAxis stroke="#33b5af" />
        <Tooltip />
        <Legend layout="horizontal" align="right" verticalAlign="top" />
        <Bar dataKey="Stock" fill="#ccc" />
        <Bar dataKey="Target" fill="#33b5af" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesGraph;
