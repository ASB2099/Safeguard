import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Service, TravelService, SecureZone, LocalGuide } from "../types";

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

const withRetry = async <T>(apiCall: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> => {
  let attempt = 0;
  while (true) {
    try {
      return await apiCall();
    } catch (error: any) {
      attempt++;
      const errorString = String(error.message || error);
      const isRateLimitError = errorString.includes('429') || errorString.toLowerCase().includes('quota');
      
      if (isRateLimitError && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.warn(`Rate limit exceeded. Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Rethrow if not a rate limit error or if max retries reached
      }
    }
  }
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const travelAssistantSystemInstruction = `You are 'Surakshify', a friendly and helpful AI assistant for travelers. 
Your goal is to provide concise, useful, and safe information. 
Keep your answers brief and to the point.
If asked about sensitive topics like personal safety, give cautious and general advice, e.g., 'Always be aware of your surroundings and keep your valuables secure.'
If asked for medical advice, tell the user to contact emergency services or a professional doctor immediately.
Do not engage in long, off-topic conversations.
Start your very first message with a warm welcome like 'Hello! I'm Surakshify, your personal travel assistant. How can I help you today?'`;


export const getBotResponse = async (
  prompt: string,
  isFirstMessage: boolean
): Promise<string> => {
  try {
    const apiCall = () => ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: isFirstMessage ? travelAssistantSystemInstruction : undefined,
        },
    });
    // FIX: Explicitly type the response from the Gemini API call to resolve property 'text' not existing on 'unknown'.
    const response: GenerateContentResponse = await withRetry(apiCall);
    return response.text;
  } catch (error) {
    processError(error);
  }
};


export const getWeather = async (lat: number, lng: number) => {
  const cacheKey = `weather-${lat.toFixed(4)}-${lng.toFixed(4)}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;
  
  try {
    const apiCall = () => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide the current weather and a 5-item hourly forecast for latitude ${lat} and longitude ${lng}. Identify the city name. Also, provide a brief 'alertDescription' (max 15 words) and a boolean 'hasAlert' if there are any severe weather warnings like heavy rain, storms, or floods. If not, make 'alertDescription' an empty string and 'hasAlert' false.`,
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
            hasAlert: { type: Type.BOOLEAN },
            alertDescription: { type: Type.STRING },
          },
        },
      },
    });
    // FIX: Explicitly type the response from the Gemini API call to resolve property 'text' not existing on 'unknown'.
    const response: GenerateContentResponse = await withRetry(apiCall);
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
    
    try {
        const apiCall = () => ai.models.generateContent({
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
        // FIX: Explicitly type the response from the Gemini API call to resolve property 'text' not existing on 'unknown'.
        const response: GenerateContentResponse = await withRetry(apiCall);
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
    
    try {
        const apiCall = () => ai.models.generateContent({
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
        // FIX: Explicitly type the response from the Gemini API call to resolve property 'text' not existing on 'unknown'.
        const response: GenerateContentResponse = await withRetry(apiCall);
        const parsed = JSON.parse(response.text);
        setInCache(cacheKey, parsed.routes);
        return parsed.routes;
    } catch(error) {
        processError(error);
    }
};

export const getSecureZones = async (lat: number, lng: number): Promise<SecureZone[]> => {
    const cacheKey = `secure-zones-${lat.toFixed(4)}-${lng.toFixed(4)}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    try {
        const apiCall = () => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `List up to 5 nearby secure zones within a 20km radius of latitude ${lat}, longitude ${lng}. These should be locations protected from natural disasters, like 'Community Shelter', 'Reinforced Building', or 'Emergency Bunker'. Provide a brief 'description' for each.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        zones: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    description: { type: Type.STRING },
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
        // FIX: Explicitly type the response from the Gemini API call to resolve property 'text' not existing on 'unknown'.
        const response: GenerateContentResponse = await withRetry(apiCall);
        const parsed = JSON.parse(response.text);
        setInCache(cacheKey, parsed.zones);
        return parsed.zones;
    } catch(error) {
        processError(error);
    }
};


export const getLocalGuides = async (lat: number, lng: number): Promise<LocalGuide[]> => {
    const cacheKey = `local-guides-${lat.toFixed(4)}-${lng.toFixed(4)}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    try {
        const apiCall = () => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `List up to 5 local guides near latitude ${lat}, longitude ${lng}. Include their name, a brief specialty (e.g., 'Trekking', 'Historical Tours'), a valid Indian contact number, and their approximate location.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        guides: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    specialty: { type: Type.STRING },
                                    contact: { type: Type.STRING },
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
        // FIX: Explicitly type the response from the Gemini API call to resolve property 'text' not existing on 'unknown'.
        const response: GenerateContentResponse = await withRetry(apiCall);
        const parsed = JSON.parse(response.text);
        setInCache(cacheKey, parsed.guides);
        return parsed.guides;
    } catch(error) {
        processError(error);
    }
};