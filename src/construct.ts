/* eslint-disable no-console */
import mapboxgl from 'mapbox-gl'

import { getGeocodingUrl } from './geocoding'
import { type MapboxInitData } from './interfaces'

const mapContainer = document.querySelector('[mapbox-container="true"]') as HTMLElement

// List of available projections
const projectionList = [
  'albers',
  'equalEarth',
  'equirectangular',
  'lambertConformalConic',
  'mercator',
  'naturalEarth',
  'winkelTripel',
  'globe',
]

// Check if the projection value is valid
let projectionValue = (mapContainer.getAttribute('mapbox-projection') ||
  'naturalEarth') as mapboxgl.Projection['name']
if (!projectionList.includes(projectionValue)) {
  projectionValue = 'mercator'
}

// Store map container data
let mapboxData: MapboxInitData
if (mapContainer) {
  mapboxData = {
    id: (mapContainer.id = 'map-container'),
    token: (mapboxgl.accessToken = mapContainer.getAttribute('mapbox-token') || ''),
    style: mapContainer.getAttribute('mapbox-style') || 'mapbox://styles/mapbox/streets-v11',
    longPos: parseFloat(mapContainer.getAttribute('mapbox-position-longitude') || '0.0'),
    latPos: parseFloat(mapContainer.getAttribute('mapbox-position-latitude') || '0.0'),
    zoom: parseInt(mapContainer.getAttribute('mapbox-zoom') || '3'),
    projection: { name: projectionValue },
    scrollZoom: mapContainer.getAttribute('mapbox-scrollZoom') === 'true',
    doubleClickZoom: mapContainer.getAttribute('mapbox-doubleClickZoom') === 'true',
    adressPos: mapContainer.getAttribute('mapbox-position-adress') || false,
  }
} else {
  mapboxData = {
    id: 'map-container',
    token: '',
    style: 'mapbox://styles/mapbox/streets-v11',
    longPos: 0.0,
    latPos: 0.0,
    zoom: 3,
    projection: { name: 'naturalEarth' },
    scrollZoom: true,
    doubleClickZoom: true,
    adressPos: false,
  }
}

export function getMapboxData() {
  return mapboxData
}

// Construct the map with the provided data
export async function constructMap(data: MapboxInitData) {
  if (data.adressPos) {
    try {
      const response = await fetch(getGeocodingUrl(data.adressPos, mapboxgl.accessToken))
      const geocodeData = await response.json()
      if (geocodeData.features.length > 0) {
        const [longitude, latitude] = geocodeData.features[0].center
        data.longPos = longitude
        data.latPos = latitude
      } else {
        console.error('No results found')
      }
    } catch (error) {
      console.error(error)
    }
  }
  return await newMap(data)
}

// Create a new map instance with the provided data
async function newMap(data: MapboxInitData) {
  const map = new mapboxgl.Map({
    container: 'map-container',
    style: data.style,
    center: [data.longPos, data.latPos],
    zoom: data.zoom,
    projection: data.projection,
    scrollZoom: data.scrollZoom,
    doubleClickZoom: data.doubleClickZoom,
  })

  return map
}
