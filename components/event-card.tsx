"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"



export interface EventCardProps {
  event: any
}

export default function EventCard({ event }: EventCardProps) {
  

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card
        
        className="group cursor-pointer bg-white/5 border-white/10 text-white backdrop-blur flex flex-col h-full overflow-hidden"
      >
        <CardContent className="p-6 flex flex-col gap-4">
          {/* Collapsed (always visible) */}
          <div>
            <h3 className="text-lg font-bold line-clamp-2 mb-2 drop-shadow-sm">
              {event.title}
            </h3>
            {/* meta */}
            <div className="space-y-1 text-sm text-white/70">
              <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" />{event.date}</div>
              <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{event.location}</div>
              <div className="flex items-center"><Users className="h-4 w-4 mr-2" />{event.attendees ? `${event.attendees} attendees` : "Attendees TBA"}</div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-400/30 text-purple-300 whitespace-normal max-w-none">
                {event.category}
              </Badge>
              {event.price === "Free" ? (
                <Badge className="text-xs bg-green-600/80 border-0">FREE</Badge>
              ) : event.priceAmount ? (
                <Badge className="text-xs bg-purple-500/80 border-0">
                  {event.priceAmount.length > 25 ? "Price TBA" : event.priceAmount}
                </Badge>
              ) : null}
            </div>
          </div>

          {/* Visit page button */}
          {(() => {
            const hasLink = !!event.url && event.url.startsWith("http")
            return (
              <Button
                asChild={hasLink}
                disabled={!hasLink}
                className={`w-full h-9 font-bold text-sm rounded-md mt-4 ${hasLink ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-purple-500/25" : "bg-gray-500/40 text-white/60 cursor-not-allowed"}`}
              >
                {hasLink ? (
                  <a href={event.url} target="_blank" rel="noopener noreferrer">
                    Visit Event Page
                  </a>
                ) : (
                  "No Link Available"
                )}
              </Button>
            )
          })()}

        </CardContent>
      </Card>
    </motion.div>
  )
}
