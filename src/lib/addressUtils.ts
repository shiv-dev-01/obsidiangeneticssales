import axios from 'axios';

export interface State {
  name: string;
  state_code: string;
}

export interface City {
  name: string;
}

export async function getUSStates(): Promise<State[]> {
  try {
    const response = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {
      country: "United States"
    });
    
    if (!response.data.error) {
      return response.data.data.states;
    }
    return [];
  } catch (error) {
    console.error('Error fetching US states:', error);
    return [];
  }
}

export async function getCitiesByState(stateName: string): Promise<City[]> {
  try {
    const response = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
      country: "United States",
      state: stateName
    });
    
    if (!response.data.error && Array.isArray(response.data.data)) {
      return response.data.data.map((cityName: string) => ({ name: cityName }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 10);
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  
  if (!match) return '';
  
  const [, area, prefix, line] = match;
  
  if (!prefix) return area;
  if (!line) return `(${area}) ${prefix}`;
  return `(${area}) ${prefix}-${line}`;
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
}