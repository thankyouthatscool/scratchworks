import type { Event, Location } from "@scratchworks/inertiion-services";

export type LocationWithEvents = Location & { events: Event[] };
