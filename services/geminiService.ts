import { GoogleGenAI, Type } from "@google/genai";
import { Service, TravelService } from "../types";

// --- Caching Implementation ---
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getFromCache = (key: string) => {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    const { timestamp, data } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (error) {
    console.warn("Could not read from cache:", error);
    return null;
  }
};

const setInCache = (key: string, data: any) => {
  try {
    const item = {
      timestamp: Date.now(),
      data,
    };
    sessionStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.warn("Could not write to cache:", error);
  }
};

// --- Error Handling ---
const processError = (error: any): never => {
    console.error("Error fetching from Gemini API:", error);
    const errorString = String(error.message || error);
    if (errorString.includes('429') || errorString.toLowerCase().includes('quota')) {
        throw new Error("You've made too many requests. Please wait a few moments and try again.");
    }
    throw new Error("Sorry, I'm having trouble connecting. Please try again later.");
};

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock_key" });

const travelAssistantSystemInstruction = `You are 'Safeguard', a friendly and helpful AI assistant for travelers. 
Your goal is to provide concise, useful, and safe information. 
Keep your answers brief and to the point.
If asked about sensitive topics like personal safety, give cautious and general advice, e.g., 'Always be aware of your surroundings and keep your valuables secure.'
If asked for medical advice, tell the user to contact emergency services or a professional doctor immediately.
Do not engage in long, off-topic conversations.
Start your very first message with a warm welcome like 'Hello! I'm Safeguard, your personal travel assistant. How can I help you today?'`;


export const getBotResponse = async (
  prompt: string,
  isFirstMessage: boolean
): Promise<string> => {
  if (!process.env.API_KEY) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            "Thank you for your message. The AI assistant is currently in mock mode."
          ),
        1000
      )
    );
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: isFirstMessage ? travelAssistantSystemInstruction : undefined,
        },
    });
    return response.text;
  } catch (error) {
    processError(error);
  }
};


export const getWeather = async (lat: number, lng: number) => {
  const cacheKey = `weather-${lat.toFixed(4)}-${lng.toFixed(4)}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;
  
  if (!process.env.API_KEY) {
    return {
      cityName: "Pune",
      current: { temp: 28, description: "Partly Cloudy", feelsLike: 30 },
      forecast: [
        { time: 'Now', temp: 28, description: 'Partly Cloudy' },
        { time: '2 PM', temp: 30, description: 'Sunny' },
        { time: '4 PM', temp: 29, description: 'Cloudy' },
      ],
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide the current weather and a 5-item hourly forecast for latitude ${lat} and longitude ${lng}. Identify the city name as well.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cityName: { type: Type.STRING },
            current: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.NUMBER },
                description: { type: Type.STRING },
                feelsLike: { type: Type.NUMBER },
              },
            },
            forecast: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  temp: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });
    const data = JSON.parse(response.text);
    setInCache(cacheKey, data);
    return data;
  } catch (error) {
    processError(error);
  }
};

export const getNearbyServices = async (lat: number, lng: number): Promise<Service[]> => {
    const cacheKey = `services-${lat.toFixed(4)}-${lng.toFixed(4)}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;

    if (!process.env.API_KEY) {
        return [
          { id: '1', name: 'Mock KEM Hospital', type: 'Hospital', location: { lat: lat + 0.001, lng: lng + 0.001 } },
          { id: '2', name: 'Mock Restaurant', type: 'Restaurant', location: { lat: lat - 0.002, lng: lng - 0.001 } },
        ];
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `List up to 8 nearby essential services (like 'Hospital', 'Police', 'Pharmacy', 'ATM', 'Restaurant', 'Hotel') within a 20 kilometer radius of latitude ${lat}, longitude ${lng}. Ensure the 'type' field is one of the requested categories.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        services: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    location: {
                                        type: Type.OBJECT,
                                        properties: {
                                            lat: { type: Type.NUMBER },
                                            lng: { type: Type.NUMBER },
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        const parsed = JSON.parse(response.text);
        setInCache(cacheKey, parsed.services);
        return parsed.services;
    } catch(error) {
        processError(error);
    }
};


export const getTravelRoutes = async (lat: number, lng: number): Promise<TravelService[]> => {
    const cacheKey = `routes-${lat.toFixed(4)}-${lng.toFixed(4)}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    if (!process.env.API_KEY) {
        return [
            { id: 'ts1', name: 'Mock Pune Railway Station', type: 'Train Station', location: { lat: lat + 0.01, lng: lng + 0.02 }, path: [{lat, lng}, { lat: lat + 0.01, lng: lng + 0.02 }] },
            { id: 'ts2', name: 'Mock Swargate Bus Station', type: 'Bus Station', location: { lat: lat - 0.01, lng: lng + 0.01 }, path: [{lat, lng}, { lat: lat - 0.01, lng: lng + 0.01 }] },
        ];
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `List 2 major travel hubs (one 'Train Station' and one 'Bus Station') near latitude ${lat}, longitude ${lng}. For each, provide a plausible travel path as an array of coordinates from the user's location.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        routes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    location: {
                                        type: Type.OBJECT,
                                        properties: {
                                            lat: { type: Type.NUMBER },
                                            lng: { type: Type.NUMBER },
                                        }
                                    },
                                    path: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                lat: { type: Type.NUMBER },
                                                lng: { type: Type.NUMBER },
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        const parsed = JSON.parse(response.text);
        setInCache(cacheKey, parsed.routes);
        return parsed.routes;
    } catch(error) {
        processError(error);
    }
};