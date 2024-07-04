import mapboxgl from 'mapbox-gl'

export interface MapboxInitData {
  id: string
  token: string
  style: string
  longPos: number
  latPos: number
  zoom: number
  projection: mapboxgl.Projection
  scrollZoom: boolean
  doubleClickZoom: boolean
  adressPos: string | false
  markerPos: string
}

export interface mapMarker {
  position: {
    type: string
    adress: string
    longitude: number
    latitude: number
  }
  htmlElement: HTMLElement
}
