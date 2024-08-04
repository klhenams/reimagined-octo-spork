'use client'
import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan',
    menus: 4000,
    users: 2400,
    // amt: 2400,
  },
  {
    name: 'Feb',
    menus: 3000,
    users: 1398,
    // amt: 2400,
  },
  {
    name: 'Mar',
    menus: 2000,
    users: 9800,
    // amt: 2400,
  },
  {
    name: 'Apr',
    menus: 2780,
    users: 3908,
    // amt: 2400,
  },
  {
    name: 'May',
    menus: 2390,
    users: 3800,
    // amt: 2400,
  },
  {
    name: 'Jun',
    menus: 1890,
    users: 4180,
    // amt: 2400,
  },
  {
    name: 'Jul',
    menus: 3800,
    users: 2400,
    // amt: 2400,
  },
  {
    name: 'Aug',
    menus: 1800,
    users: 6000,
    // amt: 2400,
  },
  {
    name: 'Sep',
    menus: 4000,
    users: 2400,
    // amt: 2400,
  },
  {
    name: 'Oct',
    menus: 3490,
    users: 4300,
    // amt: 2400,
  },
  {
    name: 'Nov',
    menus: 4000,
    users: 2400,
    // amt: 2400,
  },
  {
    name: 'Dec',
    menus: 4000,
    users: 2400,
    // amt: 2400,
  },
 
];

export default class AdminLineChart extends PureComponent {
  static demoUrl = 'https://codesandbox.io/p/sandbox/line-chart-width-xaxis-padding-8v7952';

  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3"/> */}
          <XAxis dataKey="name" fontSize={12}/>
          <YAxis hide="true"/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="menus" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
