"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

import { cn } from "@/lib/utils"
import { Months } from "react-day-picker"

export default function SSCalendar({className}: {className: string}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className={cn("rounded-md border shadow", className)}
    />
  )
}
