"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type AccountingEntry = {
  date: string;
  liability: number;
  payable: number;
  assets: number;
  receivable: number;
  equity: number;
  revenue: number;
};

type SortConfig = {
  key: keyof AccountingEntry;
  direction: "asc" | "desc";
};

function generateDummyData(count: number): AccountingEntry[] {
  const dummyData: AccountingEntry[] = [];
  const startDate = new Date("2023-01-01");

  for (let i = 0; i < count; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    dummyData.push({
      date: currentDate.toISOString().split("T")[0],
      liability: Math.round(Math.random() * 10000) / 100,
      payable: Math.round(Math.random() * 10000) / 100,
      assets: Math.round(Math.random() * 10000) / 100,
      receivable: Math.round(Math.random() * 10000) / 100,
      equity: Math.round(Math.random() * 10000) / 100,
      revenue: Math.round(Math.random() * 10000) / 100,
    });
  }

  return dummyData;
}

export default function InputForm2() {
  const [entries, setEntries] = useState<AccountingEntry[]>([]);
  const [formData, setFormData] = useState({
    liability: "",
    payable: "",
    assets: "",
    receivable: "",
    equity: "",
    revenue: "",
  });
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "desc",
  });
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEntries(generateDummyData(500));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (tableRef.current) {
        const windowHeight = window.innerHeight;
        const tableTop = tableRef.current.getBoundingClientRect().top;
        const newHeight = windowHeight - tableTop - 20; // 20px for some bottom margin
        tableRef.current.style.height = `${newHeight}px`;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      date: new Date().toISOString().split("T")[0],
      ...Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          parseFloat(value) || 0,
        ])
      ),
    } as AccountingEntry;
    setEntries([newEntry, ...entries]);
    setFormData({
      liability: "",
      payable: "",
      assets: "",
      receivable: "",
      equity: "",
      revenue: "",
    });
  };

  const handleSort = (key: keyof AccountingEntry) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;
    const toDate = dateRange.to ? new Date(dateRange.to) : null;
    return (
      (!fromDate || entryDate >= fromDate) && (!toDate || entryDate <= toDate)
    );
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ columnKey }: { columnKey: keyof AccountingEntry }) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-2 h-4 w-4" />
      );
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className=" mx-auto p-4 h-screen flex flex-col">
      <div className="flex flex-col md:flex-row gap-8 flex-grow overflow-hidden">
        <div className="w-full p-2 md:w-1/3 overflow-y-auto flex items-center justify-center border-r border-gray-200 pr-8">
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <h2 className="text-2xl font-bold mb-4">Enter Accounting Data</h2>
            {Object.keys(formData).map((field) => (
              <div key={field}>
                <Label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  type="number"
                  id={field}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleInputChange}
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </div>
        <div className="w-full md:w-2/3 flex flex-col overflow-hidden">
          <h2 className="text-2xl font-bold mb-4">Accounting Entries</h2>
          <div className="flex gap-4 mb-4">
            <div>
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                type="date"
                id="fromDate"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="toDate">To Date</Label>
              <Input
                type="date"
                id="toDate"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
              />
            </div>
          </div>
          <div ref={tableRef} className="overflow-hidden flex-grow">
            <div className="h-full flex flex-col">
              <div className="bg-background">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[
                        "date",
                        "liability",
                        "payable",
                        "assets",
                        "receivable",
                        "equity",
                        "revenue",
                      ].map((key) => (
                        <TableHead
                          key={key}
                          className="cursor-pointer"
                          onClick={() =>
                            handleSort(key as keyof AccountingEntry)
                          }
                        >
                          <div className="flex items-center">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                            <SortIcon
                              columnKey={key as keyof AccountingEntry}
                            />
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>
              <div
                className="overflow-y-auto flex-grow"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style>{`
                  ::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <Table>
                  <TableBody>
                    {sortedEntries.map((entry, index) => (
                      <TableRow
                        key={index}
                        className={index % 2 === 0 ? "bg-muted" : ""}
                      >
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.liability.toFixed(2)}</TableCell>
                        <TableCell>{entry.payable.toFixed(2)}</TableCell>
                        <TableCell>{entry.assets.toFixed(2)}</TableCell>
                        <TableCell>{entry.receivable.toFixed(2)}</TableCell>
                        <TableCell>{entry.equity.toFixed(2)}</TableCell>
                        <TableCell>{entry.revenue.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
