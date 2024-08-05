"use client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const data = [
  {
    name: "January",
    income: 4000,
    expenses: 2400,
    amt: 2400,
  },
  {
    name: "February",
    income: 3000,
    expenses: 1398,
    amt: 2210,
  },
  {
    name: "March",
    income: 2000,
    expenses: 9800,
    amt: 2290,
  },
  {
    name: "April",
    income: 2780,
    expenses: 3908,
    amt: 2000,
  },
  {
    name: "May",
    income: 1890,
    expenses: 4800,
    amt: 2181,
  },
  {
    name: "June",
    income: 2390,
    expenses: 3800,
    amt: 2500,
  },
  {
    name: "July",
    income: 3490,
    expenses: 4300,
    amt: 2100,
  },
];

export default function FinanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
          // width={500}
          // height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"name"} />
        <YAxis />
        <Tooltip />
        <Legend layout="vertical" verticalAlign="top" iconType="circle" wrapperStyle={{left: 25}} height={60} />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="income" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
