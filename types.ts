export enum Page {
  Splash,
  Registration,
  Home,
  Chat,
  Location,
  Services,
  Weather,
  ServiceMap,
  Travel,
  TravelMap,
  SOS,
  Preparedness,
  SecureZones,
  SecureZoneMap,
  EmergencyContacts,
  LocalGuides,
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface Service {
    id: string;
    name: string;
    type: string;
    location: { lat: number; lng: number };
}

export interface TravelService extends Service {
    path: { lat: number; lng: number }[];
}

export interface SecureZone {
    id: string;
    name: string;
    type: string;
    description: string;
    location: { lat: number; lng: number };
}

export interface LocalGuide {
    id: string;
    name: string;
    specialty: string;
    contact: string;
    location: { lat: number; lng: number };
}