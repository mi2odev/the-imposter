// Bundled, fully offline multilingual word bank.
//
// Categories are referenced by a stable KEY (e.g. 'animals') so the choice
// survives a language switch. Display names live in `catNames` and the words
// themselves in `bank[lang][key]`. Each language's list is independent — they
// don't need to line up index-for-index. Proper-noun lists (cities, countries,
// movies, football, anime, tv) are kept/transliterated rather than translated.

export const catList = [
  'animals', 'cities', 'foods', 'jobs', 'movies', 'sports', 'household', 'countries',
  'produce', 'drinks', 'vehicles', 'music', 'nature', 'tech', 'space', 'football', 'anime', 'tvshows',
];

// A pseudo-category the player can pick in setup: each round rolls a real one.
export const RANDOM_CATEGORY = 'random';

export const catNames = {
  animals: { en: 'Animals', fr: 'Animaux', ar: 'الحيوانات' },
  cities: { en: 'Cities', fr: 'Villes', ar: 'المدن' },
  foods: { en: 'Foods', fr: 'Plats', ar: 'الأطعمة' },
  jobs: { en: 'Jobs', fr: 'Métiers', ar: 'المهن' },
  movies: { en: 'Movies', fr: 'Films', ar: 'الأفلام' },
  sports: { en: 'Sports', fr: 'Sports', ar: 'الرياضات' },
  household: { en: 'Household', fr: 'Maison', ar: 'أدوات المنزل' },
  countries: { en: 'Countries', fr: 'Pays', ar: 'الدول' },
  produce: { en: 'Fruits & Veggies', fr: 'Fruits & Légumes', ar: 'الفواكه والخضار' },
  drinks: { en: 'Drinks', fr: 'Boissons', ar: 'المشروبات' },
  vehicles: { en: 'Vehicles', fr: 'Véhicules', ar: 'المركبات' },
  music: { en: 'Music', fr: 'Musique', ar: 'الموسيقى' },
  nature: { en: 'Nature', fr: 'Nature', ar: 'الطبيعة' },
  tech: { en: 'Technology', fr: 'Technologie', ar: 'التقنية' },
  space: { en: 'Space', fr: 'Espace', ar: 'الفضاء' },
  football: { en: 'Football', fr: 'Football', ar: 'كرة القدم' },
  anime: { en: 'Anime', fr: 'Anime', ar: 'أنمي' },
  tvshows: { en: 'TV Shows', fr: 'Séries TV', ar: 'المسلسلات' },
  [RANDOM_CATEGORY]: { en: 'Surprise Me', fr: 'Surprise', ar: 'مفاجأة' },
};

export const catColors = {
  animals: '#36C5F0',
  cities: '#9B6BFF',
  foods: '#FF8A3D',
  jobs: '#2DD4BF',
  movies: '#F06595',
  sports: '#FFC93C',
  household: '#7C9CFF',
  countries: '#4ECDC4',
  produce: '#FF6B6B',
  drinks: '#FFA94D',
  vehicles: '#5C7CFA',
  music: '#A78BFA',
  nature: '#63E6BE',
  tech: '#74C0FC',
  space: '#B197FC',
  football: '#51CF66',
  anime: '#FF7AB6',
  tvshows: '#FFD43B',
  [RANDOM_CATEGORY]: '#F783AC',
};

export const DEFAULT_CAT_COLOR = '#9B6BFF';

