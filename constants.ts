import type { Service, TravelService } from './types';

// User location set to Shaniwar Wada, Pune
export const USER_LOCATION = { lat: 18.5196, lng: 73.8554 }; 

export const NEARBY_SERVICES: Service[] = [
  { id: '1', name: 'KEM Hospital', type: 'Hospital', location: { lat: 18.5204, lng: 73.8567 } },
  { id: '2', name: 'Le Plaisir Restaurant', type: 'Restaurant', location: { lat: 18.5167, lng: 73.8444 } },
  { id: '3', name: 'Shivajinagar Police', type: 'Police', location: { lat: 18.5283, lng: 73.8475 } },
  { id: '4', name: 'JW Marriott Hotel', type: 'Hotel', location: { lat: 18.5307, lng: 73.8384 } },
];

export const TRAVEL_SERVICES: TravelService[] = [
    {
        id: 'ts1',
        name: 'Pune Railway Station',
        type: 'Train Station',
        location: { lat: 18.5276, lng: 73.8732 },
        path: [
            { lat: 18.5196, lng: 73.8554 },
            { lat: 18.5200, lng: 73.8600 },
            { lat: 18.5235, lng: 73.8655 },
            { lat: 18.5270, lng: 73.8720 },
            { lat: 18.5276, lng: 73.8732 },
        ]
    },
    {
        id: 'ts2',
        name: 'Swargate Bus Station',
        type: 'Bus Station',
        location: { lat: 18.5015, lng: 73.8645 },
        path: [
            { lat: 18.5196, lng: 73.8554 },
            { lat: 18.5150, lng: 73.8560 },
            { lat: 18.5080, lng: 73.8600 },
            { lat: 18.5020, lng: 73.8640 },
            { lat: 18.5015, lng: 73.8645 },
        ]
    }
];