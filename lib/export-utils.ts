import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { Guest } from "./types"

/**
 * Export guests data to Excel file
 */
export function exportGuestsToExcel(guests: Guest[], filename = "guests.xlsx") {
  // Prepare data for export
  const data = guests.map((guest) => ({
    Name: guest.name,
    Side: guest.side,
    Status: guest.status,
    Email: guest.email || "N/A",
    Phone: guest.phone || "N/A",
    "Created At": new Date(guest.createdAt).toLocaleDateString(),
  }))

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Set column widths
  const columnWidths = [
    { wch: 25 }, // Name
    { wch: 10 }, // Side
    { wch: 12 }, // Status
    { wch: 30 }, // Email
    { wch: 15 }, // Phone
    { wch: 15 }, // Created At
  ]
  worksheet["!cols"] = columnWidths

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Guests")

  // Export file
  XLSX.writeFile(workbook, filename)
}

/**
 * Export guests data to PDF file
 */
export function exportGuestsToPDF(guests: Guest[], filename = "guests.pdf") {
  // Create new PDF document
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(18)
  doc.text("Guest List", 14, 20)

  // Add metadata
  doc.setFontSize(10)
  doc.text(`Total Guests: ${guests.length}`, 14, 30)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36)

  // Prepare table data
  const tableData = guests.map((guest) => [
    guest.name,
    guest.side,
    guest.status,
    guest.email || "N/A",
    guest.phone || "N/A",
  ])

  // Add table
  autoTable(doc, {
    head: [["Name", "Side", "Status", "Email", "Phone"]],
    body: tableData,
    startY: 45,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [71, 85, 105], // slate-600
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    columnStyles: {
      0: { cellWidth: 45 }, // Name
      1: { cellWidth: 20 }, // Side
      2: { cellWidth: 25 }, // Status
      3: { cellWidth: 50 }, // Email
      4: { cellWidth: 35 }, // Phone
    },
  })

  // Save PDF
  doc.save(filename)
}

/**
 * Export guests data to CSV file
 */
export function exportGuestsToCSV(guests: Guest[], filename = "guests.csv") {
  // Prepare CSV headers
  const headers = ["Name", "Side", "Status", "Email", "Phone", "Created At"]

  // Prepare CSV rows
  const rows = guests.map((guest) => [
    guest.name,
    guest.side,
    guest.status,
    guest.email || "N/A",
    guest.phone || "N/A",
    new Date(guest.createdAt).toLocaleDateString(),
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
