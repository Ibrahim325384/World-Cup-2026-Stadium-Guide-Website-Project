import { useEffect, useState } from 'react';
import { useMapsLibrary, useApiLoadingStatus } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MapPin, Navigation, Trophy, Sparkles, Clock, Compass, ShoppingBag, ShieldAlert, Heart, Phone, Activity, Shirt } from 'lucide-react';

interface NearbyPlacesProps {
  stadiumId?: string;
  center: { lat: number; lng: number };
  category: 'restaurant' | 'hotel' | 'attraction' | 'store' | 'parking' | 'emergency';
}

interface FanFestival {
  name: string;
  locationName: string;
  address: string;
  description: string;
  hours: string;
  capacity: string;
  entry: string;
  rating: number;
}

interface OfficialStore {
  name: string;
  locationName: string;
  address: string;
  description: string;
  hours: string;
  exclusives: string[];
}

interface EmergencyService {
  name: string;
  roomName: string;
  address: string;
  description: string;
  stadiumFirstAid: string;
  phone: string;
}

const OFFICIAL_STORES: Record<string, OfficialStore> = {
  'atlanta': {
    name: 'Official FIFA Store – Atlanta Mega-Hub',
    locationName: 'Mercedes-Benz Stadium Pro Shop & Gameday Plazas',
    address: '1 AMB Dr NW, Atlanta, GA 30313',
    description: 'The monumental flagship tournament retailer featuring exclusive World Cup 2026 jerseys, custom host city scarves, limited edition medallions, and dynamic name-pressing stations.',
    hours: '9:00 AM - 9:00 PM (Matchdays: until 1h post-match)',
    exclusives: ['Atlanta Host City Scarves', 'Custom Player Jersey Pressing', 'Official Match Balls']
  },
  'boston': {
    name: 'Official FIFA Megastore – Boston Metro',
    locationName: 'Gillette Stadium North Plaza & Patriots ProShop',
    address: '1 Patriot Pl, Foxborough, MA 02035',
    description: 'Expansive on-stadium retail destination stocked with authentic FIFA tournament kits, New England host city gear, collectable pins, and youth training equipment.',
    hours: '10:00 AM - 8:00 PM',
    exclusives: ['Boston Liberty Edition Pins', 'Historic New England Pennants', 'Tournament Apparel']
  },
  'dallas': {
    name: 'Official FIFA Superstore – Dallas',
    locationName: 'AT&T Stadium Main Pro Shop & East Plaza',
    address: '1 AT&T Way, Arlington, TX 76011',
    description: 'One of the largest global gear stadiums featuring massive custom-built kiosks, complete country collections, historic World Cup replica trophies, and direct shipping services.',
    hours: '9:00 AM - 9:00 PM',
    exclusives: ['Lone Star Tribute Tees', 'Engraved Title Replicas', 'National Team Kits']
  },
  'guadalajara': {
    name: 'Tienda Oficial FIFA™ – Guadalajara',
    locationName: 'Estadio Akron Fan Shops & Explanade B',
    address: 'C. Cto. JVC 2800, San Juan de Ocotán, 45010 Zapopan, Jal.',
    description: 'High-energy cultural outlet offering premium official apparel, limited-edition Mexican host-city accessories, national team scarves, and souvenir programs.',
    hours: '10:00 AM - 7:00 PM (Extended on Matchdays)',
    exclusives: ['Guadalajara Traditional Scarves', 'Exclusive Aztec Wave Caps', 'Matchday Souvenirs']
  },
  'houston': {
    name: 'Official FIFA Fan Shop – Houston',
    locationName: 'NRG Stadium West Arena & Team Store Area',
    address: '8400 Kirby Dr, Houston, TX 77054',
    description: 'Spacious official retail pavilion featuring customized commemorative pins for all Houston-scheduled fixtures, tournament jerseys, and interactive mini-football gear fields.',
    hours: '10:00 AM - 8:00 PM',
    exclusives: ['Houston Space City Jerseys', 'Fixture Commemorative Badges', 'Kids Official Toys']
  },
  'kansas-city': {
    name: 'Official FIFA Store – Kansas City',
    locationName: 'Arrowhead Stadium Official Pro Shop',
    address: '1 Arrowhead Dr, Kansas City, MO 64129',
    description: 'Action-packed fan outfitter stocked with authentic matchday kits, Heartland host-city collector coins, customized matchday program books, and soccer equipment.',
    hours: '9:00 AM - 7:00 PM',
    exclusives: ['Midwest Cup Coins', 'Custom Name Jerseys', 'Youth Tournament Kits']
  },
  'los-angeles': {
    name: 'FIFA Official Flagship Superstore – LA',
    locationName: 'SoFi Stadium Mega Pro Shop & Level 2 Grand Atrium',
    address: '1001 Stadium Dr, Inglewood, CA 90301',
    description: 'Immersive multi-level retail experience featuring virtual jersey-fitting mirrors, VIP merchandise suites, exclusive premium collectibles, and personalized tournament customization.',
    hours: '9:00 AM - 10:00 PM',
    exclusives: ['LA Sunset Edition Apparel', 'Virtual Reality Kit Fittings', 'Heritage Match Flags']
  },
  'mexico-city': {
    name: 'Supertienda Oficial de la Copa Mundial – CDMX',
    locationName: 'Estadio Azteca Superstore & Fan Plaza Sur',
    address: 'Calz. de Tlalpan 3465, Santa Úrsula Coapa, 04650 Ciudad de México',
    description: 'A monument of soccer fandom. Features exclusive golden-edition Azteca souvenirs, Mexican national heritage kits, official FIFA caps, and historic matches print booklets.',
    hours: '9:00 AM - 8:00 PM (Closes late on matchdays)',
    exclusives: ['Azteca Golden Collectables', 'CDMX Heritage Tees', 'FIFA Historic Books']
  },
  'miami': {
    name: 'Official FIFA Store & Megastore – Miami',
    locationName: 'Hard Rock Stadium South Pavilion & Core Pro Shop',
    address: '347 Don Shula Dr, Miami Gardens, FL 33056',
    description: 'Sleek, vibrant beachfront-inspired megastore packed with premium activewear, Florida tropical-edition apparel, national flags, and official match accessories.',
    hours: '10:00 AM - 9:00 PM',
    exclusives: ['Miami Deco Edition Apparel', 'Waterfront Matchday Flags', 'Premium Active Kits']
  },
  'monterrey': {
    name: 'Tienda Oficial de la Copa Mundial – Monterrey',
    locationName: 'Estadio BBVA Official Pro Shop & Gate 4',
    address: 'Av. Pablo Livas 2011, La Pastora, 67140 Guadalupe, N.L.',
    description: 'Beautiful localized stadium outlet offering Rayados-adjacent host city soccer jerseys, limited edition pins, official match balls, and customized fan hoodies.',
    hours: '10:00 AM - 7:00 PM',
    exclusives: ['Regio Mountain Scarves', 'Custom Tournament Hoodies', 'Sponsor Edition Matchballs']
  },
  'new-york': {
    name: 'FIFA World Cup™ Flagship Megastore – NY/NJ',
    locationName: 'MetLife Stadium Plaza & Giants/Jets Superstore',
    address: '1 MetLife Stadium Dr, East Rutherford, NJ 07073',
    description: 'The premier East Coast mega-retailer featuring over 15,000 square feet of official FIFA merchandise, commemorative final-phase gear, and global country fan kits.',
    hours: '9:00 AM - 9:00 PM',
    exclusives: ['New York Skyline Final Kits', 'Custom Fan Jersey Pressing', 'Exclusive Poster Series']
  },
  'philadelphia': {
    name: 'Official FIFA Merchandise Hub – Philadelphia',
    locationName: 'Lincoln Financial Field Pro Shop',
    address: '1020 Pattison Ave, Philadelphia, PA 19148',
    description: 'High-energy stadium fan shop boasting exclusive Liberty Bell soccer prints, Independence host-city hoodies, official ball pins, and local country tournament scarves.',
    hours: '10:00 AM - 6:00 PM (Matchday extensions apply)',
    exclusives: ['Liberty Bell Soccer Jerseys', 'Independence Commemorative Scarves', 'Philly Fan Kits']
  },
  'san-francisco': {
    name: 'Official FIFA Fan Gear Outlet – Bay Area',
    locationName: 'Levi\'s Stadium Team Store & Intel Plaza Kiosk',
    address: '4900 Marie P DeBartolo Way, Santa Clara, CA 95054',
    description: 'Premier West Coast gear center loaded with sustainability-made recycled tournament apparel, California edition soccer kits, official water bottles, and caps.',
    hours: '10:00 AM - 7:00 PM',
    exclusives: ['Eco-Thread Tournament Kits', 'Golden Gate Host Scarves', 'Active Recycled Gear']
  },
  'seattle': {
    name: 'Official FIFA Store & Seattle Pro Shop',
    locationName: 'Lumen Field Pro Shop & Northwest Plaza Kiosks',
    address: '800 Occidental Ave S, Seattle, WA 98134',
    description: 'Epic fan gear location specializing in Pacific Northwest rainproof tournament windbreakers, beautiful emerald-city soccer kits, match scarves, and flags.',
    hours: '10:00 AM - 7:00 PM',
    exclusives: ['Emerald City Rain Proof Windbreakers', 'Lumen Loudness Caps', 'Seattle Host City Patches']
  },
  'toronto': {
    name: 'Official FIFA Merchandise Hub – Toronto',
    locationName: 'BMO Field Stadium Shop & Front Street Pop-ups',
    address: '170 Princes\' Blvd, Toronto, ON M6K 3C3',
    description: 'Bustling tournament store offering maple-leaf tournament hats, exclusive Toronto-fixture commemorative tees, regional soccer scarves, and world cup pins.',
    hours: '10:00 AM - 8:00 PM',
    exclusives: ['Maple-Leaf Commemorative Tees', 'Ontario Official Scarves', 'FIFA Flag Pins']
  },
  'vancouver': {
    name: 'Official FIFA Fan Megastore – Vancouver',
    locationName: 'BC Place Retail Core & Terry Fox Plaza Hub',
    address: '777 Pacific Blvd, Vancouver, BC V6B 4Y8',
    description: 'Dynamic waterfront retail pavilion featuring West-Coast forest edition hoodies, raincoats, certified match balls, and customized name-pressing zones.',
    hours: '9:30 AM - 8:30 PM',
    exclusives: ['Pacific Forest Hoodies', 'Vancouver Rainy Match Gear', 'Custom Crest Embroidery']
  }
};

