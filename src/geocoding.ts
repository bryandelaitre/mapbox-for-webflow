import mapboxgl from 'mapbox-gl'

// import { type MapboxInitData } from './interfaces'

export async function geocodeAdress(adress: string) {
  const response = await fetch(getGeocodingUrl(adress, mapboxgl.accessToken))
  const responseData = await response.json()
  const centerPos = await responseData.features[0].center
  return centerPos
}

export function getGeocodingUrl(address: string, accessToken: string) {
  const encodedAddress = encodeURIComponent(address)
  return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`
}
