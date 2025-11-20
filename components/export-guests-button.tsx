"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileSpreadsheet, FileText, Table } from "lucide-react"
import { exportGuestsToExcel, exportGuestsToPDF, exportGuestsToCSV } from "@/lib/export-utils"
import type { Guest } from "@/lib/types"

interface ExportGuestsButtonProps {
  guests: Guest[]
}

export function ExportGuestsButton({ guests }: ExportGuestsButtonProps) {
  const handleExportExcel = () => {
    const timestamp = new Date().toISOString().split("T")[0]
    exportGuestsToExcel(guests, `guests_${timestamp}.xlsx`)
  }

  const handleExportPDF = () => {
    const timestamp = new Date().toISOString().split("T")[0]
    exportGuestsToPDF(guests, `guests_${timestamp}.pdf`)
  }

  const handleExportCSV = () => {
    const timestamp = new Date().toISOString().split("T")[0]
    exportGuestsToCSV(guests, `guests_${timestamp}.csv`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          Export to Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="mr-2 h-4 w-4 text-red-600" />
          Export to PDF (.pdf)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          <Table className="mr-2 h-4 w-4 text-blue-600" />
          Export to CSV (.csv)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
