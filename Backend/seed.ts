/**
 * Seed script — uploads building images to Cloudinary, inserts buildings into Supabase,
 * and creates a default admin account.
 *
 * Usage (from the Backend folder):
 *   npx ts-node seed.ts
 */

import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// All available building images (relative to this file)
const B = '../Frontend/public/buildings';
const images = [
  `${B}/1768114161376.jpg`,
  `${B}/1768114199013.jpg`,
  `${B}/1768114235748.jpg`,
  `${B}/1768114638183.jpg`,
  `${B}/1768114654027.jpg`,
  `${B}/1768114829575.jpg`,
  `${B}/1769362593942.jpg`,
  `${B}/1769362614753.jpg`,
  `${B}/1769362649567.png`,
  `${B}/1769362769376.png`,
  `${B}/1769362790307.png`,
  `${B}/1769363848703.jpg`,
  `${B}/1769363893163.jpg`,
  `${B}/1769363903423.jpg`,
  `${B}/1769366570259.jpg`,
  `${B}/1769443942560.jpg`,
  `${B}/1769509905056.jpg`,
  `${B}/1769511838556.jpg`,
  `${B}/1769511883466.jpg`,
  `${B}/1769511932896.jpg`,
];

interface SeedBuilding {
  name: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  nearestNode: string;
  floorinfo: object;
  hours: string;
  location: string;
  tags: string[];
  localImage: string;
}