const EMERGENCY_SERVICES: Record<string, EmergencyService> = {
  'atlanta': {
    name: 'Grady Memorial Hospital',
    roomName: 'On-Site Medical: Sections 116, 134, 218, 312',
    address: '80 Jesse Hill Jr Dr SE, Atlanta, GA 30303',
    description: 'Grady is the primary Level 1 Trauma Center serving Atlanta. For immediate on-matchday medical needs, proceed to the closest First Aid suite inside Mercedes-Benz Stadium.',
    stadiumFirstAid: 'First Aid Suites: Active with emergency physicians, AED devices, and direct field-to-ambulance corridors.',
    phone: '911 (or Stadium Guest Services at 470-341-5000)'
  },
  'boston': {
    name: 'Sturdy Memorial Hospital / Newton-Wellesley Urgent Care',
    roomName: 'On-Site Medical: Mid-Concourse East & West, Sec 120',
    address: '211 Park St, Attleboro, MA 02703',
    description: 'Trusted municipal emergency room. Gillette Stadium features comprehensive emergency response teams stationed at concourses and surrounding zones.',
    stadiumFirstAid: 'Concourses First Aid: Managed by New England emergency response crews with support from mobile bicycle rescue squads.',
    phone: '911 (or Command Center: 508-308-7200)'
  },
  'dallas': {
    name: 'Texas Health Arlington Memorial Hospital',
    roomName: 'On-Site Medical: Sections 102, 124, 219, 415',
    address: '800 W Randol Mill Rd, Arlington, TX 76012',
    description: 'Full-service acute facility near AT&T Stadium. Stadium operates state-of-the-art triage clinics throughout the matches.',
    stadiumFirstAid: 'Triage Stadium Rooms: Staffed with advanced life support (ALS) paramedics, critical care providers, and trauma supervisors.',
    phone: '911 (or Stadium Logistics: 817-892-4000)'
  },
  'guadalajara': {
    name: 'Hospital Real San José (Zapopan)',
    roomName: 'On-Site Medical: Upper Gate B, Medical Care Tents',
    address: 'Av. Patria 1201, Villa Universitaria, 45110 Zapopan, Jal.',
    description: 'Elite bilingual emergency response hospital in Guadalajara. Medical emergency teams run rapid diagnostic and stabilization setups inside Akron.',
    stadiumFirstAid: 'Akron Medical Arenas: Highly trained Red Cross (Cruz Roja) crews with dual-stretcher carts and emergency vehicles.',
    phone: '911 or localized Red Cross: +52 33 3613 1111'
  },
  'houston': {
    name: 'Memorial Hermann Texas Medical Center',
    roomName: 'On-Site Medical: Sections 106, 126, 305, 524',
    address: '6411 Fannin St, Houston, TX 77030',
    description: 'One of the world\'s most advanced Level 1 trauma facilities. NRG Stadium runs multiple dedicated clinical wards for incoming spectating crowds.',
    stadiumFirstAid: 'Stadium Clinical Wards: Outfitted with full cardiac response equipment, pediatric-care modules, and direct air-ambulance integration.',
    phone: '911 (or NRG Safety Line: 832-667-1400)'
  },
  'kansas-city': {
    name: 'Research Medical Center',
    roomName: 'On-Site Medical: Section 112, 230, and 318',
    address: '2316 E Meyer Blvd, Kansas City, MO 64132',
    description: 'Distinguished critical healthcare center. Dedicated paramedics run fully equipped trauma-handling zones at Arrowhead Stadium.',
    stadiumFirstAid: 'First Aid Havens: Monitored by KC Metro first responders with direct radio backup and rapid transport links.',
    phone: '911 (or Arrowhead Guest Hub: 816-920-9300)'
  },
  'los-angeles': {
    name: 'Centinela Hospital Medical Center',
    roomName: 'On-Site Medical: SE Level 1, NE Level 4, Upper Concourse',
    address: '933 E Centennial Blvd, Inglewood, CA 90301',
    description: 'Nearest primary emergency hospital to SoFi Stadium. Arena hosts elite stadium clinics with emergency medical directors overseeing match safety.',
    stadiumFirstAid: 'SoFi High-Tech Clinics: Directed by board-certified doctors, active telemetry, and on-call cardiologist units.',
    phone: '911 (or SoFi Command Desk: 424-306-8000)'
  },
  'mexico-city': {
    name: 'Hospital Médica Sur (Tlalpan)',
    roomName: 'On-Site Medical: Tunel Nivel 1 & Salida Palcos VIP',
    address: 'Puente de Piedra 150, Toriello Guerra, Tlalpan, 14050 Ciudad de México',
    description: 'Acclaimed JCI-accredited medical complex in CDMX. Estadio Azteca boasts active state civil protection responders and rapid stadium dispatch points.',
    stadiumFirstAid: 'Estadio Azteca Clinics: Managed by specialty medical coordinators, ambulances, and federal civil safety squads.',
    phone: '911 or Médica Sur Central: +52 55 5424 7200'
  },
  'miami': {
    name: 'Aventura Hospital & Medical Center',
    roomName: 'On-Site Medical: Sections 114, 142, 214, 314',
    address: '20900 Biscayne Blvd, Personal Care, Aventura, FL 33180',
    description: 'Highly equipped trauma emergency provider. Dedicated sports paramedics have high-mobility golf carts and first aid rooms across Hard Rock Stadium.',
    stadiumFirstAid: 'Hard Rock Stadium First Aid: Advanced life support rooms, cooling hydration clinics, and expert heat-stroke teams.',
    phone: '911 (or Guest Services: 305-943-8000)'
  },
  'monterrey': {
    name: 'Hospital Christus Muguerza Sur',
    roomName: 'On-Site Medical: East Lower, West Upper, Gates 3 & 7',
    address: 'Carr Nacional km 268, Las Misiones, 64985 Monterrey, N.L.',
    description: 'Elite private regional emergency provider. Stadium BBVA integrates advanced paramedic mobile teams throughout match periods.',
    stadiumFirstAid: 'BBVA Mobile Paramedics: Strategic emergency pods with automated chest compression technology and trauma systems.',
    phone: '911 or Christus Muguerza: +52 81 8399 3400'
  },
  'new-york': {
    name: 'Hackensack University Medical Center',
    roomName: 'On-Site Medical: Sections 117, 142, 216, 317',
    address: '30 Prospect Ave, Hackensack, NJ 07601',
    description: 'Top-tier university health trauma networks. MetLife Stadium displays active red cross pods and dedicated triage bays at core plazas.',
    stadiumFirstAid: 'MetLife Medical Plazas: Active red cross cabins, emergency nurse practitioners, and specialized orthopedic medical providers.',
    phone: '911 (or MetLife Command: 201-559-1515)'
  },
  'philadelphia': {
    name: 'Methodist Hospital (Jefferson Health)',
    roomName: 'On-Site Medical: Sections 106, 126, 224',
    address: '2301 S Broad St, Philadelphia, PA 19148',
    description: 'Key community emergency hospital in South Philadelphia. Stadium boasts advanced response pods and direct clinical response capabilities.',
    stadiumFirstAid: 'Lincoln Field First Aid: Paramedics equipped with emergency response carts, oxygen systems, and rapid transport lanes.',
    phone: '911 (or Guest Command Force: 215-463-5500)'
  },
  'san-francisco': {
    name: 'Kaiser Permanente Santa Clara Medical Center',
    roomName: 'On-Site Medical: Section 109, 217, 307, Toyota Plaza B',
    address: '710 Lawrence Expy, Santa Clara, CA 95051',
    description: 'Distinguished bay area trauma provider. Highly specialized first response squads operate with localized dispatching inside Levi\'s Stadium.',
    stadiumFirstAid: 'First Aid Stations: Equipped with advanced cardiac support, heat relief pods, and secure field-exit corridors.',
    phone: '911 (or Guest Service Line: 408-562-4999)'
  },
  'seattle': {
    name: 'Harborview Medical Center',
    roomName: 'On-Site Medical: SW Event Level, Concourse 118 & 126',
    address: '325 9th Ave, Seattle, WA 98104',
    description: 'The Northwest\'s premier Level 1 regional trauma center. Lumen Field has designated first-aid facilities operated by specialty providers.',
    stadiumFirstAid: 'Lumen Medical Stations: Managed by regional sports medicine consultants with full defibrillator setups and stretcher portals.',
    phone: '911 (or Lumen Field Desk: 206-381-7555)'
  },
  'toronto': {
    name: 'Toronto Western Hospital',
    roomName: 'On-Site Medical: Gate 1 Main Concourse, Gate 4',
    address: '399 Bathurst St, Toronto, ON M5T 2S8',
    description: 'Premier downtown university hospital with advanced emergency department. BMO Field features dedicated matchday medical stations.',
    stadiumFirstAid: 'BMO Stadium First Aid: Active nursing staff, pediatric stabilization kits, and emergency transport vehicle bays.',
    phone: '911 (or Stadium Operations: 416-815-5500)'
  },
  'vancouver': {
    name: 'St. Paul\'s Hospital',
    roomName: 'On-Site Medical: Sections 216, 246, Level 4 Concourse',
    address: '1081 Burrard St, Vancouver, BC V6Z 1Y6',
    description: 'Venerated downtown acute care resource. BC Place hosts world-class match-safety teams with motorized response carts on the arena pathways.',
    stadiumFirstAid: 'BC Place Aid Stations: Stored emergency supplies, advanced trauma nurses, and direct link to emergency dispatch channels.',
    phone: '911 (or Guest Services: 604-669-2300)'
  }
};

