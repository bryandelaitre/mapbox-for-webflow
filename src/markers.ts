/* eslint-disable no-console */
import mapboxgl from 'mapbox-gl'

import { geocodeAdress } from './geocoding'
import { type MapboxInitData, type mapMarker } from './interfaces'

// Pick the marker html from the dom, extract data and initialize the marker object
export function getMarkerFromDOM() {
  const markerElement = document.querySelector('[mapbox-marker="true"]')
  let markerNode: HTMLElement
  let markerData: mapMarker
  if (markerElement != null) {
    markerNode = markerElement.cloneNode(true) as HTMLElement
    markerData = {
      position: {
        type: '',
        adress: markerElement.getAttribute('mapbox-marker-adress') || '',
        longitude: parseFloat(markerElement.getAttribute('mapbox-marker-longitude') || '0.0'),
        latitude: parseFloat(markerElement.getAttribute('mapbox-marker-latitude') || '0.0'),
      },
      htmlElement: markerNode,
    }
    markerElement.remove()
  } else {
    markerData = {
      position: {
        type: 'adress',
        adress: '',
        longitude: 0.0,
        latitude: 0.0,
      },
      htmlElement: document.createElement('div'),
    }
  }

  return markerData
}

// Push the marker into the map
export async function pushMarkerIntoMap(marker: mapMarker, map: mapboxgl.Map | undefined) {
  try {
    if (map != null) {
      new mapboxgl.Marker(marker.htmlElement)
        .setLngLat([marker.position.longitude, marker.position.latitude])
        .addTo(map)
    } else {
      console.error('Map is not defined')
    }
  } catch (error) {
    console.error('Failed to push marker into map: ', error)
  }
}

// Resolve the marker position depending on the type of position provided
export async function resolveMarkerPosition(markerData: mapMarker, mapData: MapboxInitData) {
  if (markerData.position.adress.length > 0) {
    switch (markerData.position.adress) {
      case '':
        console.error('No adress provided')
        return markerData
      case 'map-position':
        markerData.position.type = 'map-position'
        markerData.position.longitude = mapData.longPos
        markerData.position.latitude = mapData.latPos
        return markerData
      default:
        const [longitude, latitude] = await geocodeAdress(markerData.position.adress)
        markerData.position.type = 'adress'
        markerData.position.longitude = longitude
        markerData.position.latitude = latitude
        return await markerData
    }
  } else {
    markerData.position.type = 'coordinates'
    return markerData
  }
}
