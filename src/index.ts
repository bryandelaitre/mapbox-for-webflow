/* eslint-disable no-console */
import mapboxgl from 'mapbox-gl'

import { constructMap, getMapboxData } from './construct'
import { type MapboxInitData, type mapMarker } from './interfaces'
import { getMarkerFromDOM, pushMarkerIntoMap } from './markers'

window.Webflow ||= []
window.Webflow.push(async () => {
  if (document.currentScript != null) {
    document.currentScript.id = 'mapboxInitScript'
  }

  // STORE MAP CONTAINER
  const mapContainer = document.querySelector('[mapbox-container="true"]') as HTMLElement
  const mapboxData: MapboxInitData = getMapboxData()
  const marker: mapMarker = getMarkerFromDOM()

  if (mapboxData.token) {
    try {
      const map: mapboxgl.Map | undefined = await constructMap(mapboxData)
      await pushMarkerIntoMap(marker, map)
    } catch (error) {
      console.error('Failed to construct map: ', error)
    }
  } else {
    console.error('Mapbox Token is missing')
    mapContainer.style.display = 'none'
  }
})