const FAN_FESTIVALS: Record<string, FanFestival> = {
  'atlanta': {
    name: 'FIFA Fan Festival™ Atlanta',
    locationName: 'Centennial Olympic Park',
    address: '265 Park Ave West NW, Atlanta, GA 30313',
    description: 'Iconic Olympic legacy park hosting giant ultra-HD watch screens, global artist concerts, massive local food rows, and immersive soccer challenges.',
    hours: '11:00 AM - Midnight',
    capacity: '45,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.9
  },
  'boston': {
    name: 'FIFA Fan Festival™ Boston',
    locationName: 'Boston City Hall Plaza',
    address: '1 City Hall Square, Boston, MA 02201',
    description: 'The spectacular civic heart of New England, alive with massive public match screening zones, dynamic music lineups, and local seafood shacks.',
    hours: '11:00 AM - 11:00 PM',
    capacity: '20,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.8
  },
  'dallas': {
    name: 'FIFA Fan Festival™ Dallas',
    locationName: 'Fair Park',
    address: '3809 Grand Ave, Dallas, TX 75210',
    description: 'Historic landmark campus featuring monumental open-air watch parties, interactive country pavilions, craft bars, and soccer arenas.',
    hours: '10:00 AM - Midnight',
    capacity: '50,050 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.9
  },
  'guadalajara': {
    name: 'FIFA Fan Festival™ Guadalajara',
    locationName: 'Plaza de la Liberación',
    address: 'Calle de Morelos, Zona Centro, 44100 Guadalajara, Jal.',
    description: 'An explosive cultural arena celebrating deep Mexican heritage with enormous live match screens, grand mariachi soundstages, and legendary local street food.',
    hours: '11:00 AM - 11:00 PM',
    capacity: '35,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.9
  },
  'houston': {
    name: 'FIFA Fan Festival™ Houston',
    locationName: 'Discovery Green',
    address: '1500 McKinney St, Houston, TX 77010',
    description: 'Beautiful urban botanical park featuring massive screens, interactive esports setups, cooling zones, and high-energy music programs.',
    hours: '11:00 AM - 11:00 PM',
    capacity: '25,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.8
  },
  'kansas-city': {
    name: 'FIFA Fan Festival™ Kansas City',
    locationName: 'KC Power & Light District',
    address: '50 E 13th St, Kansas City, MO 64106',
    description: 'Midwestern soccer capital watch hub featuring giant surround-sound viewing decks, premium bars, and championship-tier offset BBQ courts.',
    hours: '10:00 AM - Midnight',
    capacity: '15,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.9
  },
  'los-angeles': {
    name: 'FIFA Fan Festival™ Los Angeles',
    locationName: 'Exposition Park',
    address: '700 Exposition Park Dr, Los Angeles, CA 90037',
    description: 'California’s ultimate fan hub hosting prime red-carpet pre-show events, high-octane DJ stages, beach football sands, and culinary rows.',
    hours: '11:00 AM - Midnight',
    capacity: '40,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.9
  },
  'mexico-city': {
    name: 'FIFA Fan Festival™ Mexico City',
    locationName: 'El Zócalo (Plaza de la Constitución)',
    address: 'Plaza de la Constitución S/N, Centro Histórico, 06000 CDMX',
    description: 'The world’s most spectacular, highest-density soccer gathering. Huge multi-screen arenas, live stadium concerts, and deep local culinary masterclasses.',
    hours: '10:00 AM - 11:00 PM',
    capacity: '80,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 5.0
  },
  'miami': {
    name: 'FIFA Fan Festival™ Miami',
    locationName: 'Bayfront Park',
    address: '301 Biscayne Blvd, Miami, FL 33132',
    description: 'Glistening waterfront festival zone featuring ocean breezes, world-famous Latin acoustic & electronic dance stages, and direct water transport hubs.',
    hours: 'Noon - Midnight',
    capacity: '30,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.9
  },
  'monterrey': {
    name: 'FIFA Fan Festival™ Monterrey',
    locationName: 'Macroplaza',
    address: 'Zaragoza y Zuazua, Centro, 64000 Monterrey, N.L.',
    description: 'Spectacular central park framed by the breathtaking Cerro de la Silla mountain. Features monumental screens, gaming lounges, and food-truck markets.',
    hours: '11:00 AM - 11:00 PM',
    capacity: '40,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.8
  },
  'new-york': {
    name: 'FIFA Fan Festival™ NJ/NY',
    locationName: 'Liberty State Park',
    address: '1 Audrey Zapp Dr, Jersey City, NJ 07305',
    description: 'Breathtaking park looking onto the iconic Statue of Liberty & Manhattan skyline. Outfitted with colossal viewing stages, soccer camps, and diverse international foods.',
    hours: '10:00 AM - Midnight',
    capacity: '50,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 5.0
  },
  'philadelphia': {
    name: 'FIFA Fan Festival™ Philadelphia',
    locationName: 'JFK Plaza (LOVE Park)',
    address: 'Arch St, Philadelphia, PA 19102',
    description: 'Historic city square hosting a high-definition match screenings pavilion, Philly cheesesteak row, target-shooting drills, and live local acts.',
    hours: '11:00 AM - 11:00 PM',
    capacity: '18,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.8
  },
  'san-francisco': {
    name: 'FIFA Fan Festival™ San Francisco',
    locationName: 'Civic Center Plaza',
    address: '335 McAllister St, San Francisco, CA 94102',
    description: 'The monumental civic plaza of San Francisco offering magnificent LED screen walls, California wine gardens, and interactive virtual reality soccer tournaments.',
    hours: '10:00 AM - 10:00 PM',
    capacity: '22,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.8
  },
  'seattle': {
    name: 'FIFA Fan Festival™ Seattle',
    locationName: 'Seattle Center',
    address: '305 Harrison St, Seattle, WA 98109',
    description: 'Pacific Northwest’s premiere host festival directly beneath the iconic Space Needle. Giant match pavilions, premium oyster bars, and incredible northwest indie rock lineups.',
    hours: '10:00 AM - 11:00 PM',
    capacity: '25,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.9
  },
  'toronto': {
    name: 'FIFA Fan Festival™ Toronto',
    locationName: 'Woodbine Park',
    address: '1695 Queen St E, Toronto, ON M4L 1G7',
    description: 'Spacious lakeside festival grounds hosting gigantic screens, international food districts representing Toronto’s cultural tapestry, and main-stage concerts.',
    hours: '11:00 AM - 11:00 PM',
    capacity: '30,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.9
  },
  'vancouver': {
    name: 'FIFA Fan Festival™ Vancouver',
    locationName: 'Concord Community Park',
    address: '50 Pacific Blvd, Vancouver, BC V6Z 2R6',
    description: 'False Creek waterfront festival venue with coastal views, giant surround-sound screen stages, local microbrew villages, and misting oasis cooling zones.',
    hours: '11:00 AM - 11:00 PM',
    capacity: '20,000 Capacity',
    entry: 'FREE ENTRY',
    rating: 4.9
  }
};

