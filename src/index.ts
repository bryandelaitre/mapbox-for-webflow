/* eslint-disable no-console */
import 'mapbox-gl/dist/mapbox-gl.css'

import { constructMap, getMapboxData } from './construct'
import { type MapboxInitData, type mapMarker } from './interfaces'
import { getMarkerFromDOM, pushMarkerIntoMap, resolveMarkerPosition } from './markers'

window.Webflow ||= []
window.Webflow.push(async () => {
  const mapContainer = document.querySelector('[mapbox-container="true"]') as HTMLElement
  const mapboxData: MapboxInitData = getMapboxData()
  const marker: mapMarker = getMarkerFromDOM()
  // Check if the token is available
  if (mapboxData.token) {
    try {
      await constructMap(mapboxData).then((map) => {
        resolveMarkerPosition(marker, mapboxData).then((marker) => {
          pushMarkerIntoMap(marker, map)
        })
        return map
      })
    } catch (error) {
      console.error('Failed to construct map: ', error)
    }
  } else {
    console.error('Mapbox Token is missing')
    mapContainer.style.display = 'none'
  }
})