export const bank = {
  en: {
    animals: ['Elephant', 'Penguin', 'Kangaroo', 'Dolphin', 'Tiger', 'Octopus', 'Giraffe', 'Owl', 'Shark', 'Panda', 'Koala', 'Cheetah', 'Wolf', 'Rhino', 'Flamingo', 'Crocodile', 'Camel', 'Squirrel', 'Lion', 'Zebra', 'Gorilla', 'Eagle', 'Bear', 'Fox'],
    cities: ['Paris', 'Tokyo', 'Cairo', 'New York', 'Rome', 'Dubai', 'London', 'Istanbul', 'Sydney', 'Berlin', 'Moscow', 'Bangkok', 'Toronto', 'Athens', 'Madrid', 'Seoul', 'Venice', 'Mumbai', 'Beijing', 'Singapore', 'Amsterdam', 'Barcelona', 'Dublin', 'Rio'],
    foods: ['Pizza', 'Sushi', 'Burger', 'Tacos', 'Pasta', 'Ramen', 'Falafel', 'Croissant', 'Pancakes', 'Dumplings', 'Curry', 'Lasagna', 'Waffles', 'Burrito', 'Donut', 'Omelette', 'Spaghetti', 'Sandwich', 'Steak', 'Kebab', 'Soup', 'Salad', 'Fries', 'Popcorn'],
    jobs: ['Doctor', 'Teacher', 'Pilot', 'Chef', 'Firefighter', 'Astronaut', 'Plumber', 'Lawyer', 'Farmer', 'Nurse', 'Electrician', 'Barber', 'Dentist', 'Journalist', 'Carpenter', 'Scientist', 'Photographer', 'Mechanic', 'Architect', 'Painter', 'Soldier', 'Actor', 'Singer', 'Baker'],
    movies: ['Titanic', 'Avatar', 'Frozen', 'Jaws', 'Inception', 'Gladiator', 'Shrek', 'Rocky', 'Aladdin', 'Joker', 'Matrix', 'Coco', 'Cars', 'Moana', 'Encanto', 'Avengers', 'Interstellar', 'Parasite', 'Alien', 'Terminator', 'Mulan', 'Tangled', 'Ratatouille', 'Up'],
    sports: ['Soccer', 'Tennis', 'Basketball', 'Boxing', 'Golf', 'Cricket', 'Hockey', 'Surfing', 'Skiing', 'Rugby', 'Baseball', 'Volleyball', 'Cycling', 'Bowling', 'Karate', 'Archery', 'Swimming', 'Fencing', 'Badminton', 'Wrestling', 'Judo', 'Climbing', 'Diving', 'Gymnastics'],
    household: ['Toaster', 'Pillow', 'Mirror', 'Blender', 'Lamp', 'Broom', 'Kettle', 'Vacuum', 'Umbrella', 'Candle', 'Clock', 'Scissors', 'Sponge', 'Ladder', 'Bucket', 'Toothbrush', 'Spatula', 'Hanger', 'Remote', 'Fridge', 'Microwave', 'Iron', 'Fan', 'Blanket'],
    countries: ['Japan', 'Brazil', 'Canada', 'Egypt', 'France', 'India', 'Italy', 'Kenya', 'Mexico', 'Norway', 'Spain', 'Sweden', 'Turkey', 'Greece', 'Iceland', 'Ireland', 'Morocco', 'Thailand', 'Germany', 'Portugal', 'Argentina', 'Australia', 'China', 'Russia'],
    produce: ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple', 'Strawberry', 'Watermelon', 'Grape', 'Cherry', 'Peach', 'Lemon', 'Coconut', 'Avocado', 'Carrot', 'Potato', 'Tomato', 'Cucumber', 'Broccoli', 'Onion', 'Garlic', 'Pepper', 'Pumpkin', 'Mushroom', 'Corn'],
    drinks: ['Coffee', 'Tea', 'Lemonade', 'Smoothie', 'Milkshake', 'Cola', 'Juice', 'Water', 'Espresso', 'Cappuccino', 'Latte', 'Soda', 'Cider', 'Cocktail', 'Wine', 'Beer', 'Whiskey', 'Milk', 'Hot Chocolate', 'Iced Tea', 'Mojito', 'Champagne', 'Punch', 'Matcha'],
    vehicles: ['Car', 'Bicycle', 'Motorcycle', 'Bus', 'Truck', 'Train', 'Airplane', 'Helicopter', 'Boat', 'Submarine', 'Scooter', 'Skateboard', 'Tractor', 'Ambulance', 'Taxi', 'Ferry', 'Yacht', 'Canoe', 'Jet', 'Rocket', 'Tank', 'Van', 'Tram', 'Jeep'],
    music: ['Guitar', 'Piano', 'Violin', 'Drums', 'Flute', 'Trumpet', 'Saxophone', 'Cello', 'Harp', 'Clarinet', 'Trombone', 'Accordion', 'Banjo', 'Ukulele', 'Tuba', 'Harmonica', 'Tambourine', 'Xylophone', 'Keyboard', 'Microphone', 'Maracas', 'Cymbal', 'Organ', 'Bagpipes'],
    nature: ['Mountain', 'River', 'Ocean', 'Forest', 'Desert', 'Volcano', 'Waterfall', 'Glacier', 'Canyon', 'Island', 'Beach', 'Cave', 'Valley', 'Lake', 'Rainbow', 'Lightning', 'Tornado', 'Hurricane', 'Earthquake', 'Sunset', 'Cliff', 'Jungle', 'Iceberg', 'Storm'],
    tech: ['Laptop', 'Smartphone', 'Tablet', 'Camera', 'Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Printer', 'Router', 'Speaker', 'Webcam', 'Charger', 'Drone', 'Robot', 'Console', 'Controller', 'Smartwatch', 'Television', 'Projector', 'Scanner', 'Battery', 'Satellite', 'Telescope'],
    space: ['Sun', 'Moon', 'Mars', 'Jupiter', 'Saturn', 'Venus', 'Mercury', 'Neptune', 'Uranus', 'Pluto', 'Earth', 'Comet', 'Asteroid', 'Meteor', 'Galaxy', 'Nebula', 'Star', 'Astronaut', 'Rocket', 'Satellite', 'Telescope', 'Eclipse', 'Crater', 'Gravity'],
    football: ['Messi', 'Ronaldo', 'Neymar', 'Mbappé', 'Benzema', 'Modrić', 'Salah', 'Haaland', 'De Bruyne', 'Lewandowski', 'Kane', 'Suárez', 'Bale', 'Ramos', 'Iniesta', 'Xavi', 'Zidane', 'Ronaldinho', 'Maradona', 'Pelé', 'Beckham', 'Pirlo', 'Drogba', 'Henry'],
    anime: ['Naruto', 'One Piece', 'Bleach', 'Dragon Ball', 'Death Note', 'Attack on Titan', 'Demon Slayer', 'My Hero Academia', 'Fullmetal Alchemist', 'Pokémon', 'Sailor Moon', 'One Punch Man', 'Tokyo Ghoul', 'Hunter x Hunter', 'Jujutsu Kaisen', 'Spy x Family', 'Sword Art Online', 'Cowboy Bebop', 'Fairy Tail', 'Black Clover', 'Haikyuu', 'Chainsaw Man', 'Doraemon', 'Inuyasha'],
    tvshows: ['Friends', 'Breaking Bad', 'Game of Thrones', 'The Office', 'Stranger Things', 'The Simpsons', 'Sherlock', 'Lost', 'Dexter', 'Vikings', 'Westworld', 'Narcos', 'The Witcher', 'Peaky Blinders', 'Money Heist', 'Dark', 'Prison Break', 'Suits', 'House', 'Seinfeld', 'Fargo', 'Chernobyl', 'Mr Robot', 'The Crown'],
  },

  fr: {
    animals: ['Éléphant', 'Pingouin', 'Kangourou', 'Dauphin', 'Tigre', 'Pieuvre', 'Girafe', 'Hibou', 'Requin', 'Panda', 'Koala', 'Guépard', 'Loup', 'Rhinocéros', 'Flamant', 'Crocodile', 'Chameau', 'Écureuil', 'Lion', 'Zèbre', 'Gorille', 'Aigle', 'Ours', 'Renard'],
    cities: ['Paris', 'Tokyo', 'Le Caire', 'New York', 'Rome', 'Dubaï', 'Londres', 'Istanbul', 'Sydney', 'Berlin', 'Moscou', 'Bangkok', 'Toronto', 'Athènes', 'Madrid', 'Séoul', 'Venise', 'Bombay', 'Pékin', 'Singapour', 'Amsterdam', 'Barcelone', 'Dublin', 'Rio'],
    foods: ['Pizza', 'Sushi', 'Burger', 'Tacos', 'Pâtes', 'Ramen', 'Falafel', 'Croissant', 'Crêpes', 'Raviolis', 'Curry', 'Lasagnes', 'Gaufres', 'Burrito', 'Beignet', 'Omelette', 'Spaghetti', 'Sandwich', 'Steak', 'Kebab', 'Soupe', 'Salade', 'Frites', 'Popcorn'],
    jobs: ['Médecin', 'Professeur', 'Pilote', 'Chef', 'Pompier', 'Astronaute', 'Plombier', 'Avocat', 'Fermier', 'Infirmier', 'Électricien', 'Coiffeur', 'Dentiste', 'Journaliste', 'Charpentier', 'Scientifique', 'Photographe', 'Mécanicien', 'Architecte', 'Peintre', 'Soldat', 'Acteur', 'Chanteur', 'Boulanger'],
    movies: ['Titanic', 'Avatar', 'La Reine des Neiges', 'Les Dents de la Mer', 'Inception', 'Gladiator', 'Shrek', 'Rocky', 'Aladdin', 'Joker', 'Matrix', 'Coco', 'Cars', 'Vaiana', 'Encanto', 'Avengers', 'Interstellar', 'Parasite', 'Alien', 'Terminator', 'Mulan', 'Raiponce', 'Ratatouille', 'Là-haut'],
    sports: ['Football', 'Tennis', 'Basket', 'Boxe', 'Golf', 'Cricket', 'Hockey', 'Surf', 'Ski', 'Rugby', 'Baseball', 'Volley', 'Cyclisme', 'Bowling', 'Karaté', "Tir à l'arc", 'Natation', 'Escrime', 'Badminton', 'Lutte', 'Judo', 'Escalade', 'Plongée', 'Gymnastique'],
    household: ['Grille-pain', 'Oreiller', 'Miroir', 'Mixeur', 'Lampe', 'Balai', 'Bouilloire', 'Aspirateur', 'Parapluie', 'Bougie', 'Horloge', 'Ciseaux', 'Éponge', 'Échelle', 'Seau', 'Brosse à dents', 'Spatule', 'Cintre', 'Télécommande', 'Frigo', 'Micro-ondes', 'Fer à repasser', 'Ventilateur', 'Couverture'],
    countries: ['Japon', 'Brésil', 'Canada', 'Égypte', 'France', 'Inde', 'Italie', 'Kenya', 'Mexique', 'Norvège', 'Espagne', 'Suède', 'Turquie', 'Grèce', 'Islande', 'Irlande', 'Maroc', 'Thaïlande', 'Allemagne', 'Portugal', 'Argentine', 'Australie', 'Chine', 'Russie'],
    produce: ['Pomme', 'Banane', 'Orange', 'Mangue', 'Ananas', 'Fraise', 'Pastèque', 'Raisin', 'Cerise', 'Pêche', 'Citron', 'Noix de coco', 'Avocat', 'Carotte', 'Pomme de terre', 'Tomate', 'Concombre', 'Brocoli', 'Oignon', 'Ail', 'Poivron', 'Citrouille', 'Champignon', 'Maïs'],
    drinks: ['Café', 'Thé', 'Limonade', 'Smoothie', 'Milkshake', 'Cola', 'Jus', 'Eau', 'Espresso', 'Cappuccino', 'Latte', 'Soda', 'Cidre', 'Cocktail', 'Vin', 'Bière', 'Whisky', 'Lait', 'Chocolat chaud', 'Thé glacé', 'Mojito', 'Champagne', 'Punch', 'Matcha'],
    vehicles: ['Voiture', 'Vélo', 'Moto', 'Bus', 'Camion', 'Train', 'Avion', 'Hélicoptère', 'Bateau', 'Sous-marin', 'Trottinette', 'Skateboard', 'Tracteur', 'Ambulance', 'Taxi', 'Ferry', 'Yacht', 'Canoë', 'Jet', 'Fusée', 'Tank', 'Camionnette', 'Tramway', 'Jeep'],
    music: ['Guitare', 'Piano', 'Violon', 'Batterie', 'Flûte', 'Trompette', 'Saxophone', 'Violoncelle', 'Harpe', 'Clarinette', 'Trombone', 'Accordéon', 'Banjo', 'Ukulélé', 'Tuba', 'Harmonica', 'Tambourin', 'Xylophone', 'Clavier', 'Microphone', 'Maracas', 'Cymbale', 'Orgue', 'Cornemuse'],
    nature: ['Montagne', 'Rivière', 'Océan', 'Forêt', 'Désert', 'Volcan', 'Cascade', 'Glacier', 'Canyon', 'Île', 'Plage', 'Grotte', 'Vallée', 'Lac', 'Arc-en-ciel', 'Éclair', 'Tornade', 'Ouragan', 'Tremblement de terre', 'Coucher de soleil', 'Falaise', 'Jungle', 'Iceberg', 'Tempête'],
    tech: ['Ordinateur portable', 'Smartphone', 'Tablette', 'Caméra', 'Casque', 'Clavier', 'Souris', 'Écran', 'Imprimante', 'Routeur', 'Haut-parleur', 'Webcam', 'Chargeur', 'Drone', 'Robot', 'Console', 'Manette', 'Montre connectée', 'Télévision', 'Projecteur', 'Scanner', 'Batterie', 'Satellite', 'Télescope'],
    space: ['Soleil', 'Lune', 'Mars', 'Jupiter', 'Saturne', 'Vénus', 'Mercure', 'Neptune', 'Uranus', 'Pluton', 'Terre', 'Comète', 'Astéroïde', 'Météore', 'Galaxie', 'Nébuleuse', 'Étoile', 'Astronaute', 'Fusée', 'Satellite', 'Télescope', 'Éclipse', 'Cratère', 'Gravité'],
    football: ['Messi', 'Ronaldo', 'Neymar', 'Mbappé', 'Benzema', 'Modrić', 'Salah', 'Haaland', 'De Bruyne', 'Lewandowski', 'Kane', 'Suárez', 'Bale', 'Ramos', 'Iniesta', 'Xavi', 'Zidane', 'Ronaldinho', 'Maradona', 'Pelé', 'Beckham', 'Pirlo', 'Drogba', 'Henry'],
    anime: ['Naruto', 'One Piece', 'Bleach', 'Dragon Ball', 'Death Note', "L'Attaque des Titans", 'Demon Slayer', 'My Hero Academia', 'Fullmetal Alchemist', 'Pokémon', 'Sailor Moon', 'One Punch Man', 'Tokyo Ghoul', 'Hunter x Hunter', 'Jujutsu Kaisen', 'Spy x Family', 'Sword Art Online', 'Cowboy Bebop', 'Fairy Tail', 'Black Clover', 'Haikyuu', 'Chainsaw Man', 'Doraemon', 'Inuyasha'],
    tvshows: ['Friends', 'Breaking Bad', 'Game of Thrones', 'The Office', 'Stranger Things', 'Les Simpson', 'Sherlock', 'Lost', 'Dexter', 'Vikings', 'Westworld', 'Narcos', 'The Witcher', 'Peaky Blinders', 'La Casa de Papel', 'Dark', 'Prison Break', 'Suits', 'Dr House', 'Seinfeld', 'Fargo', 'Chernobyl', 'Mr Robot', 'The Crown'],
  },

  ar: {
    animals: ['فيل', 'بطريق', 'كنغر', 'دلفين', 'نمر', 'أخطبوط', 'زرافة', 'بومة', 'قرش', 'باندا', 'كوالا', 'فهد', 'ذئب', 'وحيد القرن', 'فلامنغو', 'تمساح', 'جمل', 'سنجاب', 'أسد', 'حمار وحشي', 'غوريلا', 'نسر', 'دب', 'ثعلب'],
    cities: ['باريس', 'طوكيو', 'القاهرة', 'نيويورك', 'روما', 'دبي', 'لندن', 'إسطنبول', 'سيدني', 'برلين', 'موسكو', 'بانكوك', 'تورنتو', 'أثينا', 'مدريد', 'سيول', 'البندقية', 'مومباي', 'بكين', 'سنغافورة', 'أمستردام', 'برشلونة', 'دبلن', 'ريو'],
    foods: ['بيتزا', 'سوشي', 'برغر', 'تاكو', 'معكرونة', 'رامن', 'فلافل', 'كرواسون', 'فطائر', 'دامبلينغ', 'كاري', 'لازانيا', 'وافل', 'بوريتو', 'دونات', 'أومليت', 'سباغيتي', 'ساندويتش', 'ستيك', 'كباب', 'شوربة', 'سلطة', 'بطاطس مقلية', 'فشار'],
    jobs: ['طبيب', 'معلم', 'طيار', 'طاهٍ', 'رجل إطفاء', 'رائد فضاء', 'سباك', 'محامٍ', 'مزارع', 'ممرض', 'كهربائي', 'حلاق', 'طبيب أسنان', 'صحفي', 'نجار', 'عالم', 'مصور', 'ميكانيكي', 'مهندس معماري', 'رسام', 'جندي', 'ممثل', 'مغني', 'خباز'],
    movies: ['تايتنك', 'أفاتار', 'فروزن', 'الفك المفترس', 'إنسيبشن', 'المجالد', 'شريك', 'روكي', 'علاء الدين', 'جوكر', 'ماتريكس', 'كوكو', 'سيارات', 'موانا', 'إنكانتو', 'المنتقمون', 'بين النجوم', 'باراسايت', 'كائن فضائي', 'المدمر', 'مولان', 'تانغلد', 'راتاتوي', 'فوق'],
    sports: ['كرة القدم', 'تنس', 'كرة السلة', 'ملاكمة', 'غولف', 'كريكيت', 'هوكي', 'ركوب الأمواج', 'تزلج', 'رغبي', 'بيسبول', 'كرة الطائرة', 'ركوب الدراجات', 'بولينغ', 'كاراتيه', 'رماية', 'سباحة', 'مبارزة', 'ريشة طائرة', 'مصارعة', 'جودو', 'تسلق', 'غوص', 'جمباز'],
    household: ['محمصة', 'وسادة', 'مرآة', 'خلاط', 'مصباح', 'مكنسة', 'غلاية', 'مكنسة كهربائية', 'مظلة', 'شمعة', 'ساعة', 'مقص', 'إسفنجة', 'سلم', 'دلو', 'فرشاة أسنان', 'ملعقة', 'علاقة ملابس', 'جهاز تحكم', 'ثلاجة', 'ميكروويف', 'مكواة', 'مروحة', 'بطانية'],
    countries: ['اليابان', 'البرازيل', 'كندا', 'مصر', 'فرنسا', 'الهند', 'إيطاليا', 'كينيا', 'المكسيك', 'النرويج', 'إسبانيا', 'السويد', 'تركيا', 'اليونان', 'أيسلندا', 'أيرلندا', 'المغرب', 'تايلاند', 'ألمانيا', 'البرتغال', 'الأرجنتين', 'أستراليا', 'الصين', 'روسيا'],
    produce: ['تفاح', 'موز', 'برتقال', 'مانجو', 'أناناس', 'فراولة', 'بطيخ', 'عنب', 'كرز', 'خوخ', 'ليمون', 'جوز الهند', 'أفوكادو', 'جزر', 'بطاطس', 'طماطم', 'خيار', 'بروكلي', 'بصل', 'ثوم', 'فلفل', 'يقطين', 'فطر', 'ذرة'],
    drinks: ['قهوة', 'شاي', 'عصير ليمون', 'سموذي', 'ميلك شيك', 'كولا', 'عصير', 'ماء', 'إسبريسو', 'كابتشينو', 'لاتيه', 'صودا', 'عصير تفاح', 'كوكتيل', 'نبيذ', 'بيرة', 'ويسكي', 'حليب', 'شوكولاتة ساخنة', 'شاي مثلج', 'موهيتو', 'شمبانيا', 'بانش', 'ماتشا'],
    vehicles: ['سيارة', 'دراجة', 'دراجة نارية', 'حافلة', 'شاحنة', 'قطار', 'طائرة', 'مروحية', 'قارب', 'غواصة', 'سكوتر', 'لوح تزلج', 'جرار', 'سيارة إسعاف', 'تاكسي', 'عبّارة', 'يخت', 'زورق', 'طائرة نفاثة', 'صاروخ', 'دبابة', 'شاحنة صغيرة', 'ترام', 'جيب'],
    music: ['غيتار', 'بيانو', 'كمان', 'طبول', 'ناي', 'بوق', 'ساكسفون', 'تشيلو', 'قيثارة', 'كلارينيت', 'ترومبون', 'أكورديون', 'بانجو', 'يوكوليلي', 'توبا', 'هارمونيكا', 'دف', 'إكسيليفون', 'لوحة مفاتيح', 'ميكروفون', 'ماراكاس', 'صنج', 'أرغن', 'مزمار القربة'],
    nature: ['جبل', 'نهر', 'محيط', 'غابة', 'صحراء', 'بركان', 'شلال', 'نهر جليدي', 'وادٍ سحيق', 'جزيرة', 'شاطئ', 'كهف', 'وادٍ', 'بحيرة', 'قوس قزح', 'برق', 'إعصار', 'إعصار مداري', 'زلزال', 'غروب الشمس', 'منحدر', 'أدغال', 'جبل جليدي', 'عاصفة'],
    tech: ['حاسوب محمول', 'هاتف ذكي', 'جهاز لوحي', 'كاميرا', 'سماعات', 'لوحة مفاتيح', 'فأرة', 'شاشة', 'طابعة', 'راوتر', 'مكبر صوت', 'كاميرا ويب', 'شاحن', 'طائرة بدون طيار', 'روبوت', 'كونسول', 'ذراع تحكم', 'ساعة ذكية', 'تلفاز', 'بروجكتر', 'ماسح ضوئي', 'بطارية', 'قمر صناعي', 'تلسكوب'],
    space: ['الشمس', 'القمر', 'المريخ', 'المشتري', 'زحل', 'الزهرة', 'عطارد', 'نبتون', 'أورانوس', 'بلوتو', 'الأرض', 'مذنب', 'كويكب', 'نيزك', 'مجرة', 'سديم', 'نجم', 'رائد فضاء', 'صاروخ', 'قمر صناعي', 'تلسكوب', 'كسوف', 'فوهة بركان', 'جاذبية'],
    football: ['ميسي', 'رونالدو', 'نيمار', 'مبابي', 'بنزيما', 'مودريتش', 'صلاح', 'هالاند', 'دي بروين', 'ليفاندوفسكي', 'كين', 'سواريز', 'بيل', 'راموس', 'إنييستا', 'تشافي', 'زيدان', 'رونالدينيو', 'مارادونا', 'بيليه', 'بيكهام', 'بيرلو', 'دروغبا', 'هنري'],
    anime: ['ناروتو', 'ون بيس', 'بليتش', 'دراغون بول', 'مذكرة الموت', 'هجوم العمالقة', 'قاتل الشياطين', 'بطل الأكاديمية', 'الخيميائي المعدني', 'بوكيمون', 'سيلر مون', 'ون بانش مان', 'طوكيو غول', 'هنتر × هنتر', 'جوجوتسو كايسن', 'سباي × فاميلي', 'سورد آرت أونلاين', 'كاوبوي بيبوب', 'فيري تيل', 'بلاك كلوفر', 'هايكيو', 'تشينسو مان', 'دورايمون', 'إنوياشا'],
    tvshows: ['فريندز', 'بريكنغ باد', 'صراع العروش', 'ذا أوفيس', 'أشياء غريبة', 'عائلة سيمبسون', 'شيرلوك', 'لوست', 'ديكستر', 'الفايكنج', 'ويستوورلد', 'ناركوس', 'الساحر', 'بيكي بلايندرز', 'البيت الورقي', 'دارك', 'الهروب من السجن', 'سوتس', 'هاوس', 'ساينفيلد', 'فارغو', 'تشيرنوبيل', 'مستر روبوت', 'التاج'],
  },
};

export const playerColors = ['#FF6B6B', '#FFC93C', '#4ECDC4', '#A78BFA', '#FF9F45', '#2DD4BF', '#F06595', '#5C7CFA', '#63E6BE', '#FFA94D'];
