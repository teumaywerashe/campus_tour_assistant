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
  `${B}/1768114829575.jpg`,
  `${B}/1769363848703.jpg`,
  `${B}/1769511932896.jpg`,
  `${B}/1768114638183.jpg`,
  `${B}/1768114654027.jpg`,
  `${B}/1769511883466.jpg`,
  `${B}/1769366570259.jpg`,
  `${B}/image.png`,
  `${B}/second-gate.png`,
  `${B}/1769511838556.jpg`,
  `${B}/1769363893163.jpg`,
  `${B}/1768114199013.jpg`,
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
  { name: "Main Parking",         category: "Parking",   description: "Main staff and visitor parking area.",                                                       lat: 9.039625879997576,  lng: 38.763504488761875, nearestNode: "N22",     floorinfo: { floors: 1, rooms: 0 },                                    hours: "24 hrs",             location: "5 Kilo", tags: ["Parking","Security"],                          localImage: images[6] },
  { name: "Main Gate",            category: "Outdoor",   description: "Primary entrance gateway to the campus.",                                                    lat: 9.039653685166678,  lng: 38.762597276731015, nearestNode: "N28",     floorinfo: { floors: 1, rooms: 1 },                                    hours: "24 hrs",             location: "5 Kilo", tags: ["Entrance","Landmark"],                         localImage: images[7] },
  { name: "Second Gate",          category: "Outdoor",   description: "Pedestrian gate entrance.",                                                                  lat: 9.04093889954351,   lng: 38.76219059547216,  nearestNode: "N1",      floorinfo: { floors: 1, rooms: 1 },                                    hours: "6:00 AM - 10:00 PM", location: "5 Kilo", tags: ["Pedestrian","Gate"],                           localImage: images[8] },
  { name: "Campus Garden",        category: "Outdoor",   description: "Lawn area for study and relaxation.",                                                        lat: 9.040642312012546,  lng: 38.76314786058052,  nearestNode: "N9",      floorinfo: { floors: 0, rooms: 0 },                                    hours: "Always Open",        location: "5 Kilo", tags: ["Nature","Relaxation"],                         localImage: images[9] },
  { name: "Outdoor Study Area",   category: "Outdoor",   description: "Shaded seating for outdoor reading.",                                                        lat: 9.040073851911298,  lng: 38.763254223370346, nearestNode: "N19",     floorinfo: { floors: 1, rooms: 0 },                                    hours: "Always Open",        location: "5 Kilo", tags: ["Study","Shaded"],                              localImage: images[10] },
  { name: "Restrooms",            category: "Outdoor",   description: "Public restroom facilities.",                                                                lat: 9.039718563892349,  lng: 38.76424277165225,  nearestNode: "N24",     floorinfo: { floors: 1, rooms: 7 },                                    hours: "7:00 AM - 9:00 PM",  location: "5 Kilo", tags: ["Service","Hygiene"],                           localImage: images[11] },
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
