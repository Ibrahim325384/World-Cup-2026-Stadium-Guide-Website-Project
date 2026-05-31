export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: 'USA' | 'Mexico' | 'Canada';
  capacity: string;
  lat: number;
  lng: number;
  description: string;
  image: string;
  secondaryImage: string;
  opened: string;
  tenants: string;
  sports: string;
  funFacts: string[];
}

export const STADIUMS: Stadium[] = [
  {
    id: 'atlanta',
    name: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    country: 'USA',
    capacity: '71,000',
    lat: 33.7553,
    lng: -84.4008,
    description: 'A world-class sports and entertainment venue in the heart of Atlanta. Known for its retractable roof and giant video board.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2017',
    tenants: 'Atlanta Falcons (NFL), Atlanta United FC (MLS)',
    sports: 'American Football, Soccer, Concerts',
    funFacts: [
      'Features a pinwheel-like retractable roof that opens and closes in approximately 8 minutes.',
      'Boasts the "Halo Board" – a 360-degree, 58-foot-tall video screen that is the largest in professional sports.',
      'First professional sports stadium in the US to achieve LEED Platinum sustainability certification.'
    ]
  },
  {
    id: 'boston',
    name: 'Gillette Stadium',
    city: 'Foxborough',
    country: 'USA',
    capacity: '65,878',
    lat: 42.0909,
    lng: -71.2643,
    description: 'Home of the New England Patriots and Revolution, located between Boston and Providence.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2002',
    tenants: 'New England Patriots (NFL), New England Revolution (MLS)',
    sports: 'American Football, Soccer, Concerts',
    funFacts: [
      'Features a signature 22-story lighthouse towering over the north end zone with panoramic observation deck views.',
      'Renowned for its passionate crowd atmosphere during winter NFL postseason games in sub-zero temperatures.',
      'The entire construction was 100% privately financed by the ownership Group.'
    ]
  },
  {
    id: 'dallas',
    name: 'AT&T Stadium',
    city: 'Arlington',
    country: 'USA',
    capacity: '80,000',
    lat: 32.7473,
    lng: -97.0945,
    description: 'One of the most expensive and architecturally advanced stadiums in the world, featuring a massive screen.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2009',
    tenants: 'Dallas Cowboys (NFL), Cotton Bowl Classic (NCAA)',
    sports: 'American Football, Basketball, Soccer, Boxing, Concerts',
    funFacts: [
      'Affectionately nicknamed "Jerry World" after the legendary Cowboys owner Jerry Jones.',
      'Features a colossal center-hung HDTV video board measuring 175 feet long by 72 feet high, suspended above the mid-court.',
      'Its structure is supported by two giant arches that span 1,225 feet, making them some of the longest single-span arches in the world.'
    ]
  },
  {
    id: 'guadalajara',
    name: 'Estadio Akron',
    city: 'Guadalajara',
    country: 'Mexico',
    capacity: '48,071',
    lat: 20.6817,
    lng: -103.4628,
    description: 'A modern masterpiece known for its "volcano" shape design and natural surroundings.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2010',
    tenants: 'C.D. Guadalajara (Liga MX)',
    sports: 'Soccer, Concerts',
    funFacts: [
      'Designed to resemble a grass-covered volcano with an elegant white roof floating above like a cloud.',
      'Constructed with an focus on eco-harmony, complete with integrated rainwater harvesting systems.',
      'Staged the spectacular opening ceremony of the unforgettable Guadalajaran 2011 Pan American Games.'
    ]
  },
  {
    id: 'houston',
    name: 'NRG Stadium',
    city: 'Houston',
    country: 'USA',
    capacity: '72,220',
    lat: 29.6847,
    lng: -95.4107,
    description: 'First NFL stadium with a retractable roof, host to major international soccer matches.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2002',
    tenants: 'Houston Texans (NFL), Houston Livestock Show and Rodeo',
    sports: 'American Football, Soccer, Rodeo, Concerts',
    funFacts: [
      'Made sports history as the very first NFL stadium built with a fully retractable roof system.',
      'Transforms annually into a dirt-covered arena to host the Houston Livestock Show & Rodeo—the largest in the world.',
      'Features a colossal playing surface that can be configured as natural grass or synthetic turf via modular trays.'
    ]
  },
  {
    id: 'kansas-city',
    name: 'GEHA Field at Arrowhead Stadium',
    city: 'Kansas City',
    country: 'USA',
    capacity: '76,416',
    lat: 39.0489,
    lng: -94.4839,
    description: 'Famous for its passionate fans and being one of the loudest stadiums in the world.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '1972',
    tenants: 'Kansas City Chiefs (NFL)',
    sports: 'American Football, Soccer, Concerts',
    funFacts: [
      'Holds the officiated Guinness World Record for the loudest outdoor sports arena, peaking at an earth-shattering 142.2 decibels.',
      'Regarded globally as the ultimate gold standard of pre-game tailgating, featuring legendary Midwestern barbecue.',
      'Retains its classic, uninterrupted double-deck bowl design, which has been preserved beautifully since its 1972 opening.'
    ]
  },
  {
    id: 'los-angeles',
    name: 'SoFi Stadium',
    city: 'Inglewood',
    country: 'USA',
    capacity: '70,240',
    lat: 33.9535,
    lng: -118.3391,
    description: 'A revolutionary architectural wonder featuring an indoor-outdoor design and high-tech displays.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2020',
    tenants: 'Los Angeles Rams (NFL), Los Angeles Chargers (NFL)',
    sports: 'American Football, Soccer, Concerts',
    funFacts: [
      'Widely regarded as the most expensive venue in sports history, costing over $5 billion to realize.',
      'Suspends the "Infinity Screen by Samsung" – an oval-shaped, double-sided 4K video board weighing well over 2.2 million pounds.',
      'Features a unique open-air, translucent canopy that allows players and fans to enjoy southern California breezes with full cover protection.'
    ]
  },
  {
    id: 'mexico-city',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    capacity: '87,523',
    lat: 19.3029,
    lng: -99.1505,
    description: 'One of the most iconic soccer temples in history, host to two previous World Cup finals.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '1966',
    tenants: 'Club América (Liga MX), Cruz Azul (Liga MX), Mexico National Team',
    sports: 'Soccer, American Football, Concerts',
    funFacts: [
      'The legendary site where Diego Maradona scored both the "Hand of God" and the "Goal of the Century" in 1986.',
      'The first stadium in history scheduled to host matches in three separate FIFA World Cups (1970, 1986, and 2026).',
      'Sits at a daunting altitude of 7,350 feet (2,240m) above sea level, presenting a legendary challenge for visiting squads.'
    ]
  },
  {
    id: 'miami',
    name: 'Hard Rock Stadium',
    city: 'Miami Gardens',
    country: 'USA',
    capacity: '64,767',
    lat: 25.9580,
    lng: -80.2389,
    description: 'A multi-purpose stadium that has undergone major renovations to become a premier global destination.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '1987',
    tenants: 'Miami Dolphins (NFL), Miami Hurricanes (NCAA), Formula 1 Miami GP',
    sports: 'American Football, Soccer, Formula 1 Racing, Tennis, Concerts',
    funFacts: [
      'Completely transformed in 2015 by a massive $500M renovation, adding a stunning open-air roof protecting 90% of seats from tropical downpours.',
      'Hosts the Formula 1 Miami Grand Prix on a custom-designed track built directly within the stadium parking grounds.',
      'A legendary big-game host, having welcomed six NFL Super Bowl matches and two MLB World Series matchups.'
    ]
  },
  {
    id: 'monterrey',
    name: 'Estadio BBVA',
    city: 'Guadalupe',
    country: 'Mexico',
    capacity: '53,500',
    lat: 25.6698,
    lng: -100.2443,
    description: 'Known for its spectacular view of the Cerro de la Silla mountain and modern amenities.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2015',
    tenants: 'C.F. Monterrey (Liga MX)',
    sports: 'Soccer, Concerts',
    funFacts: [
      'Nicknamed "El Gigante de Acero" (The Steel Giant) owing to its beautifully fluid, metallic, organic form.',
      'Boasts one of the most picturesque natural frames in world sports – looking directly onto the Cerro de la Silla mountain side.',
      'Engineered to meet the highest international eco-standards, boasting a silver-tier LEED certification.'
    ]
  },
  {
    id: 'new-york',
    name: 'MetLife Stadium',
    city: 'East Rutherford',
    country: 'USA',
    capacity: '82,500',
    lat: 40.8128,
    lng: -74.0742,
    description: 'Located in the New York metropolitan area, one of the largest and most used stadiums in the world.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2010',
    tenants: 'New York Giants (NFL), New York Jets (NFL)',
    sports: 'American Football, Soccer, Concerts',
    funFacts: [
      'The chosen destination to host the grand FIFA World Cup 2026™ Final match on July 19, 2026.',
      'Designed with clever neutral louver boards that light up with green (Jets) or blue (Giants) depending on the active home squad.',
      'One of the only NFL stadiums shared fully by two primary NFL franchises, hosting back-to-back matches on autumn weekends.'
    ]
  },
  {
    id: 'philadelphia',
    name: 'Lincoln Financial Field',
    city: 'Philadelphia',
    country: 'USA',
    capacity: '69,796',
    lat: 39.9008,
    lng: -75.1675,
    description: 'A premier sporting venue with a commitment to environmental sustainability.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2003',
    tenants: 'Philadelphia Eagles (NFL), Temple Owls (NCAA)',
    sports: 'American Football, Soccer, Lacrosse, Concerts',
    funFacts: [
      'Affectionately dubbed "The Linc" by its die-hard, legendary home supporters.',
      'Generates 100% of its electricity on-site via custom wind turbines and over 11,000 integrated solar panels in the parking arrays.',
      'Sits as the physical core of Philadelphia\'s sports complex district alongside the Wells Fargo Center and Citizens Bank Park.'
    ]
  },
  {
    id: 'san-francisco',
    name: "Levi's Stadium",
    city: 'Santa Clara',
    country: 'USA',
    capacity: '68,500',
    lat: 37.4033,
    lng: -121.9694,
    description: 'One of the most high-tech and environmentally friendly sports venues in the world.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2014',
    tenants: 'San Francisco 49ers (NFL)',
    sports: 'American Football, Soccer, Concerts',
    funFacts: [
      'Optimized directly for tech with ultra-high-definition wireless connectivity throughout, reflecting its placement in Silicon Valley.',
      'Features a massive 27,000-square-foot vegetation-rich "Green Roof" on top of the majestic suite tower.',
      'The first US professional stadium to open with both LEED Gold certifications for operations and clean construction.'
    ]
  },
  {
    id: 'seattle',
    name: 'Lumen Field',
    city: 'Seattle',
    country: 'USA',
    capacity: '69,000',
    lat: 47.5952,
    lng: -122.3316,
    description: 'A multi-purpose stadium with unique views of the Seattle skyline and Elliott Bay.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2002',
    tenants: 'Seattle Seahawks (NFL), Seattle Sounders FC (MLS), Seattle Reign FC (NWSL)',
    sports: 'American Football, Soccer, Concerts',
    funFacts: [
      'Engineered specifically with high-backed curving vertical metal canopies that focus sound waves directly back onto the turf, making it incredibly loud.',
      'Welcomes fans with gorgeous sweeping westward vistas pointing directly to Puget Sound and the downtown Seattle high-rises.',
      'Features a legendary double-column structure called the "Hawk\'s Nest" which anchors the loud open north endzone.'
    ]
  },
  {
    id: 'toronto',
    name: 'BMO Field',
    city: 'Toronto',
    country: 'Canada',
    capacity: '45,000',
    lat: 43.6332,
    lng: -79.4186,
    description: "Canada's national soccer stadium, located in Exhibition Place.",
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '2007',
    tenants: 'Toronto FC (MLS), Toronto Argonauts (CFL), Team Canada Soccer',
    sports: 'Soccer, Canadian Football, Rugby',
    funFacts: [
      'Erected directly atop the hallowed grounds of the original Exhibition Stadium, a deeply valued park in Canadian hockey, baseball, and football history.',
      'Expanded with additional modular end-zone decks specifically to seat over 45,000 spectators for its FIFA World Cup 2026™ campaign.',
      'Sits directly within the scenic Exhibition Place grounds on the northern banks of beautiful Lake Ontario.'
    ]
  },
  {
    id: 'vancouver',
    name: 'BC Place',
    city: 'Vancouver',
    country: 'Canada',
    capacity: '54,500',
    lat: 49.2767,
    lng: -123.1119,
    description: 'A major sporting event venue in the heart of Vancouver with a modern retractable roof.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    secondaryImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    opened: '1983',
    tenants: 'Vancouver Whitecaps FC (MLS), BC Lions (CFL)',
    sports: 'Soccer, Canadian Football, Concerts',
    funFacts: [
      'Staged the unforgettable, historic grand opening and closing ceremonies of the Vancouver 2010 Winter Olympic Games.',
      'Underwent a complete structural overhaul in 2011, receiving the largest cable-supported retractable fabric roof in the entire world.',
      'Adorned by an exterior "Northern Lights" LED facade that can be fully animated with spectacular customized colors and themes.'
    ]
  }
];
