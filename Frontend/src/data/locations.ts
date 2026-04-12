export interface FloorInfo {
  floors: number;
  rooms: number;
  depts?: string[];
}

export interface Location {
  id: number;
  name: string;
  category: string;
  description: string;
  images: string[];
  lat: number;
  lng: number;
  nearestNode: string | string[];
  floorInfo: FloorInfo;
  rating: number;
  hours: string;
  location: string;
  tags: string[];
}

export const locations: Location[] = [
  { id: 1, name: "New Building (NB)", category: "Academic", description: "The newest facility on campus, housing large lecture halls and specialized testing centers.", images: ["./map_assets/NB.jpg"], lat: 9.040957692431654, lng: 38.76394340354901, nearestNode: "N25", floorInfo: { floors: 4, rooms: 48, depts: ["Mechanical", "Industrial"] }, rating: 4.7, hours: "6:00 AM – 10:00 PM", location: "5 Kilo", tags: ["Exam Center", "Lecture Halls", "Student Lounge"] },
  { id: 2, name: "Basketball Court", category: "Sports", description: "Outdoor sports facility for students. Open for matches and training.", images: ["./map_assets/basket_ball_court.jpg"], lat: 9.0404498774296, lng: 38.76397350323512, nearestNode: "N26", floorInfo: { floors: 1, rooms: 0 }, rating: 4.3, hours: "Always open", location: "5 Kilo", tags: ["Recreation", "Outdoor"] },
  { id: 3, name: "Samsung Building", category: "Academic", description: "Hub for Information Technology. Contains advanced computer labs.", images: ["./map_assets/samsung_building.jpg"], lat: 9.041370764901272, lng: 38.763262761551715, nearestNode: "N3", floorInfo: { floors: 4, rooms: 22 }, rating: 4.6, hours: "8:00 AM - 8:00 PM", location: "5 Kilo", tags: ["Software Engineering", "IT Lab"] },
  { id: 4, name: "Main Library", category: "Libraries", description: "Quiet study zones and massive physical archive of engineering journals.", images: ["./map_assets/lib_front.jpg"], lat: 9.041051879132265, lng: 38.763161554844, nearestNode: "N8", floorInfo: { floors: 3, rooms: 15 }, rating: 4.8, hours: "24 hrs", location: "5 Kilo", tags: ["Study Rooms", "Digital Lab"] },
  { id: 5, name: "AAIT Auditorium", category: "Academic", description: "The primary event venue for conferences and workshops.", images: ["./map_assets/auditorium.jpg"], lat: 9.040916233607613, lng: 38.76293263490989, nearestNode: "N9", floorInfo: { floors: 2, rooms: 4 }, rating: 4.5, hours: "8:00 AM - 6:00 PM", location: "5 Kilo", tags: ["Events", "Conferences"] },
  { id: 6, name: "Mechanical Workshop", category: "Academic", description: "Practical training center for mechanical engineering students.", images: ["./map_assets/workshop.jpg"], lat: 9.041124266619578, lng: 38.76349197549062, nearestNode: "N7", floorInfo: { floors: 1, rooms: 4 }, rating: 4.4, hours: "8:00 AM - 5:00 PM", location: "5 Kilo", tags: ["Machinery", "Labs"] },
  { id: 7, name: "Building One", category: "Academic", description: "Home to the Civil Engineering department.", images: ["./map_assets/B1.jpg"], lat: 9.040858573778687, lng: 38.762678612980196, nearestNode: ["N11", "N31"], floorInfo: { floors: 4, rooms: 32 }, rating: 4.2, hours: "6:00 AM - 9:00 PM", location: "5 Kilo", tags: ["Civil Engineering"] },
  { id: 8, name: "Building Two", category: "Academic", description: "Undergraduate lectures and faculty offices.", images: ["./map_assets/B2.jpg"], lat: 9.040345724252314, lng: 38.76278497577002, nearestNode: ["N13", "N32"], floorInfo: { floors: 4, rooms: 28 }, rating: 4.1, hours: "6:00 AM - 9:00 PM", location: "5 Kilo", tags: ["Foundation Studies"] },
  { id: 9, name: "Building Three", category: "Academic", description: "Electrical and Computer Engineering building.", images: ["./map_assets/B3.jpg"], lat: 9.039950273516409, lng: 38.76288508192515, nearestNode: "N20", floorInfo: { floors: 4, rooms: 35 }, rating: 4.6, hours: "6:00 AM - 10:00 PM", location: "5 Kilo", tags: ["Electrical Eng", "Robotics"] },
  { id: 10, name: "Building Four", category: "Academic", description: "Administrative core housing the Registrar.", images: ["./map_assets/B4.jpg"], lat: 9.040676296018637, lng: 38.76357018342432, nearestNode: "N15", floorInfo: { floors: 1, rooms: 10 }, rating: 4.3, hours: "8:00 AM - 5:00 PM", location: "5 Kilo", tags: ["Registrar", "Dean"] },
  { id: 11, name: "Building Five", category: "Academic", description: "Chemical and environmental engineering labs.", images: ["./map_assets/B5.jpg"], lat: 9.040141820020844, lng: 38.763698444435576, nearestNode: "N17", floorInfo: { floors: 1, rooms: 20 }, rating: 4.4, hours: "8:00 AM - 5:00 PM", location: "5 Kilo", tags: ["Chemical Eng"] },
  { id: 12, name: "Building Six", category: "Academic", description: "Common areas and humanities department.", images: ["./map_assets/B6.jpg"], lat: 9.039817426687364, lng: 38.76340438260488, nearestNode: "N19", floorInfo: { floors: 3, rooms: 18 }, rating: 4.0, hours: "6:00 AM - 8:00 PM", location: "5 Kilo", tags: ["Humanities", "Lounge"] },
  { id: 13, name: "Football Court", category: "Sports", description: "Outdoor football field for students.", images: ["./map_assets/football.jpg"], lat: 9.040058404620138, lng: 38.76412076727753, nearestNode: "N27", floorInfo: { floors: 1, rooms: 0 }, rating: 4.9, hours: "Always open", location: "5 Kilo", tags: ["Football", "Sports"] },
  { id: 14, name: "Building Eight", category: "Academic", description: "New academic block extension.", images: ["./map_assets/B8.jpg"], lat: 9.041405406515072, lng: 38.763873630206646, nearestNode: "N4", floorInfo: { floors: 4, rooms: 40 }, rating: 4.5, hours: "6:00 AM - 9:00 PM", location: "5 Kilo", tags: ["Academic"] },
  { id: 15, name: "Main Parking", category: "Parking", description: "Main staff and visitor parking area.", images: ["./map_assets/parking.jpg"], lat: 9.039625879997576, lng: 38.763504488761875, nearestNode: "N22", floorInfo: { floors: 1, rooms: 0 }, rating: 4.0, hours: "24 hrs", location: "5 Kilo", tags: ["Parking", "Security"] },
  { id: 16, name: "Main Gate", category: "Outdoor", description: "Primary entrance gateway to the campus.", images: ["./map_assets/gateway.jpg"], lat: 9.039653685166678, lng: 38.762597276731015, nearestNode: "N28", floorInfo: { floors: 1, rooms: 1 }, rating: 4.8, hours: "24 hrs", location: "5 Kilo", tags: ["Entrance", "Landmark"] },
  { id: 17, name: "Second Gate", category: "Outdoor", description: "Pedestrian gate entrance.", images: ["./map_assets/gate2.jpg"], lat: 9.04093889954351, lng: 38.76219059547216, nearestNode: "N1", floorInfo: { floors: 1, rooms: 1 }, rating: 4.2, hours: "6:00 AM - 10:00 PM", location: "5 Kilo", tags: ["Pedestrian", "Gate"] },
  { id: 18, name: "Campus Garden", category: "Outdoor", description: "Lawn area for study and relaxation.", images: ["./map_assets/guarden.jpg"], lat: 9.040642312012546, lng: 38.76314786058052, nearestNode: "N9", floorInfo: { floors: 0, rooms: 0 }, rating: 4.7, hours: "Always Open", location: "5 Kilo", tags: ["Nature", "Relaxation"] },
  { id: 19, name: "Outdoor Study Area", category: "Outdoor", description: "Shaded seating for outdoor reading.", images: ["./map_assets/study_area.jpg"], lat: 9.040073851911298, lng: 38.763254223370346, nearestNode: "N19", floorInfo: { floors: 1, rooms: 0 }, rating: 4.5, hours: "Always Open", location: "5 Kilo", tags: ["Study", "Shaded"] },
  { id: 20, name: "Restrooms", category: "Outdoor", description: "Public restroom facilities.", images: ["./map_assets/restroom.jpg"], lat: 9.039718563892349, lng: 38.76424277165225, nearestNode: "N24", floorInfo: { floors: 1, rooms: 7 }, rating: 3.8, hours: "7:00 AM - 9:00 PM", location: "5 Kilo", tags: ["Service", "Hygiene"] },
];

export const featuredLocations = locations.slice(0, 4);

export const categories = [
  { id: 'Academic', name: 'Academic Buildings', count: 12, icon: 'Building2' },
  { id: 'Libraries', name: 'Libraries', count: 4, icon: 'BookOpen' },
  { id: 'Sports', name: 'Sports Facilities', count: 2, icon: 'Dumbbell' },
  { id: 'Outdoor', name: 'Outdoor Spaces', count: 5, icon: 'Trees' },
  { id: 'Parking', name: 'Parking', count: 1, icon: 'Car' },
];

export const CAMPUS_INFO = {
  name: 'CTBE',
  center: { lat: 9.0405, lng: 38.7634 },
  bounds: {
    north: 9.0430,
    south: 9.0380,
    east: 38.7660,
    west: 38.7600,
  },
};
