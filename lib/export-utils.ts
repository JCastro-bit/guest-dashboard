import ExcelJS from "exceljs"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { Guest } from "./types"

/**
 * Export guests data to Excel file
 */
export async function exportGuestsToExcel(guests: Guest[], filename = "guests.xlsx") {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Guests")

  // Define columns with headers and widths
  worksheet.columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Side", key: "side", width: 12 },
    { header: "Status", key: "status", width: 15 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Created At", key: "createdAt", width: 15 },
  ]

  // Style the header row
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF5E6D3" }, // LOVEPOSTAL crema arena
  }

  // Add data rows
  guests.forEach((guest) => {
    worksheet.addRow({
      name: guest.name,
      side: guest.side,
      status: guest.status,
      email: guest.email || "N/A",
      phone: guest.phone || "N/A",
      createdAt: new Date(guest.createdAt).toLocaleDateString(),
    })
  })

  // Generate buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
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
      fillColor: [212, 113, 78], // LOVEPOSTAL terracota #D4714E
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [253, 250, 246], // LOVEPOSTAL fondo #FDFAF6
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