const buildings: SeedBuilding[] = [
  { name: "New Building (NB)",    category: "Academic",  description: "The newest facility on campus, housing large lecture halls and specialized testing centers.", lat: 9.040957692431654,  lng: 38.76394340354901,  nearestNode: "N25",     floorinfo: { floors: 4, rooms: 48, depts: ["Mechanical","Industrial"] }, hours: "6:00 AM – 10:00 PM", location: "5 Kilo", tags: ["Exam Center","Lecture Halls","Student Lounge"], localImage: images[0] },
  { name: "Basketball Court",     category: "Sports",    description: "Outdoor sports facility for students. Open for matches and training.",                        lat: 9.0404498774296,   lng: 38.76397350323512,  nearestNode: "N26",     floorinfo: { floors: 1, rooms: 0 },                                    hours: "Always open",        location: "5 Kilo", tags: ["Recreation","Outdoor"],                        localImage: images[1] },
  { name: "Samsung Building",     category: "Academic",  description: "Hub for Information Technology. Contains advanced computer labs.",                           lat: 9.041370764901272,  lng: 38.763262761551715, nearestNode: "N3",      floorinfo: { floors: 4, rooms: 22 },                                   hours: "8:00 AM - 8:00 PM",  location: "5 Kilo", tags: ["Software Engineering","IT Lab"],               localImage: images[2] },
  { name: "Main Library",         category: "Libraries", description: "Quiet study zones and massive physical archive of engineering journals.",                    lat: 9.041051879132265,  lng: 38.763161554844,    nearestNode: "N8",      floorinfo: { floors: 3, rooms: 15 },                                   hours: "24 hrs",             location: "5 Kilo", tags: ["Study Rooms","Digital Lab"],                   localImage: images[3] },
  { name: "AAIT Auditorium",      category: "Academic",  description: "The primary event venue for conferences and workshops.",                                     lat: 9.040916233607613,  lng: 38.76293263490989,  nearestNode: "N9",      floorinfo: { floors: 2, rooms: 4 },                                    hours: "8:00 AM - 6:00 PM",  location: "5 Kilo", tags: ["Events","Conferences"],                        localImage: images[4] },
  { name: "Mechanical Workshop",  category: "Academic",  description: "Practical training center for mechanical engineering students.",                             lat: 9.041124266619578,  lng: 38.76349197549062,  nearestNode: "N7",      floorinfo: { floors: 1, rooms: 4 },                                    hours: "8:00 AM - 5:00 PM",  location: "5 Kilo", tags: ["Machinery","Labs"],                            localImage: images[5] },
  { name: "Building One",         category: "Academic",  description: "Home to the Civil Engineering department.",                                                  lat: 9.040858573778687,  lng: 38.762678612980196, nearestNode: "N11,N31", floorinfo: { floors: 4, rooms: 32 },                                   hours: "6:00 AM - 9:00 PM",  location: "5 Kilo", tags: ["Civil Engineering"],                           localImage: images[6] },
  { name: "Building Two",         category: "Academic",  description: "Undergraduate lectures and faculty offices.",                                                lat: 9.040345724252314,  lng: 38.76278497577002,  nearestNode: "N13,N32", floorinfo: { floors: 4, rooms: 28 },                                   hours: "6:00 AM - 9:00 PM",  location: "5 Kilo", tags: ["Foundation Studies"],                          localImage: images[7] },
  { name: "Building Three",       category: "Academic",  description: "Electrical and Computer Engineering building.",                                              lat: 9.039950273516409,  lng: 38.76288508192515,  nearestNode: "N20",     floorinfo: { floors: 4, rooms: 35 },                                   hours: "6:00 AM - 10:00 PM", location: "5 Kilo", tags: ["Electrical Eng","Robotics"],                   localImage: images[8] },
  { name: "Building Four",        category: "Academic",  description: "Administrative core housing the Registrar.",                                                 lat: 9.040676296018637,  lng: 38.76357018342432,  nearestNode: "N15",     floorinfo: { floors: 1, rooms: 10 },                                   hours: "8:00 AM - 5:00 PM",  location: "5 Kilo", tags: ["Registrar","Dean"],                            localImage: images[9] },
  { name: "Building Five",        category: "Academic",  description: "Chemical and environmental engineering labs.",                                               lat: 9.040141820020844,  lng: 38.763698444435576, nearestNode: "N17",     floorinfo: { floors: 1, rooms: 20 },                                   hours: "8:00 AM - 5:00 PM",  location: "5 Kilo", tags: ["Chemical Eng"],                                localImage: images[10] },
  { name: "Building Six",         category: "Academic",  description: "Common areas and humanities department.",                                                    lat: 9.039817426687364,  lng: 38.76340438260488,  nearestNode: "N19",     floorinfo: { floors: 3, rooms: 18 },                                   hours: "6:00 AM - 8:00 PM",  location: "5 Kilo", tags: ["Humanities","Lounge"],                         localImage: images[11] },
  { name: "Football Court",       category: "Sports",    description: "Outdoor football field for students.",                                                       lat: 9.040058404620138,  lng: 38.76412076727753,  nearestNode: "N27",     floorinfo: { floors: 1, rooms: 0 },                                    hours: "Always open",        location: "5 Kilo", tags: ["Football","Sports"],                           localImage: images[12] },
  { name: "Building Eight",       category: "Academic",  description: "New academic block extension.",                                                              lat: 9.041405406515072,  lng: 38.763873630206646, nearestNode: "N4",      floorinfo: { floors: 4, rooms: 40 },                                   hours: "6:00 AM - 9:00 PM",  location: "5 Kilo", tags: ["Academic"],                                    localImage: images[13] },
  { name: "Main Parking",         category: "Parking",   description: "Main staff and visitor parking area.",                                                       lat: 9.039625879997576,  lng: 38.763504488761875, nearestNode: "N22",     floorinfo: { floors: 1, rooms: 0 },                                    hours: "24 hrs",             location: "5 Kilo", tags: ["Parking","Security"],                          localImage: images[14] },
  { name: "Main Gate",            category: "Outdoor",   description: "Primary entrance gateway to the campus.",                                                    lat: 9.039653685166678,  lng: 38.762597276731015, nearestNode: "N28",     floorinfo: { floors: 1, rooms: 1 },                                    hours: "24 hrs",             location: "5 Kilo", tags: ["Entrance","Landmark"],                         localImage: images[15] },
  { name: "Second Gate",          category: "Outdoor",   description: "Pedestrian gate entrance.",                                                                  lat: 9.04093889954351,   lng: 38.76219059547216,  nearestNode: "N1",      floorinfo: { floors: 1, rooms: 1 },                                    hours: "6:00 AM - 10:00 PM", location: "5 Kilo", tags: ["Pedestrian","Gate"],                           localImage: images[16] },
  { name: "Campus Garden",        category: "Outdoor",   description: "Lawn area for study and relaxation.",                                                        lat: 9.040642312012546,  lng: 38.76314786058052,  nearestNode: "N9",      floorinfo: { floors: 0, rooms: 0 },                                    hours: "Always Open",        location: "5 Kilo", tags: ["Nature","Relaxation"],                         localImage: images[17] },
  { name: "Outdoor Study Area",   category: "Outdoor",   description: "Shaded seating for outdoor reading.",                                                        lat: 9.040073851911298,  lng: 38.763254223370346, nearestNode: "N19",     floorinfo: { floors: 1, rooms: 0 },                                    hours: "Always Open",        location: "5 Kilo", tags: ["Study","Shaded"],                              localImage: images[18] },
  { name: "Restrooms",            category: "Outdoor",   description: "Public restroom facilities.",                                                                lat: 9.039718563892349,  lng: 38.76424277165225,  nearestNode: "N24",     floorinfo: { floors: 1, rooms: 7 },                                    hours: "7:00 AM - 9:00 PM",  location: "5 Kilo", tags: ["Service","Hygiene"],                           localImage: images[19] },
];