const CURATED_FALLBACK_PLACES: Record<string, Array<{
  id: string;
  displayName: string;
  formattedAddress: string;
  rating: number;
  types: string[];
}>> = {
  restaurant: [
    {
      id: 'fallback-r1',
      displayName: 'The Kickoff Tavern & Grill',
      formattedAddress: '0.8 miles from Stadium Plaza',
      rating: 4.8,
      types: ['sports_bar', 'restaurant']
    },
    {
      id: 'fallback-r2',
      displayName: 'Arena Plaza Food Hall',
      formattedAddress: '0.4 miles from Stadium Gates',
      rating: 4.6,
      types: ['food_court', 'local_fare']
    },
    {
      id: 'fallback-r3',
      displayName: 'The Stadium Club Lounge',
      formattedAddress: '0.2 miles from VIP Arrival Hub',
      rating: 4.9,
      types: ['fine_dining', 'bar']
    }
  ],
  hotel: [
    {
      id: 'fallback-h1',
      displayName: 'The Champion Resort & Suites',
      formattedAddress: '1.2 miles from Stadium Gate B',
      rating: 4.9,
      types: ['accommodation', 'luxury_hotel']
    },
    {
      id: 'fallback-h2',
      displayName: 'The Arena Plaza Hotel',
      formattedAddress: '0.5 miles from Stadium Walkway',
      rating: 4.7,
      types: ['hotel', 'modern_stay']
    },
    {
      id: 'fallback-h3',
      displayName: 'The Fan Base Lodge',
      formattedAddress: '1.5 miles – Near Regional Transit Hub',
      rating: 4.5,
      types: ['convenient_lodge', 'hotel']
    }
  ],
  parking: [
    {
      id: 'fallback-p1',
      displayName: 'Official West Gate Parking Deck',
      formattedAddress: 'Stadium West Entry Ring Road',
      rating: 4.7,
      types: ['secure_parking', 'pre_booked']
    },
    {
      id: 'fallback-p2',
      displayName: 'The North Terminal Surface Lot',
      formattedAddress: 'Adjacent to Transit Walkway North',
      rating: 4.4,
      types: ['surface_lot', 'shuttle_linked']
    },
    {
      id: 'fallback-p3',
      displayName: 'City Transit Overspill Lot',
      formattedAddress: '1.8 miles – Park & Ride Metro station',
      rating: 4.5,
      types: ['commuter_parking', 'shuttle_active']
    }
  ],
  attraction: [
    {
      id: 'fallback-a1',
      displayName: 'The World Cup Fan Boulevard',
      formattedAddress: 'Starts 0.3 miles from Main Gates',
      rating: 4.9,
      types: ['cultural_plaza', 'landmark']
    },
    {
      id: 'fallback-a2',
      displayName: 'Host City Heritage Walkway',
      formattedAddress: 'Connecting Transit Hub through Stadium',
      rating: 4.8,
      types: ['heritage_trail', 'sightseeing']
    }
  ],
  store: [],
  emergency: []
};

