"use client";
import { Eye, SlidersHorizontal } from "lucide-react";

const data = [
  {
    code: "WB2154",
    name: "John Deo",
    number: "+31 123456789",
    email: "Johndeo@yopmail.com",
    date: "03/06/2025",
    time: "09:45 AM",
  },
  {
    code: "CF4512",
    name: "John Deo",
    number: "+31 123456789",
    email: "Johndeo@yopmail.com",
    date: "03/06/2025",
    time: "09:45 AM",
  },
  {
    code: "EB452",
    name: "John Deo",
    number: "+31 123456789",
    email: "Johndeo@yopmail.com",
    date: "03/06/2025",
    time: "09:45 AM",
  },
  {
    code: "PC4795",
    name: "John Deo",
    number: "+31 123456789",
    email: "Johndeo@yopmail.com",
    date: "03/06/2025",
    time: "09:45 AM",
  },
  {
    code: "EB6548",
    name: "John Deo",
    number: "+31 123456789",
    email: "Johndeo@yopmail.com",
    date: "03/06/2025",
    time: "09:45 AM",
  },
  {
    code: "EB021",
    name: "John Deo",
    number: "+31 123456789",
    email: "Johndeo@yopmail.com",
    date: "03/06/2025",
    time: "09:45 AM",
  },
  {
    code: "PC0215",
    name: "John Deo",
    number: "+31 123456789",
    email: "Johndeo@yopmail.com",
    date: "03/06/2025",
    time: "09:45 AM",
  },
  {
    code: "PC7552",
    name: "John Deo",
    number: "+31 123456789",
    email: "Johndeo@yopmail.com",
    date: "03/06/2025",
    time: "09:45 AM",
  },
];

export default function EmergencyAlertLogPage() {
  return (
    <div>
      <nav className="text-gray-500 text-sm mb-2 flex items-center gap-2">
        <span>Home</span>
        <span>&gt;</span>
        <span>Emergency Alert Log</span>
      </nav>
      <h1 className="text-2xl font-bold mb-1">Emergency Alert Log</h1>
      <div className="text-gray-500 mb-4">1110 Brown St..</div>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-4 py-2 text-left font-semibold">Code</th>
                <th className="px-4 py-2 text-left font-semibold">Employee Name</th>
                <th className="px-4 py-2 text-left font-semibold">Employee Number</th>
                <th className="px-4 py-2 text-left font-semibold">Email Id</th>
                <th className="px-4 py-2 text-left font-semibold">Emergency Date</th>
                <th className="px-4 py-2 text-left font-semibold">Emergency Time</th>
                <th className="px-4 py-2 text-center">
                  <SlidersHorizontal className="inline w-5 h-5 text-gray-400" />
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={row.code}
                  className="bg-white border-b hover:bg-gray-50 text-gray-700"
                >
                  <td className="px-4 py-2">{row.code}</td>
                  <td className="px-4 py-2">{row.name}</td>
                  <td className="px-4 py-2">{row.number}</td>
                  <td className="px-4 py-2">{row.email}</td>
                  <td className="px-4 py-2">{row.date}</td>
                  <td className="px-4 py-2">{row.time}</td>
                  <td className="px-4 py-2 text-center">
                    <button className="p-1 rounded hover:bg-gray-100">
                      <Eye className="w-5 h-5 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination and controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <span>Showing</span>
            <select className="border rounded px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>of 500</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="border rounded px-3 py-1 text-gray-700 text-sm">Reset Filters</button>
            <button className="border rounded px-2 py-1 text-gray-400" disabled>
              &lt;&lt;
            </button>
            <button className="border rounded px-2 py-1 text-gray-400" disabled>
              &lt;
            </button>
            <span className="text-gray-700 text-sm">1</span>
            <span className="text-gray-500 text-sm">of 25 pages</span>
            <button className="border rounded px-2 py-1 text-gray-700">
              &gt;
            </button>
            <button className="border rounded px-2 py-1 text-gray-700">
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}