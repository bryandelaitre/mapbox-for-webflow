/* eslint-disable no-console */
import mapboxgl from 'mapbox-gl'

import { getGeocodingUrl } from './geocoding'
import { type MapboxInitData } from './interfaces'

const mapContainer = document.querySelector('[mapbox-container="true"]') as HTMLElement

let projectionValue = mapContainer.getAttribute('mapbox-projection') || 'naturalEarth'
if (!['mercator', 'naturalEarth', 'globe'].includes(projectionValue)) {
  projectionValue = 'naturalEarth'
}

let mapboxData: MapboxInitData
if (mapContainer) {
  mapboxData = {
    id: (mapContainer.id = 'map-container'),
    token: (mapboxgl.accessToken = mapContainer.getAttribute('mapbox-token') || ''),
    style: mapContainer.getAttribute('mapbox-style') || 'mapbox://styles/mapbox/streets-v11',
    longPos: parseFloat(mapContainer.getAttribute('mapbox-longitude') || '0.0'),
    latPos: parseFloat(mapContainer.getAttribute('mapbox-latitude') || '0.0'),
    zoom: parseInt(mapContainer.getAttribute('mapbox-zoom') || '3'),
    projection: projectionValue as unknown as mapboxgl.Projection,
    scrollZoom: mapContainer.getAttribute('mapbox-scrollZoom') === 'true',
    doubleClickZoom: mapContainer.getAttribute('mapbox-doubleClickZoom') === 'true',
    adressPos: mapContainer.getAttribute('mapbox-position') || false,
    markerPos: mapContainer.getAttribute('mapbox-marker') || '',
  }
} else {
  mapboxData = {
    id: 'map-container',
    token: '',
    style: 'mapbox://styles/mapbox/streets-v11',
    longPos: 0.0,
    latPos: 0.0,
    zoom: 3,
    projection: 'naturalEarth' as unknown as mapboxgl.Projection,
    scrollZoom: true,
    doubleClickZoom: true,
    adressPos: false,
    markerPos: '',
  }
}

export function getMapboxData() {
  return mapboxData
}

export async function constructMap(data: MapboxInitData) {
  if (data.adressPos) {
    // Use the Mapbox Geocoding API to geocode an address
    fetch(getGeocodingUrl(data.adressPos, mapboxgl.accessToken))
      .then((response) => response.json())
      .then((geocodeData) => {
        // Use a different variable name here
        if (geocodeData.features.length > 0) {
          const [longitude, latitude] = geocodeData.features[0].center
          // Update the original data object with the geocoded coordinates
          data.longPos = longitude
          data.latPos = latitude
        } else {
          console.error('No results found')
        }
        return newMap(data)
      })
      .catch((error) => console.error(error))
  } else {
    return await newMap(data)
  }
}

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
