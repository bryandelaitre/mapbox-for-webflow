/* eslint-disable no-console */
import mapboxgl from 'mapbox-gl'

import { geocodeAdress } from './geocoding'
import { type MapboxInitData, type mapMarker } from './interfaces'

export function getMarkerFromDOM() {
  const markerElement = document.querySelector('[mapbox-marker="wrapper"]')
  let markerNode: HTMLElement
  let markerData: mapMarker
  if (markerElement != null) {
    markerNode = markerElement.cloneNode(true) as HTMLElement
    markerData = {
      longitude: parseFloat(markerElement.getAttribute('mapbox-marker-longitude') || '0.0'),
      latitude: parseFloat(markerElement.getAttribute('mapbox-marker-latitude') || '0.0'),
      adress: markerElement.getAttribute('mapbox-marker-adress') || '',
      htmlElement: markerNode,
    }
    markerElement.remove()
  } else {
    markerData = {
      longitude: 0.0,
      latitude: 0.0,
      adress: '',
      htmlElement: document.createElement('div'),
    }
  }
  return markerData
}

export function pushMarkerIntoMap(marker: mapMarker, map: mapboxgl.Map | undefined) {
  try {
    if (map != null) {
      new mapboxgl.Marker(marker.htmlElement)
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(map)
    } else {
      console.error('Map is not defined')
    }
  } catch (error) {
    console.error('Failed to push marker into map: ', error)
  }
}

export async function resolveMarkerCoordinates(markerData: mapMarker, mapData: MapboxInitData) {
  switch (markerData.adress) {
    case '':
      console.log('Pas de marker')
      return null

    case 'adress':
      console.log('adress')
      return [mapData.longPos, mapData.latPos]

    default:
      console.log('market set')
      return await geocodeAdress(markerData.adress)
  }
}
// function createMarker(data: MapboxInitData, map: mapboxgl.Map) {
//    // create a HTML element for each feature
//    if (data.markerPos != null && data.markerEl != null) {
//      const el = data.markerEl.cloneNode(true)
//      new mapboxgl.Marker(el).setLngLat(data.markerPos).addTo(map)
//    }
//  }
