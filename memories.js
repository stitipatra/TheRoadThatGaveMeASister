const JOURNEY = {
  title: "The Road That Gave Me a Sister",
  startCenter: [18.5885, 73.9135],
  startZoom: 12,
  homeId: "smart-living-pg",
  carMemory: {
    title: "Memories From the Road",
    place: "Inside the car",
    story: "Some of the best parts of Pune happened between destinations.",
    quote: "Some memories belong to places. These belonged to the road.",
    photos: MEDIA["car"]?.photos ?? [],
    videos: MEDIA["car"]?.videos ?? [],
    voice: MEDIA["car"]?.voice ?? [],
  },
  dialogue: [
    "Arre chal, chalte hain.",
    "Abbe, left nahi... right le!!",
    "Dekh kar chala, tere paas license bhi nahi hai!!",
    "Oh please! Maine Moradabad ke highway pe chalai hai. Apne baap ko mat sikha.",
    "Stiti! Itna tez nahi... dheere chala scooty!",
  ],
  memories: [
    {
      id: "aeromall",
      order: 1,
      title: "Where the Pune chapter begins",
      place: "AeroMall, Pune Airport",
      coords: [18.577774, 73.90724],
      icon: "✈️",
      story:
        "Most people only come to the airport to say hello or goodbye. Somehow, we turned it into one of our favorite places to meet, wander around AeroMall, grab food, and waste hours doing absolutely nothing productive. I still can't forget the day you spilled your drink all over your dress. Back then we were dropping and picking up other people. In the end, you were the one who dropped me when I left Pune. If you ever land in Bangalore now, it'll be my turn to be waiting outside.",
      quote:
        "Some terminals connect cities. This one quietly connected two lives.",
      photos: MEDIA["aeromall"]?.photos ?? [],
      videos: MEDIA["aeromall"]?.videos ?? [],
      voice: MEDIA["aeromall"]?.voice ?? [],
    },
    {
      id: "apollo",
      order: 2,
      title: "The dramatically unnecessary hospital stop",
      place: "Apollo, Viman Nagar",
      coords: [18.564603010455283, 73.91391886100888],
      icon: "🏥",
      story:
        "Hospitals somehow became one of our recurring destinations. First came the vitamin injections, where your scream echoed through the entire hospital. I was standing three doors away near reception and could still hear you—trying very hard (and completely failing) not to laugh. Then came the broken leg, where things were a little more serious. The funniest part, though, was the doctor who was confidently ordering everyone around until I casually asked about the ACL and MCL because of my football injuries. He suddenly looked at me with a lot more respect and started explaining everything properly.",
      quote:
        "Some people collect café memories. We somehow collected hospital stories.",
      photos: MEDIA["apollo"]?.photos ?? [],
      videos: MEDIA["apollo"]?.videos ?? [],
      voice: MEDIA["apollo"]?.voice ?? [],
    },
    {
      id: "decathlon",
      order: 3,
      title: "A very serious sporting expedition",
      place: "Decathlon",
      coords: [18.576903755649422, 73.97038542616801],
      icon: "⚽",
      story:
        "Three people walked into Decathlon with the simple plan of buying a few things. Somehow that turned into an hour of complete chaos. We played football in the aisles, attempted hula hoops, played table tennis, balanced on medicine balls like little kids and probably tested half the store before finally remembering we had actually come shopping. I think a windcheater was the only productive thing we managed to buy.",
      quote: "Adults go shopping. We accidentally turned it into a playground.",
      photos: MEDIA["decathlon"]?.photos ?? [],
      videos: MEDIA["decathlon"]?.videos ?? [],
      voice: MEDIA["decathlon"]?.voice ?? [],
    },
    {
      id: "mafia-family",
      order: 4,

      title: "The Birthday Chapter 🎂",

      place: "The Mafia Family Kitchen & Bar",

      coords: [18.562529237811336, 73.92866255315586],

      icon: "🎂",

      story:
        "Some birthdays are remembered because of extravagant celebrations. This one is special because it was beautifully simple. Six of us gathered around one table, sharing food, laughter, terrible jokes and conversations that somehow made the hours disappear. Looking back, I don't remember every dish we ordered, but I remember exactly how it felt to be surrounded by people who made Pune feel like home.",

      quote:
        "Birthdays last a day. The people around the table become the memory.",

      photos: MEDIA["mafia-family"]?.photos ?? [],

      videos: MEDIA["mafia-family"]?.videos ?? [],

      voice: MEDIA["mafia-family"]?.voice ?? [],
    },
    {
      id: "phoenix",
      order: 5,
      title: "Where time and money both disappeared",
      place: "Phoenix Marketcity, Viman Nagar",
      coords: [18.5621, 73.9167],
      icon: "🛍️",
      story:
        "Phoenix was never just about shopping. We'd come for 'a quick visit' and somehow spend half the day there. There was Haldiram's, endless wandering, shopping bags we probably didn't need, and more conversations than actual purchases. Then came the movies—booking *Until Dawn* only to realize we'd accidentally picked the Hindi dubbed version, watching *Raid 2*, and turning even a horror movie into a comedy thanks to the two guys sitting nearby. Looking back, Phoenix wasn't a mall. It was our unofficial weekend headquarters.",
      quote: "Plans were optional. Good company wasn't.",
      photos: MEDIA["phoenix"]?.photos ?? [],
      videos: MEDIA["phoenix"]?.videos ?? [],
      voice: MEDIA["phoenix"]?.voice ?? [],
    },
    {
      id: "Sash",
      order: 6,
      title: "Good food, better company",
      place: "Sash Cocktail Bar & Kitchen",
      coords: [18.565479282648212, 73.91369728198859],
      icon: "🍹",
      story:
        "Valentine's Day gave us one more excuse to step out together. We ended up at Sash with good food, unhurried conversations, and an evening that somehow felt wonderfully simple. We watched the world around us, saw couples celebrating in their own ways, and quietly enjoyed being exactly where we were. It wasn't a grand plan, but it became one of those evenings that stayed with me.",
      quote:
        "The best company has a way of making every day feel worth celebrating.",
      photos: MEDIA["sash"]?.photos ?? [],
      videos: MEDIA["sash"]?.videos ?? [],
      voice: MEDIA["sash"]?.voice ?? [],
    },
    {
      id: "spice-factory",
      order: 7,
      title: "The spicy chapter",
      place: "Spice Factory",
      coords: [18.536785348977347, 73.9101530261518],
      icon: "🌶️",
      story:
        "Some places don't become special because of one unforgettable night—they become special because you keep returning. Spice Factory was that place for us. Weekend plans, birthday celebrations, random evenings, club nights before and after, and countless conversations somehow always brought us back here. Looking through the photos now, it's impossible to count how many memories started at these tables. And of course, your birthday wouldn't have been complete without you accidentally breaking a glass. Some might call it inauspicious. We just laughed and carried on celebrating.",
      quote: "Some places become traditions long before you realize they have.",
      photos: MEDIA["spice-factory"]?.photos ?? [],
      videos: MEDIA["spice-factory"]?.videos ?? [],
      voice: MEDIA["spice-factory"]?.voice ?? [],
    },
    {
      id: "pimlico",
      order: 8,

      title: "An evening well spent",

      place: "Pimlico",

      coords: [18.534512701137196, 73.89804233411992],

      icon: "🍽️",

      story:
        "Pimlico was one of those evenings where there wasn't any special occasion—we just wanted good food and even better company. The three of us ended up ordering far more than we probably should have: pasta, bread, pizza, and whatever else looked interesting on the menu. Then came the 'fancy' pizza covered with leaves and greens. While we thought it was surprisingly good, your reaction was priceless—you took one bite and confidently declared that a normal Domino's pizza was better. Safe to say, not every gourmet experiment is worth repeating.",

      quote:
        "The best meals aren't judged by the menu. They're remembered for the conversations around the table.",

      photos: MEDIA["pimlico"]?.photos ?? [],

      videos: MEDIA["pimlico"]?.videos ?? [],

      voice: MEDIA["pimlico"]?.voice ?? [],
    },
    {
      id: "iskcon",
      order: 9,
      title: "A quieter memory",
      place: "ISKCON Pune",
      coords: [18.524101896101627, 73.87996371774636],
      icon: "🛕",
      story:
        "Gudi Padwa brought the entire PG together for a visit to ISKCON. Everyone showed up in traditional clothes, making the day feel different from our usual outings. Watching you in a saree, attending the aarti together, taking countless group photos, and simply spending the festival with everyone made it one of those memories that felt peaceful from beginning to end. Sometimes the loudest memories come from laughter, and sometimes they come from moments of quiet gratitude.",
      quote:
        "Festivals are celebrated for a day. The people you celebrate them with stay in your heart much longer.",
      photos: MEDIA["iskcon"]?.photos ?? [],
      videos: MEDIA["iskcon"]?.videos ?? [],
      voice: MEDIA["iskcon"]?.voice ?? [],
    },
    {
      id: "chaturshringi",
      order: 10,
      title: "A little peace above the city",
      place: "Chaturshringi Temple",
      coords: [18.5389889, 73.8282222],
      icon: "🙏",
      story:
        "Not every outing needed a reason. One quiet weekend, the three of us decided to visit Chaturshringi Temple, offer our prayers, and simply spend the day together. There was no celebration, no itinerary, and nothing we had to hurry for. After darshan, we headed to a cozy restaurant in Viman Nagar, letting the conversations continue over a relaxed meal. Looking back, it was one of those peaceful days where nothing extraordinary happened, yet everything felt just right.",
      quote:
        "Some days leave no grand stories—only a quiet happiness that stays with you.",
      photos: MEDIA["chaturshringi"]?.photos ?? [],
      videos: MEDIA["chaturshringi"]?.videos ?? [],
      voice: MEDIA["chaturshringi"]?.voice ?? [],
    },
    {
      id: "khadakwasla",
      order: 11,
      title: "The road away from the noise",
      place: "Khadakwasla Dam",
      coords: [18.43737408793662, 73.77173024147595],
      icon: "🌊",
      story:
        "Some of the best plans started with, 'Let's just go for a drive.' The four of us headed to Khadakwasla with good music, no real schedule, and an entire evening ahead of us. We watched the sunset over the water, clicked far too many photos, and naturally couldn't leave without eating bhel, golgappe, and every other street snack that caught our attention. On the way back, we somehow ended up watching Jolly LLB 2 in the most questionable little theatre in Chandan Nagar. It probably wasn't Pune's finest cinema, but somehow that made the day even more memorable.",
      quote:
        "Some journeys are measured in kilometres. The best ones are measured in memories.",
      photos: MEDIA["khadakwasla"]?.photos ?? [],
      videos: MEDIA["khadakwasla"]?.videos ?? [],
      voice: MEDIA["khadakwasla"]?.voice ?? [],
    },
    {
      id: "ganesh-mandir",
      order: 12,
      title: "The familiar corner",
      place: "Ganesh Mandir lane",
      coords: [18.568010503669644, 73.91837746841104],
      icon: "🛕",
      story:
        "Some memories aren't tied to birthdays, restaurants, or road trips. They're built quietly, one ordinary evening at a time. Almost every day, the two of us would walk to the Ganesh Mandir, offer a quick prayer, grab chai or ice cream, and spend the rest of the evening simply walking and talking. There was never a rush to get anywhere. Somewhere between those walks, those conversations, and those familiar streets, we stopped being just friends. That's where I found a sister.",
      quote:
        "Some roads don't lead you somewhere. They slowly bring you closer to someone.",
      photos: MEDIA["ganesh-mandir"]?.photos ?? [],
      videos: MEDIA["ganesh-mandir"]?.videos ?? [],
      voice: MEDIA["ganesh-mandir"]?.voice ?? [],
    },
    {
      id: "bloopers",
      order: 13,

      title: "The Hall of Fame (and Shame)",

      place: "Somewhere in Pune",

      coords: [18.5458, 73.8926],

      icon: "😂",

      story:
        "Not every memory deserved its own stop on the map. Some were blurry photos, terrible selfies, accidental videos, uncontrollable laughter, and moments that made absolutely no sense outside our group. This is for all the forgotten chaos—the inside jokes, the failed poses, the random expressions, and every 'don't you dare save that' photo that somehow survived. They may not tell one story, but together they're some of my favourite memories.",

      quote: "Some evidence was simply too funny to delete.",

      photos: MEDIA["bloopers"]?.photos ?? [],

      videos: MEDIA["bloopers"]?.videos ?? [],

      voice: MEDIA["bloopers"]?.voice ?? [],
    },
    {
      id: "smart-living-pg",
      order: 14,
      title: "Home",
      place: "Smart Living PG, Viman Nagar",
      coords: [18.569990198275285, 73.91575338199137],
      icon: "🏠",
      isHome: true,
      story:
        "When I first met you, I honestly thought you were just the loud, funny person in the PG. I don't think your first impression of me was much better either. Neither of us knew that the random temple visits, late-night DSA sessions, badminton games, dinners, evening walks, endless office complaints, and countless conversations would slowly become our everyday life. There was never a single moment where you became my sister. It happened so gradually that neither of us noticed it. Somewhere between those ordinary days, home stopped being just a place to stay. It became the people waiting there. Even today, no matter which city we're in, one call is enough to make it feel like nothing has changed. This journey isn't about the places we visited. It's about the sister I found along the way.🧿",
      quote: "Home isn't where I lived. Home is where I found a sister.",
      photos: MEDIA["smart-living"]?.photos ?? [],
      videos: MEDIA["smart-living"]?.videos ?? [],
      voice: MEDIA["smart-living"]?.voice ?? [],
    },
  ],
  landmarks: [
    { name: "Shaniwar Wada", coords: [18.5195, 73.8553], icon: "🏰" },
    { name: "Aga Khan Palace", coords: [18.5524, 73.9015], icon: "🏛️" },
    { name: "Dagdusheth Ganpati", coords: [18.5164, 73.8561], icon: "🛕" },
    { name: "Pune Railway Station", coords: [18.5289, 73.8744], icon: "🚉" },
    { name: "Saras Baug", coords: [18.5011, 73.852], icon: "🌳" },
    { name: "Pataleshwar Caves", coords: [18.5268, 73.8494], icon: "🪨" },
    { name: "Pune University", coords: [18.5525, 73.8246], icon: "🎓" },
    { name: "Parvati Hill", coords: [18.4973, 73.8443], icon: "⛰️" },
    { name: "Koregaon Park", coords: [18.5362, 73.8939], icon: "🌿" },
    { name: "FC Road", coords: [18.5222, 73.8417], icon: "☕" },
    { name: "Bund Garden", coords: [18.5385, 73.8846], icon: "🌳" },
    { name: "Sinhagad Fort", coords: [18.3663, 73.7559], icon: "🏰" },
  ],
};
