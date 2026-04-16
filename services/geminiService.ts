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

// --- Robust JSON Parsing ---
const parseJsonResponse = (responseText: string) => {
    try {
        const trimmedText = responseText.trim();
        // Handle markdown code blocks for JSON, which the model might add
        if (trimmedText.startsWith('```json') && trimmedText.endsWith('```')) {
            const jsonString = trimmedText.substring(7, trimmedText.length - 3);
            return JSON.parse(jsonString);
        }
        return JSON.parse(trimmedText);
    } catch (e) {
        console.error("Failed to parse JSON response:", responseText);
        // Throw a specific error that can be handled by processError
        throw new Error("error_invalid_format");
    }
}


// --- Improved Error Handling ---
const processError = (error: any): never => {
    console.error("Detailed Gemini API Error:", error);
    const errorString = String(error.message || error);
    
    if (errorString.includes('429') || errorString.toLowerCase().includes('quota')) {
        throw new Error("error_too_many_requests");
    }
    
    if (errorString.toLowerCase().includes('api key') || errorString.toLowerCase().includes('unauthorized') || errorString.toLowerCase().includes('forbidden')) {
        throw new Error("error_api_key_invalid");
    }
    
    if (errorString.includes("error_invalid_format")) {
        throw new Error("error_invalid_format");
    }
    
    // If it's a model not found error, it might be because the model name is wrong or not available in the region
    if (errorString.toLowerCase().includes('not found') || errorString.toLowerCase().includes('model')) {
        console.error("Model error detected:", errorString);
    }

    // Pass the raw error message for debugging if it's not a known one
    throw new Error(`error_ai_connection: ${errorString}`);
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

let ai: GoogleGenAI | null = null;
const getAi = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Gemini Auth Check - Key available:", !!apiKey);
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};


const languageMap: { [key: string]: string } = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
  ta: 'Tamil',
  te: 'Telugu',
  ml: 'Malayalam',
  ur: 'Urdu',
  sa: 'Sanskrit',
};

export const getBotResponse = async (
  prompt: string,
  systemInstruction: string
): Promise<string> => {
  try {
    const apiCall = () => getAi().models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
        },
    });
    const response: GenerateContentResponse = await withRetry(apiCall);
    return response.text;
  } catch (error) {
    processError(error);
  }
};


export const getWeather = async (lat: number, lng: number, language: string) => {
  const languageName = languageMap[language] || 'English';
  const cacheKey = `weather-${lat.toFixed(4)}-${lng.toFixed(4)}-${language}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) return cachedData;
  
  try {
    const apiCall = () => getAi().models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide the current weather and a 5-item hourly forecast for latitude ${lat} and longitude ${lng}. Identify the city name. Also, provide a brief 'alertDescription' (max 15 words) and a boolean 'hasAlert' if there are any severe weather warnings like heavy rain, storms, or floods. If not, make 'alertDescription' an empty string and 'hasAlert' false. Provide all textual descriptions and the city name in ${languageName}.`,
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
    const response: GenerateContentResponse = await withRetry(apiCall);
    const data = parseJsonResponse(response.text);
    setInCache(cacheKey, data);
    return data;
  } catch (error) {
    processError(error);
  }
};

export const getNearbyServices = async (lat: number, lng: number, language: string): Promise<Service[]> => {
    const languageName = languageMap[language] || 'English';
    const cacheKey = `services-${lat.toFixed(4)}-${lng.toFixed(4)}-${language}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    try {
        const apiCall = () => getAi().models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `List up to 8 nearby essential services (like 'Hospital', 'Police', 'Pharmacy', 'ATM', 'Restaurant', 'Hotel') within a 20 kilometer radius of latitude ${lat}, longitude ${lng}. Ensure the 'type' field is one of the requested categories. Provide all service names and types in ${languageName}.`,
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
        const response: GenerateContentResponse = await withRetry(apiCall);
        const parsed = parseJsonResponse(response.text);
        setInCache(cacheKey, parsed.services);
        return parsed.services;
    } catch(error) {
        processError(error);
    }
};


export const getTravelRoutes = async (lat: number, lng: number, language: string): Promise<TravelService[]> => {
    const languageName = languageMap[language] || 'English';
    const cacheKey = `routes-${lat.toFixed(4)}-${lng.toFixed(4)}-${language}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    try {
        const apiCall = () => getAi().models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `List 2 major travel hubs (one 'Train Station' and one 'Bus Station') near latitude ${lat}, longitude ${lng}. For each, provide a plausible travel path as an array of coordinates from the user's location. Provide all names and types in ${languageName}.`,
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
        const response: GenerateContentResponse = await withRetry(apiCall);
        const parsed = parseJsonResponse(response.text);
        setInCache(cacheKey, parsed.routes);
        return parsed.routes;
    } catch(error) {
        processError(error);
    }
};

export const getSecureZones = async (lat: number, lng: number, language: string): Promise<SecureZone[]> => {
    const languageName = languageMap[language] || 'English';
    const cacheKey = `secure-zones-${lat.toFixed(4)}-${lng.toFixed(4)}-${language}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    try {
        const apiCall = () => getAi().models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `List up to 5 nearby secure zones within a 20km radius of latitude ${lat}, longitude ${lng}. These should be locations protected from natural disasters, like 'Community Shelter', 'Reinforced Building', or 'Emergency Bunker'. Provide a brief 'description' for each. Provide all names, types, and descriptions in ${languageName}.`,
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
        const response: GenerateContentResponse = await withRetry(apiCall);
        const parsed = parseJsonResponse(response.text);
        setInCache(cacheKey, parsed.zones);
        return parsed.zones;
    } catch(error) {
        processError(error);
    }
};


export const getLocalGuides = async (lat: number, lng: number, language: string): Promise<LocalGuide[]> => {
    const languageName = languageMap[language] || 'English';
    const cacheKey = `local-guides-${lat.toFixed(4)}-${lng.toFixed(4)}-${language}`;
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
    
    try {
        const apiCall = () => getAi().models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `List up to 5 local guides near latitude ${lat}, longitude ${lng}. Include their name, a brief specialty (e.g., 'Trekking', 'Historical Tours'), a valid Indian contact number, and their approximate location. Provide all names and specialties in ${languageName}.`,
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
        const response: GenerateContentResponse = await withRetry(apiCall);
        const parsed = parseJsonResponse(response.text);
        setInCache(cacheKey, parsed.guides);
        return parsed.guides;
    } catch(error) {
        processError(error);
    }
};