const getDisplayName = (place: any): string => {
  if (!place) return '';
  if (typeof place.displayName === 'object' && place.displayName !== null) {
    return place.displayName.text || '';
  }
  return place.displayName || '';
};

export default function NearbyPlaces({ stadiumId, center, category }: NearbyPlacesProps) {
  const placesLib = useMapsLibrary('places');
  const apiStatus = useApiLoadingStatus();
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!placesLib || !placesLib.Place || typeof placesLib.Place.searchByText !== 'function' || !center) {
      if (placesLib && !placesLib.Place) {
        console.warn('Google Places library failed to expose modern Place subclass due to API context limitations.');
      }
      return;
    }
    if (apiStatus as string === 'failed') return;

    setLoading(true);
    const queryMap = {
      restaurant: 'restaurants and dining',
      hotel: 'hotels and accommodation',
      attraction: 'tourist attractions and sightseeing',
      store: 'retail stores and official fan shops',
      parking: 'parking lots and public parking garages',
      emergency: 'hospitals, emergency rooms, and urgent care clinics'
    };

    placesLib.Place.searchByText({
      textQuery: `${queryMap[category]} near ${center.lat}, ${center.lng}`,
      fields: ['displayName', 'location', 'formattedAddress', 'rating', 'userRatingCount', 'photos', 'id', 'types'],
      locationBias: center,
      maxResultCount: 6,
    }).then(({ places }) => {
      setPlaces(places || []);
      setLoading(false);
    }).catch(err => {
      console.warn('Google Places API call bypassed or restricted:', err);
      setPlaces([]); // fallback will trigger automatically
      setLoading(false);
    });
  }, [placesLib, center, category, apiStatus]);

  const activeFestival = category === 'attraction' && stadiumId ? FAN_FESTIVALS[stadiumId] : null;
  const activeStore = category === 'store' && stadiumId ? OFFICIAL_STORES[stadiumId] : null;
  const activeEmergency = category === 'emergency' && stadiumId ? EMERGENCY_SERVICES[stadiumId] : null;

  const displayedPlaces = (places && places.length > 0)
    ? places
    : (CURATED_FALLBACK_PLACES[category] || []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-slate-900 animate-pulse rounded-[2.5rem] border border-slate-800 shadow-inner" />
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div 
        key={category}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Render Official Fan Festival Hero Card if in Attraction Tab */}
        {activeFestival && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="group md:col-span-2 lg:col-span-3 relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-indigo-550/10 overflow-hidden flex flex-col md:flex-row items-stretch gap-8"
          >
            {/* Visual glow accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] -mr-40 -mt-40 rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 blur-[100px] -ml-40 -mb-40 rounded-full pointer-events-none" />

            {/* Banner Left: Core branding & description */}
            <div className="flex-1 space-y-6 flex flex-col justify-between relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/15 border border-indigo-500/35 text-[9px] font-black uppercase tracking-[0.18em] text-indigo-400 rounded-full">
                    <Trophy className="w-3 h-3 text-indigo-400 animate-bounce" />
                    FIFA Landmark Event
                  </span>
                  <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.15em] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                    Official Location
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white italic">
                    {activeFestival.name}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-400 font-bold text-xs uppercase tracking-tight">
                    <Compass className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{activeFestival.locationName}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
                  {activeFestival.description}
                </p>
              </div>

              {/* Badges / Logistics tags */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-[10px] text-slate-400 font-black tracking-widest uppercase">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{activeFestival.hours}</span>
                </div>
                <div className="bg-slate-950 border border-slate-850 px-3.5 py-2 rounded-xl text-[10px] text-indigo-400 font-black tracking-widest uppercase font-mono">
                  {activeFestival.capacity}
                </div>
                <div className="bg-indigo-600 border border-indigo-550 px-3.5 py-2 rounded-xl text-[10px] text-white font-black tracking-widest uppercase font-mono shadow-md shadow-indigo-600/10">
                  {activeFestival.entry}
                </div>
              </div>
            </div>

            {/* Banner Right: Interactive map shortcut */}
            <div className="md:w-64 flex flex-col justify-between p-6 bg-slate-950/60 border border-slate-900/60 rounded-3xl relative z-10 shrink-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono">Civic Coordinates</span>
                  <div className="flex items-center gap-1 text-[10px] font-black bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 text-indigo-400 font-mono">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {activeFestival.rating}
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-[10px] text-slate-400 font-medium tracking-tight">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{activeFestival.address}</span>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activeFestival.name} ${activeFestival.locationName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/15 transition-all duration-300 active:scale-95 group-hover:scale-[1.02]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Render Official Superstore Hero Card if in Store Tab */}
        {activeStore && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="group md:col-span-2 lg:col-span-3 relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-indigo-550/10 overflow-hidden flex flex-col md:flex-row items-stretch gap-8"
          >
            {/* Visual glow accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] -mr-40 -mt-40 rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 blur-[100px] -ml-40 -mb-40 rounded-full pointer-events-none" />

            {/* Banner Left: Core branding & description */}
            <div className="flex-1 space-y-6 flex flex-col justify-between relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/15 border border-indigo-500/35 text-[9px] font-black uppercase tracking-[0.18em] text-indigo-400 rounded-full">
                    <ShoppingBag className="w-3 h-3 text-indigo-400 animate-pulse" />
                    FIFA Official Merch
                  </span>
                  <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.15em] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                    Licensed Superstore
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white italic">
                    {activeStore.name}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-400 font-bold text-xs uppercase tracking-tight">
                    <Shirt className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{activeStore.locationName}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
                  {activeStore.description}
                </p>
              </div>

              {/* Exclusives tags */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-500 font-mono">Exclusive Gear Storefront Items</h4>
                <div className="flex flex-wrap items-center gap-2">
                  {activeStore.exclusives.map((item, id) => (
                    <span key={id} className="flex items-center gap-1 px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-[9px] text-slate-300 font-black tracking-wider uppercase font-mono">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Banner Right: Interactive map shortcut */}
            <div className="md:w-64 flex flex-col justify-between p-6 bg-slate-950/60 border border-slate-900/60 rounded-3xl relative z-10 shrink-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono">Store Hours</span>
                  <div className="flex items-center gap-1 text-[8px] font-black bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 text-indigo-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    ACTIVE DAILY
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-[10px] text-slate-400 font-medium tracking-tight">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{activeStore.address}</span>
                </div>
                <p className="text-[9px] text-slate-500 font-bold leading-normal font-mono uppercase tracking-tight">Hours: {activeStore.hours}</p>
              </div>

              <div className="pt-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activeStore.name} ${activeStore.locationName}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/15 transition-all duration-300 active:scale-95 group-hover:scale-[1.02]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Render Official Emergency Services & Support Card if in Emergency Tab */}
        {activeEmergency && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="group md:col-span-2 lg:col-span-3 relative bg-gradient-to-br from-red-950/60 via-slate-900 to-red-950/40 border border-red-500/20 p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-red-550/5 overflow-hidden flex flex-col md:flex-row items-stretch gap-8"
          >
            {/* Visual glow accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 blur-[100px] -mr-40 -mt-40 rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 blur-[100px] -ml-40 -mb-40 rounded-full pointer-events-none" />

            {/* Banner Left: Core branding & description */}
            <div className="flex-1 space-y-6 flex flex-col justify-between relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-550/15 border border-red-500/35 text-[9px] font-black uppercase tracking-[0.18em] text-red-400 rounded-full">
                    <ShieldAlert className="w-3 h-3 text-red-400 animate-pulse" />
                    Emergency Protocol
                  </span>
                  <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.15em] bg-orange-500/15 text-orange-400 border border-orange-500/25 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 animate-ping" />
                    Matchday Medical Active
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white italic">
                    {activeEmergency.roomName}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-400 font-bold text-xs uppercase tracking-tight">
                    <Activity className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
                    <span>Primary ER: {activeEmergency.name}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
                  {activeEmergency.description}
                </p>
              </div>

              {/* On-site response guidance */}
              <div className="bg-slate-950/60 relative border border-slate-850 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white">First Aid Suite Care Instructions:</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                  {activeEmergency.stadiumFirstAid}
                </p>
              </div>
            </div>

            {/* Banner Right: Interactive map shortcut */}
            <div className="md:w-64 flex flex-col justify-between p-6 bg-slate-950/60 border border-slate-900/60 rounded-3xl relative z-10 shrink-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-rose-950">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono">Emergency Contact</span>
                  <div className="flex items-center gap-1 text-[8px] font-black bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 text-red-400 font-mono">
                    <Phone className="w-3 h-3 text-red-400" />
                    24/7 HELPLINE
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-[10px] text-slate-400 font-medium tracking-tight">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{activeEmergency.address}</span>
                </div>
                <div className="pt-2">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-mono">CALL COMMAND CENTER:</span>
                  <p className="text-[11px] font-black text-rose-400 tracking-wider font-mono">{activeEmergency.phone}</p>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activeEmergency.name} ${activeEmergency.address}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-rose-700 hover:bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-rose-950 transition-all duration-300 active:scale-95 group-hover:scale-[1.02]"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate To ER</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {displayedPlaces.length > 0 ? (
          displayedPlaces.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] hover:bg-slate-800/80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/5 shadow-inner"
            >
              <div className="flex justify-between items-start mb-4">
                 <h3 className="font-black text-sm uppercase tracking-tight line-clamp-1 group-hover:text-indigo-400 transition-colors italic leading-none">
                   {getDisplayName(place)}
                 </h3>
                 {place.rating && (
                   <div className="flex items-center gap-1 text-[10px] font-black bg-indigo-600/10 px-2.5 py-1 rounded-full border border-indigo-500/20 text-indigo-400 font-mono">
                     <Star className="w-2.5 h-2.5 fill-current" />
                     {place.rating}
                   </div>
                 )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-indigo-500 mt-0.5" />
                  <span className="line-clamp-2 leading-tight">{place.formattedAddress}</span>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-slate-800">
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest italic">
                    {place.types?.[0]?.replace(/_/g, ' ') || 'Elite Locality'}
                  </p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getDisplayName(place))}&query_place_id=${place.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center bg-slate-950 border border-slate-800 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg hover:rotate-12"
                  >
                    <Navigation className="w-4 h-4 italic" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          !activeFestival && (
            <div className="col-span-full py-16 text-center text-slate-600 font-black uppercase tracking-widest italic bg-slate-950/30 rounded-[3rem] border border-dashed border-slate-800">
              Scanning horizon for elite {category} establishments... no signals found.
            </div>
          )
        )}
      </motion.div>
    </AnimatePresence>
  );
}
