"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  attendees: number;
  rating?: number;
  category: string;
  price: "Free" | "Paid";
  priceAmount?: string;
  image?: string;
  specialFeatures: string[];
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  urgent?: boolean;
  userGenerated?: boolean;
  url?: string;
}

interface EventDetailsDialogProps {
  event: Event;
  /**
   * Children that act as the trigger (e.g. the View Details button).
   */
  children: React.ReactNode;
}

export default function EventDetailsDialog({ event, children }: EventDetailsDialogProps) {
  const features = event.specialFeatures ?? []
  const tags = event.tags ?? []
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {event.title}
            <Badge
              variant={event.price === "Free" ? "secondary" : "default"}
              className={
                event.price === "Free"
                  ? "bg-green-500/90 text-white border-0"
                  : "bg-purple-500/90 text-white border-0"
              }
            >
              {event.price === "Free" ? "FREE" : event.priceAmount}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {event.description}
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-56 mb-6 rounded-lg overflow-hidden">
          {event.image && (
            <Image src={event.image} alt={event.title} fill className="object-cover" />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-white/80 mb-6">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-orange-400" />
            <span>{event.date}{event.time ? ` • ${event.time}` : ""}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-blue-400" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-green-400" />
            <span>{event.attendees} attendees</span>
          </div>
          {event.rating !== undefined && (
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
              <span>{event.rating} rating</span>
            </div>
          )}
        </div>

        {features.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Special Features</h4>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-orange-500/10 border-orange-400/30 text-orange-300 hover:bg-orange-500/20"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="text-center">
          {event.url && event.url.startsWith("http") ? (
            <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold">
              <a href={event.url} target="_blank" rel="noopener noreferrer">
                Register / Learn More
              </a>
            </Button>
          ) : (
            <Button disabled className="bg-gray-500 text-white font-semibold">
              Details Coming Soon
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