async function uploadImage(localImage: string): Promise<string> {
  const resolved = path.resolve(__dirname, localImage);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Image not found: ${resolved}`);
  }
  const result = await cloudinary.uploader.upload(resolved, {
    folder: 'campus-buildings',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
  return result.secure_url;
}

async function seedBuildings() {
  console.log('\n🏛️  Seeding buildings...\n');

  const { error: deleteError } = await supabase.from('buildings').delete().neq('id', 0);
  if (deleteError) {
    console.warn('⚠️  Could not clear buildings:', deleteError.message);
  } else {
    console.log('🗑️  Cleared existing buildings');
  }

  for (const building of buildings) {
    try {
      console.log(`⬆️  Uploading: ${building.name}`);
      const imageUrl = await uploadImage(building.localImage);
      const { localImage, ...rest } = building;
      const { error } = await supabase.from('buildings').insert([{ ...rest, images: imageUrl }]);
      if (error) throw error;
      console.log(`✅  Inserted: ${building.name}`);
    } catch (err: any) {
      console.error(`❌  Failed for ${building.name}:`, err.message ?? err);
    }
  }
}

async function seedAdmin() {
  console.log('\n👤  Seeding admin...\n');

  const email = 'admin@gmail.com';
  const password = '123456';
  const username = 'admin';

  // Use service role key to bypass RLS for seeding
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    console.error('❌  SUPABASE_SERVICE_KEY not set in .env — cannot bypass RLS to insert admin.');
    console.log('   Add it from: Supabase Dashboard → Project Settings → API → service_role key');
    return;
  }

  const adminClient = createClient(process.env.SUPABASE_URL!, serviceKey);

  await adminClient.from('admins').delete().eq('email', email);

  const hashedPassword = await bcrypt.hash(password, 10);
  const { error } = await adminClient
    .from('admins')
    .insert([{ username, email, password: hashedPassword }]);

  if (error) {
    console.error('❌  Failed to create admin:', error.message);
  } else {
    console.log(`✅  Admin created — email: ${email} | password: ${password}`);
  }
}

async function seed() {
  console.log('🌱 Starting seed...');
  await seedBuildings();
  await seedAdmin();
  console.log('\n🎉 Seed complete!');
}

seed();
