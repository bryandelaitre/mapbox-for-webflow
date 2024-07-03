/* eslint-disable no-console */
import { greetUser } from '$utils/greet'

window.Webflow ||= []
window.Webflow.push(() => {
  const name = 'John Doe'
  greetUser(name)
  console.log('mabpox-for-webflow')

  if (document.currentScript != null) {
    document.currentScript.id = 'mapboxInitScript'
  }
  // Create a new style element

  const MAPBOX_SCRIPT_PATH = 'https://api.tiles.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.js'
  const MAPBOX_SCRIPT_CSS = 'https://api.tiles.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css'

  // STORE MAP CONTAINER
  const mapContainer = document.querySelector('[data-mapbox-container="true"]') as HTMLElement
  const mapMarker = document.querySelector('[data-mapbox="marker"]')
  let markerNode: Element
  if (mapMarker != null) {
    markerNode = mapMarker.cloneNode(true) as Element
    mapMarker.remove()
  }

  // CREATE THE MAPBOX CSS ELEMENT
  const style = document.createElement('link')
  style.setAttribute('href', MAPBOX_SCRIPT_CSS)
  style.setAttribute('rel', 'stylesheet')
  document.head.appendChild(style)

  interface MapboxInitData {
    id: string
    token: string | false
    style: string
    longPos: number
    latPos: number
    zoom: number
    projection: string | false
    scrollZoom: boolean
    doubleClickZoom: boolean
    adressPos: string | false
    markerPos: string
    markerEl: Element | null // Replace 'any' with a more specific type if possible
  }

  // CREATE THE MAPBOX SCRIPT ELEMENT
  loadMapboxScript(MAPBOX_SCRIPT_PATH)
    .then(function () {
      console.log('Script has loaded')

      // FETCH ALL THE DATA
      if (mapContainer != null) {
        const mapboxInitData: MapboxInitData = {
          id: (mapContainer.id = 'map-container'),
          token: (mapboxgl.accessToken = mapContainer.getAttribute('data-mapbox-token') || false),
          style:
            mapContainer.getAttribute('data-mapbox-style') || 'mapbox://styles/mapbox/streets-v11',
          longPos: parseFloat(mapContainer.getAttribute('data-mapbox-longitude') || '0.0'),
          latPos: parseFloat(mapContainer.getAttribute('data-mapbox-latitude') || '0.0'),
          zoom: parseInt(mapContainer.getAttribute('data-mapbox-zoom') || '3'),
          projection: mapContainer.getAttribute('data-mapbox-projection') || false,
          scrollZoom: mapContainer.getAttribute('data-mapbox-scrollZoom') === 'true',
          doubleClickZoom: mapContainer.getAttribute('data-mapbox-doubleClickZoom') === 'true',
          adressPos: mapContainer.getAttribute('data-mapbox-center-adress') || false,
          markerPos: mapContainer.getAttribute('data-mapbox-marker') || '',
          markerEl: markerNode,
        }

        // IF TOKEN IS SET
        if (mapboxInitData.token) {
          mapboxInit(mapboxInitData)
        }

        // IF TOKEN NOT SET
        else {
          // HIDE MAPS
          mapContainer.style.display = 'none'
          if (!mapboxInitData.token) {
            console.error('Mapbox Token is missing')
          }
        }
      }
    })
    .catch(function (error) {
      console.error('Error loading script', error)
    })

  async function mapboxInit(data: MapboxInitData) {
    console.log(data.adressPos)
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
            console.log('No results found')
          }
          console.log(data.longPos, data.latPos)
          return newMap(data)
        })
        .catch((error) => console.error(error))
    } else {
      return await newMap(data)
    }
  }

  async function newMap(data: MapboxInitData) {
    let map
    map = new mapboxgl.Map({
      container: 'map-container',
      style: data.style,
      center: [data.longPos, data.latPos],
      zoom: data.zoom,
      projection: data.projection,
      scrollZoom: data.scrollZoom,
      doubleClickZoom: data.doubleClickZoom,
    })

    data.markerPos = await initializeMarkerCoordinates(data)

    createMarker(data, map)

    return map
  }

  async function initializeMarkerCoordinates(data: MapboxInitData) {
    switch (data.markerPos) {
      case '':
        console.log('Pas de marker')
        return null

      case 'adress':
        console.log('adress')
        return [data.longPos, data.latPos]

      default:
        console.log('market set')
        return await geocodeAdress(data)
    }
  }

  async function geocodeAdress(data: MapboxInitData) {
    const response = await fetch(getGeocodingUrl(data.markerPos, mapboxgl.accessToken))
    const responseData = await response.json()

    const centerPos = await responseData.features[0].center

    return centerPos
  }

  function getGeocodingUrl(address: string, accessToken: string) {
    const encodedAddress = encodeURIComponent(address)
    return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`
  }

  function loadMapboxScript(scriptCDN: string) {
    return new Promise(function (resolve, reject) {
      const script = document.createElement('script')
      script.src = scriptCDN
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  function createMarker(data: MapboxInitData, map: mapboxgl.Map) {
    // create a HTML element for each feature
    if (data.markerPos != null && data.markerEl != null) {
      const el = data.markerEl.cloneNode(true)
      new mapboxgl.Marker(el).setLngLat(data.markerPos).addTo(map)
    }
  }
})
