import type { Trip, TripActivity } from "@/entities/trip"
import { addMinutes } from "date-fns"

/**
 * Parses an ISO date string like "2026-03-10" or "2026-03-10T00:00:00Z"
 * Returns a Date object with the correct year/month/day.
 */
function parseISODate(dateStr: string): Date {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const year = Number.parseInt(match[1], 10)
    const month = Number.parseInt(match[2], 10) - 1 // JS months are 0-indexed
    const day = Number.parseInt(match[3], 10)
    return new Date(year, month, day, 0, 0, 0, 0)
  }
  // Fallback: try native parsing
  return new Date(dateStr)
}

/**
 * Formats a Date object into ICS format: YYYYMMDDTHHMMSS
 */
function formatICSDate(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
}

/**
 * Generates an ICS file content for a trip.
 * Each activity is treated as a separate VEVENT.
 */
export function generateTripICS(trip: Trip): string {
  const events: string[] = []

  // Check if trip has valid dates - if not, we cannot generate a calendar
  if (!trip.start_date) {
    throw new Error(
      "This trip doesn't have dates set yet. Please add trip dates before exporting to calendar.",
    )
  }

  // Parse the trip start date once
  const tripStartDate = parseISODate(trip.start_date)
  if (
    Number.isNaN(tripStartDate.getTime()) ||
    tripStartDate.getFullYear() < 2000
  ) {
    throw new Error("Invalid trip start date. Please update your trip dates.")
  }

  trip.days.forEach((day) => {
    // Calculate the day's date from trip start + day_number
    // This is more reliable than depending on day.date which may be null
    const dayDate = new Date(tripStartDate.getTime())
    dayDate.setDate(tripStartDate.getDate() + (day.day_number - 1))

    day.activities.forEach((activity: TripActivity) => {
      // Parse the activity time
      const timeStr = activity.time || "08:00"
      const startTime = new Date(dayDate.getTime()) // Clone the date

      // Extract hours and minutes from time string
      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/)
      if (timeMatch) {
        startTime.setHours(
          Number.parseInt(timeMatch[1], 10),
          Number.parseInt(timeMatch[2], 10),
          0,
          0,
        )
      } else {
        // Fallback for non-standard times like "Morning"
        startTime.setHours(8, 0, 0, 0)
      }

      const endTime = addMinutes(startTime, activity.duration_minutes || 60)

      const event = [
        "BEGIN:VEVENT",
        `UID:${activity.id}-${Date.now()}@skysearch.com`,
        `DTSTAMP:${formatICSDate(new Date())}Z`,
        `DTSTART:${formatICSDate(startTime)}`,
        `DTEND:${formatICSDate(endTime)}`,
        `SUMMARY:${activity.name}`,
        `DESCRIPTION:${(activity.description || "").replace(/\n/g, "\\n")}${activity.insider_tip ? "\\n\\nTip: " + activity.insider_tip : ""}`,
        `LOCATION:${activity.location || trip.destination}`,
        "END:VEVENT",
      ]
      events.push(event.join("\r\n"))
    })
  })

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sky Search//Trip Planner//EN",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n")

  return ics
}

export function downloadICS(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" })
  const link = document.createElement("a")
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
