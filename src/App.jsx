import { useState, useCallback, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "animals", name: "Animals", emoji: "🦁", color: "#FF6B35", bg: "#FFF3ED", accent: "#E85D26" },
  { id: "history", name: "History", emoji: "🏛️", color: "#8B5CF6", bg: "#F3F0FF", accent: "#7C3AED" },
  { id: "geography", name: "Geography", emoji: "🌍", color: "#0EA5E9", bg: "#EFF9FF", accent: "#0284C7" },
  { id: "space", name: "Space", emoji: "🚀", color: "#EC4899", bg: "#FFF0F7", accent: "#DB2777" },
  { id: "body", name: "Human Body", emoji: "🧬", color: "#10B981", bg: "#EDFCF5", accent: "#059669" },
];

const MYTHS_AND_FACTS = [
  // ANIMALS
  { category: "animals", claim: "Goldfish only have a 3-second memory.", isTrue: false, explanation: "Goldfish can actually remember things for months! Scientists have trained them to push levers, navigate mazes, and even recognize their owners.", funFact: "Some goldfish have been trained to play soccer underwater!" },
  { category: "animals", claim: "Octopuses have three hearts.", isTrue: true, explanation: "It's true! Two hearts pump blood to the gills, and one pumps it to the rest of the body. The main heart actually stops beating when the octopus swims, which is why they prefer crawling.", funFact: "Octopuses also have blue blood!" },
  { category: "animals", claim: "Bulls get angry when they see the color red.", isTrue: false, explanation: "Bulls are actually colorblind to red! In bullfighting, it's the movement of the cape that gets them excited, not the color. The red cape is really just tradition.", funFact: "Cows can see almost 360 degrees around themselves without turning their heads." },
  { category: "animals", claim: "A group of flamingos is called a 'flamboyance.'", isTrue: true, explanation: "Yes! A group of flamingos is officially called a flamboyance. It's one of the most fabulous collective nouns in the animal kingdom.", funFact: "Flamingos are born white or gray and turn pink from eating shrimp and algae!" },
  { category: "animals", claim: "Dogs can only see in black and white.", isTrue: false, explanation: "Dogs can actually see colors — just not as many as humans. They see the world in shades of blue and yellow, kind of like looking through a blue-yellow filter.", funFact: "Dogs have a special reflective layer behind their eyes that helps them see better in the dark." },
  { category: "animals", claim: "Cows have best friends and get stressed when separated.", isTrue: true, explanation: "Research shows that cows form strong bonds with certain other cows. When separated from their best friend, their heart rate goes up and they become visibly anxious.", funFact: "Cows also have regional accents — their moos sound different depending on what herd they belong to!" },
  { category: "animals", claim: "Ostriches bury their heads in the sand when scared.", isTrue: false, explanation: "Ostriches never bury their heads in the sand! When threatened, they either run (at up to 45 mph!) or lie flat on the ground. From far away, their small heads can look like they've disappeared.", funFact: "An ostrich's eye is bigger than its brain." },
  { category: "animals", claim: "Sea otters hold hands while sleeping so they don't drift apart.", isTrue: true, explanation: "This adorable fact is real! Sea otters often hold paws with each other while floating on their backs to sleep. They also wrap themselves in kelp to stay anchored.", funFact: "Sea otters have the densest fur of any mammal — about 1 million hairs per square inch!" },
  { category: "animals", claim: "Elephants are the only animals that can't jump.", isTrue: false, explanation: "While it's true that elephants can't jump, they're not the only ones! Sloths, hippos, and rhinos can't jump either. Elephants' heavy bones and leg structure make jumping physically impossible for them.", funFact: "Elephants can communicate using vibrations in the ground that they detect through their feet!" },
  { category: "animals", claim: "A shrimp's heart is located in its head.", isTrue: true, explanation: "This is true! A shrimp's heart sits in its head region, right behind the eyes. Their entire circulatory system is arranged differently from mammals — their organs are packed into what we'd think of as the head area.", funFact: "The mantis shrimp can punch with the force of a bullet and see 16 types of color receptors — humans only have 3!" },

  // HISTORY
  { category: "history", claim: "Vikings wore helmets with horns on them.", isTrue: false, explanation: "There's no historical evidence that Vikings wore horned helmets in battle! This myth comes from 19th-century artists and costume designers. Real Viking helmets were simple rounded metal or leather caps.", funFact: "Vikings were actually very clean — they bathed at least once a week, which was a lot more than most Europeans at the time!" },
  { category: "history", claim: "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.", isTrue: true, explanation: "Mind-blowing but true! The Great Pyramid was built around 2560 BC. Cleopatra lived around 30 BC — that's a 2,500-year gap. The Moon landing was in 1969, only about 2,000 years after Cleopatra!", funFact: "Cleopatra spoke at least nine languages." },
  { category: "history", claim: "Napoleon Bonaparte was extremely short.", isTrue: false, explanation: "Napoleon was actually about 5'7\", which was average or even slightly above average for his time! The myth came partly from British propaganda and partly from confusion between French and English measurement systems.", funFact: "Napoleon was once attacked by a horde of rabbits during a hunting party. The rabbits charged at him and his men!" },
  { category: "history", claim: "Oxford University is older than the Aztec Empire.", isTrue: true, explanation: "Oxford University started teaching as early as 1096, while the Aztec Empire wasn't founded until 1428. That means Oxford was already over 300 years old when the Aztecs began building their civilization!", funFact: "The oldest known university in the world is the University of al-Qarawiyyin in Morocco, founded in 859 AD." },
  { category: "history", claim: "The Great Wall of China is visible from space with the naked eye.", isTrue: false, explanation: "Astronauts have confirmed that the Great Wall is NOT visible from space without aid. It's very long but too narrow (about 15-30 feet wide) to spot from orbit. Many highways and airports are actually easier to see!", funFact: "The Great Wall took over 2,000 years to build across many different dynasties." },
  { category: "history", claim: "Ancient Egyptians used moldy bread to treat infections.", isTrue: true, explanation: "True! Ancient Egyptians applied moldy bread to wounds, and it often helped. They didn't know why it worked, but we now know that certain bread molds produce antibiotic substances — the same principle behind penicillin!", funFact: "Ancient Egyptians also invented toothpaste, using a mixture of crushed rock, vinegar, and dried flowers." },
  { category: "history", claim: "Thomas Edison invented the light bulb.", isTrue: false, explanation: "Edison didn't actually invent the light bulb — many inventors worked on electric lighting before him. What Edison did was improve on existing designs to create a practical, long-lasting version and develop a system to power it.", funFact: "Edison held over 1,000 patents in his lifetime!" },
  { category: "history", claim: "Honey found in ancient Egyptian tombs was still edible after 3,000 years.", isTrue: true, explanation: "Archaeologists have found pots of honey in Egyptian tombs that were thousands of years old and still perfectly fine to eat! Honey's low moisture content, acidity, and natural hydrogen peroxide make it virtually immortal.", funFact: "Bees must visit about 2 million flowers to make just one pound of honey." },
  { category: "history", claim: "Albert Einstein failed math as a student.", isTrue: false, explanation: "Einstein was actually excellent at math throughout his schooling! This myth may have started from confusion about the Swiss grading system, where a 6 was the highest mark — and Einstein regularly scored top marks in math and physics.", funFact: "Einstein didn't speak fluently until age 9, which worried his parents, but he was solving complex math problems by age 12." },
  { category: "history", claim: "The shortest war in history lasted only 38 minutes.", isTrue: true, explanation: "The Anglo-Zanzibar War of 1896 is recognized as the shortest war in recorded history. It began at 9:00 AM when the British issued an ultimatum, and it was all over by 9:38 AM when Zanzibar surrendered.", funFact: "The longest war in history is often cited as the Reconquista in Spain, which lasted about 781 years!" },

  // GEOGRAPHY
  { category: "geography", claim: "Russia has more surface area than the planet Pluto.", isTrue: true, explanation: "Russia covers about 17.1 million square kilometers, while Pluto's surface area is only about 16.7 million square kilometers. A single country on Earth is bigger than an entire (dwarf) planet!", funFact: "Russia spans 11 different time zones!" },
  { category: "geography", claim: "Mount Everest is the tallest mountain on Earth.", isTrue: false, explanation: "It depends on how you measure! Everest has the highest peak above sea level, but if you measure from base to summit, Mauna Kea in Hawaii is actually taller — most of it is just underwater.", funFact: "Mount Everest grows about 4 millimeters taller every year due to geological forces." },
  { category: "geography", claim: "There's a town in Norway where the sun doesn't set for 76 days straight.", isTrue: true, explanation: "In Hammerfest, Norway, the sun stays above the horizon continuously from mid-May to late July! This phenomenon is called the 'midnight sun' and happens because of how the Earth tilts toward the sun.", funFact: "In winter, the opposite happens — Hammerfest experiences 'polar night' with no sunrise for about two months." },
  { category: "geography", claim: "The Sahara Desert is the largest desert in the world.", isTrue: false, explanation: "Antarctica is actually the world's largest desert! A desert is defined by low precipitation, not heat. Antarctica gets so little snowfall that it qualifies as a polar desert — and it's nearly twice the size of the Sahara.", funFact: "The Sahara was once green and lush! About 6,000 years ago it had lakes, rivers, and grasslands." },
  { category: "geography", claim: "Canada has more lakes than the rest of the world's countries combined.", isTrue: true, explanation: "Canada has an estimated 879,800 lakes, which is more than all other countries put together! About 9% of Canada's total area is covered by fresh water.", funFact: "One of Canada's lakes, Manitou Lake, has an island with a lake on it — a lake within a lake!" },
  { category: "geography", claim: "Lightning never strikes the same place twice.", isTrue: false, explanation: "Lightning absolutely strikes the same place multiple times! The Empire State Building gets hit about 20-25 times per year. Tall, pointed, isolated structures are especially likely to be struck repeatedly.", funFact: "A park ranger named Roy Sullivan was struck by lightning 7 different times during his life and survived them all!" },
  { category: "geography", claim: "There is a lake in Australia that is naturally bright pink.", isTrue: true, explanation: "Lake Hillier on Middle Island in Western Australia is a striking bubblegum-pink color! Scientists believe the color comes from a combination of algae and bacteria that produce red pigments. The pink color persists even when the water is collected in a container.", funFact: "There are other pink lakes around the world too — in Senegal, Spain, and Canada!" },
  { category: "geography", claim: "The Amazon River has no bridges crossing it.", isTrue: true, explanation: "Despite being the second-longest river in the world, there are zero bridges that cross the Amazon River! This is partly because the river runs mostly through dense rainforest where few roads exist, and during the wet season it can be 30 miles wide.", funFact: "The Amazon carries more water than the next seven largest rivers combined." },
  { category: "geography", claim: "Niagara Falls has completely frozen solid many times.", isTrue: false, explanation: "While ice buildup can be dramatic and photos make it look frozen, Niagara Falls has never fully stopped flowing. The massive volume of water and its constant movement prevent it from freezing completely. Surface ice can form, but water continues flowing underneath.", funFact: "About 750,000 gallons of water flow over Niagara Falls every single second!" },
  { category: "geography", claim: "Finland has more saunas than cars.", isTrue: true, explanation: "Finland has an estimated 3.3 million saunas for a population of about 5.5 million people. That's roughly one sauna for every 1.7 people! The number of registered cars is lower, making saunas more common than automobiles.", funFact: "In Finland, important business decisions are sometimes made in the sauna rather than the boardroom." },

  // SPACE
  { category: "space", claim: "A day on Venus is longer than a year on Venus.", isTrue: true, explanation: "Venus rotates incredibly slowly — one full rotation (a day) takes 243 Earth days. But it orbits the Sun in just 225 Earth days. So a single day on Venus is actually longer than its entire year!", funFact: "Venus also rotates backwards compared to most planets, so the Sun rises in the west there." },
  { category: "space", claim: "The Sun is a ball of fire.", isTrue: false, explanation: "The Sun isn't actually on fire! Fire needs oxygen, and there's no oxygen in space. The Sun produces energy through nuclear fusion — hydrogen atoms are squeezed together so hard they merge into helium, releasing enormous energy.", funFact: "The Sun's core temperature is about 27 million degrees Fahrenheit!" },
  { category: "space", claim: "There are more stars in the universe than grains of sand on all of Earth's beaches.", isTrue: true, explanation: "Scientists estimate there are roughly 70 sextillion stars in the observable universe (that's 7 followed by 22 zeros). That's more than all the grains of sand on every beach and desert on Earth!", funFact: "Our own Milky Way galaxy alone contains between 100-400 billion stars." },
  { category: "space", claim: "The dark side of the Moon never gets any sunlight.", isTrue: false, explanation: "There is no permanently dark side! The Moon rotates, so all sides get sunlight. The 'far side' always faces away from Earth, so we never see it from here — but it gets just as much sun as the side we can see.", funFact: "The first photos of the Moon's far side were taken by a Soviet spacecraft in 1959." },
  { category: "space", claim: "Neutron stars are so dense that a teaspoon of one would weigh about 6 billion tons.", isTrue: true, explanation: "This is real! Neutron stars are the collapsed cores of massive stars. Their matter is so incredibly compressed that a tiny amount has mind-boggling weight.", funFact: "Some neutron stars spin over 700 times per second!" },
  { category: "space", claim: "Sound can travel through space.", isTrue: false, explanation: "Space is a near-perfect vacuum, and sound needs a medium (like air or water) to travel through. No matter how big the explosion, you wouldn't hear a thing in space! Movies get this wrong all the time.", funFact: "NASA has translated electromagnetic waves from planets into sound we can hear — Saturn sounds especially eerie!" },
  { category: "space", claim: "Astronauts grow taller in space.", isTrue: true, explanation: "Without gravity compressing their spines, astronauts can grow up to 2 inches taller while in space! The fluid between their vertebrae expands when there's no gravitational pull pushing down on them.", funFact: "They shrink back to their normal height within a few weeks of returning to Earth." },
  { category: "space", claim: "The Moon has its own moonquakes.", isTrue: true, explanation: "The Moon does experience quakes! Apollo astronauts placed seismometers on the lunar surface and detected thousands of moonquakes. Some are caused by meteorite impacts, some by temperature changes, and some are deep quakes whose cause is still being studied.", funFact: "Some moonquakes can last over 10 minutes — much longer than most earthquakes on Earth." },
  { category: "space", claim: "The planet Mercury is the hottest planet in our solar system.", isTrue: false, explanation: "Even though Mercury is closest to the Sun, Venus is actually the hottest planet! Venus has a thick atmosphere full of carbon dioxide that traps heat in a runaway greenhouse effect, pushing surface temperatures to about 900°F — hot enough to melt lead.", funFact: "Mercury has virtually no atmosphere, so its dark side can drop to -290°F — a swing of over 1,000 degrees!" },
  { category: "space", claim: "There is a planet made largely of diamond.", isTrue: true, explanation: "Scientists believe that 55 Cancri e, a 'super-Earth' about 40 light-years away, may have a surface covered in graphite and diamond. Its carbon-rich composition and extreme pressure could create a world where diamond is as common as rock is on Earth.", funFact: "There are also diamond 'rain' storms on Neptune and Uranus, where extreme pressure turns carbon into diamonds." },

  // HUMAN BODY
  { category: "body", claim: "Humans use only 10% of their brains.", isTrue: false, explanation: "Brain scans show that we use virtually every part of our brain, and most of it is active almost all the time! Different areas are responsible for different things, and even during sleep, many areas stay busy.", funFact: "Your brain uses about 20% of your body's total energy, even though it's only about 2% of your body weight." },
  { category: "body", claim: "Your stomach acid is strong enough to dissolve metal.", isTrue: true, explanation: "Stomach acid (hydrochloric acid) has a pH of 1-2, which is strong enough to dissolve zinc and other metals! Your stomach protects itself by constantly producing a thick layer of mucus.", funFact: "Your stomach lining completely replaces itself every 3-4 days to keep up with the acid." },
  { category: "body", claim: "Cracking your knuckles causes arthritis.", isTrue: false, explanation: "Multiple studies have found no link between knuckle cracking and arthritis! The popping sound comes from tiny gas bubbles bursting in the fluid around your joints. It might annoy people around you, but it won't damage your joints.", funFact: "A doctor named Donald Unger cracked the knuckles on one hand for 60 years and not the other to prove this — neither hand got arthritis!" },
  { category: "body", claim: "Your nose can remember 50,000 different scents.", isTrue: true, explanation: "The human nose is amazingly powerful! Research suggests we can distinguish at least 50,000 different smells, and some scientists think the number could be as high as one trillion.", funFact: "Smell is the sense most strongly linked to memory — a single scent can instantly bring back a vivid memory from years ago." },
  { category: "body", claim: "You swallow about eight spiders per year in your sleep.", isTrue: false, explanation: "This is a total myth with no scientific basis! Spiders can sense vibrations and would avoid a large, breathing, snoring human. The odds of a spider crawling into your mouth while you sleep are extremely tiny.", funFact: "This myth may have been deliberately created in 1993 to show how easily false facts spread!" },
  { category: "body", claim: "Babies are born with about 300 bones, but adults have only 206.", isTrue: true, explanation: "Babies have around 270-300 soft bones that gradually fuse together as they grow. By adulthood, many bones have merged, leaving us with 206. This is why babies are so flexible!", funFact: "About 25% of all your bones are in your feet — each foot has 26 bones!" },
  { category: "body", claim: "Shaving makes your hair grow back thicker.", isTrue: false, explanation: "Shaving doesn't change the thickness, color, or rate of hair growth at all! Shaved hair has a blunt tip instead of a natural tapered one, which can make it feel stubbier — but it's the same hair.", funFact: "Hair is one of the fastest-growing tissues in the human body, second only to bone marrow." },
  { category: "body", claim: "Your tongue has different taste zones for sweet, salty, sour, and bitter.", isTrue: false, explanation: "The famous 'tongue map' is a myth! Every part of your tongue can detect all tastes. This misconception came from a misinterpretation of a German research paper in the early 1900s and somehow stuck around in textbooks for decades.", funFact: "Humans have a fifth taste called 'umami' which detects savory flavors — it was only officially recognized in 2002." },
  { category: "body", claim: "Humans share about 60% of their DNA with bananas.", isTrue: true, explanation: "This surprising fact is true! Humans and bananas share many of the same basic genes needed for fundamental cell functions. We also share about 85% of our DNA with mice and about 96% with chimpanzees.", funFact: "All humans share 99.9% of their DNA with each other — we're far more alike than we are different!" },
  { category: "body", claim: "Your brain generates enough electricity to power a small light bulb.", isTrue: true, explanation: "The human brain operates on about 12-25 watts of power, which is enough to light a low-wattage LED bulb! This energy comes from the electrical signals that billions of neurons use to communicate with each other.", funFact: "Your brain contains roughly 86 billion neurons, each connected to thousands of others — more connections than stars in the Milky Way." },
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- Confetti / Particle System ---
function ConfettiBurst() {
  const particles = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      angle: Math.random() * 360,
      scale: 0.5 + Math.random() * 1,
      color: ["#FF6B35", "#8B5CF6", "#0EA5E9", "#EC4899", "#10B981", "#FBBF24", "#F43F5E"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
      shape: Math.random() > 0.5 ? "circle" : "rect",
    }))
  ).current;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-5%",
            width: p.shape === "circle" ? 12 * p.scale : 8 * p.scale,
            height: p.shape === "circle" ? 12 * p.scale : 16 * p.scale,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            backgroundColor: p.color,
            animation: `confettiFall 1.8s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.angle}deg)`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}

// --- Emoji Burst for incorrect ---
function EmojiBurst({ emoji = "🧠" }) {
  const items = useRef(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i / 8) * 360,
      distance: 60 + Math.random() * 40,
      delay: Math.random() * 0.2,
      size: 20 + Math.random() * 16,
    }))
  ).current;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {items.map((item) => (
        <span
          key={item.id}
          style={{
            position: "absolute",
            fontSize: item.size,
            animation: `emojiBurst 1s ease-out ${item.delay}s forwards`,
            opacity: 0,
            ["--tx"]: `${Math.cos((item.angle * Math.PI) / 180) * item.distance}px`,
            ["--ty"]: `${Math.sin((item.angle * Math.PI) / 180) * item.distance}px`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

// --- Main App ---
export default function MythsBusted() {
  const [screen, setScreen] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentClaim, setCurrentClaim] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [seenClaims, setSeenClaims] = useState({});
  const [animatingOut, setAnimatingOut] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const getCategoryData = useCallback((catId) => CATEGORIES.find((c) => c.id === catId), []);

  const getNextClaim = useCallback(
    (catId) => {
      const seen = seenClaims[catId] || [];
      const available = MYTHS_AND_FACTS.filter((m) => m.category === catId && !seen.includes(m.claim));
      if (available.length === 0) return null;
      const shuffled = shuffle(available);
      return shuffled[0];
    },
    [seenClaims]
  );

  const selectCategory = (catId) => {
    const claim = getNextClaim(catId);
    if (!claim) {
      setSelectedCategory(catId);
      setAllDone(true);
      setScreen("challenge");
      return;
    }
    setSelectedCategory(catId);
    setCurrentClaim(claim);
    setUserAnswer(null);
    setShowResult(false);
    setAllDone(false);
    transitionTo("challenge");
  };

  const transitionTo = (newScreen) => {
    setAnimatingOut(true);
    setTimeout(() => {
      setScreen(newScreen);
      setAnimatingOut(false);
    }, 300);
  };

  const handleAnswer = (answeredTrue) => {
    setUserAnswer(answeredTrue);
    setSeenClaims((prev) => ({
      ...prev,
      [selectedCategory]: [...(prev[selectedCategory] || []), currentClaim.claim],
    }));
    setTimeout(() => setShowResult(true), 100);
  };

  const handleNext = () => {
    const claim = getNextClaim(selectedCategory);
    if (!claim) {
      setAllDone(true);
      setShowResult(false);
      return;
    }
    setAnimatingOut(true);
    setTimeout(() => {
      setCurrentClaim(claim);
      setUserAnswer(null);
      setShowResult(false);
      setAnimatingOut(false);
    }, 300);
  };

  const goHome = () => {
    setAllDone(false);
    setCurrentClaim(null);
    setUserAnswer(null);
    setShowResult(false);
    transitionTo("home");
  };

  const resetCategory = (catId) => {
    setSeenClaims((prev) => ({ ...prev, [catId]: [] }));
    setAllDone(false);
    selectCategory(catId);
  };

  const isCorrect = userAnswer !== null && currentClaim && userAnswer === currentClaim.isTrue;
  const catData = selectedCategory ? getCategoryData(selectedCategory) : null;

  const seenCount = selectedCategory ? (seenClaims[selectedCategory] || []).length : 0;
  const totalCount = selectedCategory ? MYTHS_AND_FACTS.filter((m) => m.category === selectedCategory).length : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes confettiFall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }

        @keyframes emojiBurst {
          0% { opacity: 1; transform: translate(0, 0) scale(0.3); }
          60% { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(1.2); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(40px); }
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.5); }
          70% { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes wobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3) translateY(20px); }
          50% { transform: scale(1.05) translateY(-5px); }
          70% { transform: scale(0.95) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes starSpin {
          0% { transform: rotate(0deg) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: rotate(360deg) scale(1); opacity: 0; }
        }

        .screen-enter { animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .screen-exit { animation: slideDown 0.3s ease-in forwards; }

        .category-card {
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }
        .category-card:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 12px 32px -4px rgba(0,0,0,0.15);
        }
        .category-card:active { transform: translateY(-2px) scale(0.98); }

        .answer-btn {
          transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .answer-btn:hover { transform: translateY(-3px) scale(1.03); }
        .answer-btn:active { transform: translateY(0px) scale(0.97); }

        .next-btn {
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .next-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .next-btn:active { transform: translateY(0px); }

        .result-card { animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .claim-card { animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        .bg-blobs > div {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          fontFamily: "'Nunito', sans-serif",
          background: screen === "home"
            ? "linear-gradient(135deg, #FFF7ED 0%, #FDF2F8 30%, #EFF6FF 60%, #ECFDF5 100%)"
            : `linear-gradient(135deg, ${catData?.bg || "#fff"} 0%, #FFFFFF 100%)`,
          transition: "background 0.5s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration blobs */}
        <div className="bg-blobs" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ width: 300, height: 300, top: "-5%", left: "-5%", background: catData?.color || "#FF6B35", animationDelay: "0s" }} />
          <div style={{ width: 250, height: 250, bottom: "10%", right: "-5%", background: catData?.color || "#8B5CF6", animationDelay: "2s" }} />
          <div style={{ width: 200, height: 200, top: "40%", left: "60%", background: catData?.color || "#0EA5E9", animationDelay: "4s" }} />
        </div>

        <div
          className={animatingOut ? "screen-exit" : "screen-enter"}
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 560,
            margin: "0 auto",
            padding: "32px 20px",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ===== HOME SCREEN ===== */}
          {screen === "home" && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ textAlign: "center", marginBottom: 40, marginTop: 20 }}>
                <div
                  style={{
                    fontFamily: "'Lilita One', cursive",
                    fontSize: "clamp(42px, 8vw, 56px)",
                    lineHeight: 1.1,
                    background: "linear-gradient(135deg, #FF6B35, #EC4899, #8B5CF6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: 8,
                    animation: "float 4s ease-in-out infinite",
                  }}
                >
                  True or Myth
                </div>
                <p style={{ fontSize: 18, color: "#64748B", fontWeight: 600 }}>
                  Can you tell fact from fiction? 🤔
                </p>
              </div>

              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: "#94A3B8",
                  marginBottom: 16,
                }}
              >
                Pick a category
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
                {CATEGORIES.map((cat, i) => (
                  <div
                    key={cat.id}
                    className="category-card"
                    onClick={() => selectCategory(cat.id)}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 20,
                      padding: "22px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      boxShadow: `0 4px 16px -2px ${cat.color}22, 0 2px 6px -1px rgba(0,0,0,0.06)`,
                      border: `2px solid ${cat.color}20`,
                      animation: `bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.08}s both`,
                    }}
                  >
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        background: `linear-gradient(135deg, ${cat.color}18, ${cat.color}30)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        flexShrink: 0,
                      }}
                    >
                      {cat.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 19, color: "#1E293B" }}>{cat.name}</div>
                      <div style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600, marginTop: 2 }}>
                        {MYTHS_AND_FACTS.filter((m) => m.category === cat.id).length} challenges
                        {(seenClaims[cat.id] || []).length > 0 && ` · ${seenClaims[cat.id].length} played`}
                      </div>
                    </div>
                    <div style={{ fontSize: 22, color: cat.color, fontWeight: 800 }}>→</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== CHALLENGE SCREEN ===== */}
          {screen === "challenge" && !showResult && !allDone && currentClaim && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <button
                  onClick={goHome}
                  className="next-btn"
                  style={{
                    background: "#F1F5F9",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 16px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#64748B",
                    fontFamily: "'Nunito', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  ← Back
                </button>
                <div
                  style={{
                    background: `${catData.color}15`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: catData.color,
                  }}
                >
                  {seenCount + 1} / {totalCount}
                </div>
              </div>

              {/* Category badge */}
              <div style={{ textAlign: "center", marginBottom: 10 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    color: catData.color,
                  }}
                >
                  {catData.emoji} {catData.name}
                </span>
              </div>

              {/* Claim card */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div
                  className="claim-card"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: 28,
                    padding: "40px 28px",
                    textAlign: "center",
                    boxShadow: `0 8px 32px -4px ${catData.color}20, 0 4px 12px -2px rgba(0,0,0,0.06)`,
                    border: `2px solid ${catData.color}15`,
                    width: "100%",
                    marginBottom: 32,
                    position: "relative",
                  }}
                >
                  <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50)" }}>
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${catData.color}, ${catData.accent})`,
                        color: "white",
                        padding: "6px 18px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                      }}
                    >
                      True or Myth?
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: "clamp(20px, 4.5vw, 26px)",
                      fontWeight: 800,
                      color: "#1E293B",
                      lineHeight: 1.4,
                      marginTop: 8,
                    }}
                  >
                    "{currentClaim.claim}"
                  </p>
                </div>

                {/* Answer buttons */}
                <div style={{ display: "flex", gap: 16, width: "100%" }}>
                  <button
                    className="answer-btn"
                    onClick={() => handleAnswer(true)}
                    style={{
                      flex: 1,
                      padding: "20px 16px",
                      borderRadius: 20,
                      border: "3px solid #10B98130",
                      background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#059669",
                      fontFamily: "'Lilita One', cursive",
                      letterSpacing: 1,
                    }}
                  >
                    ✓ True!
                  </button>
                  <button
                    className="answer-btn"
                    onClick={() => handleAnswer(false)}
                    style={{
                      flex: 1,
                      padding: "20px 16px",
                      borderRadius: 20,
                      border: "3px solid #F4364530",
                      background: "linear-gradient(135deg, #FFF1F2, #FECDD3)",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#E11D48",
                      fontFamily: "'Lilita One', cursive",
                      letterSpacing: 1,
                    }}
                  >
                    ✗ Myth!
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== RESULT SCREEN ===== */}
          {screen === "challenge" && showResult && currentClaim && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {isCorrect && <ConfettiBurst />}

              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <button
                  onClick={goHome}
                  className="next-btn"
                  style={{
                    background: "#F1F5F9",
                    border: "none",
                    borderRadius: 12,
                    padding: "10px 16px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#64748B",
                    fontFamily: "'Nunito', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  ← Categories
                </button>
                <div
                  style={{
                    background: `${catData.color}15`,
                    borderRadius: 20,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 700,
                    color: catData.color,
                  }}
                >
                  {seenCount} / {totalCount}
                </div>
              </div>

              {/* Result banner */}
              <div
                className="result-card"
                style={{
                  borderRadius: 24,
                  padding: "28px 24px",
                  textAlign: "center",
                  background: isCorrect
                    ? "linear-gradient(135deg, #ECFDF5, #D1FAE5)"
                    : "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
                  border: isCorrect ? "2px solid #10B98130" : "2px solid #FB923C30",
                  marginBottom: 20,
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {!isCorrect && <EmojiBurst emoji="🧠" />}
                <div style={{ fontSize: 44, marginBottom: 8 }}>{isCorrect ? "🎉" : "🤔"}</div>
                <div
                  style={{
                    fontFamily: "'Lilita One', cursive",
                    fontSize: "clamp(24px, 5vw, 32px)",
                    color: isCorrect ? "#059669" : "#EA580C",
                    marginBottom: 4,
                  }}
                >
                  {isCorrect ? "You nailed it!" : "Not quite!"}
                </div>
                <p style={{ fontSize: 15, color: isCorrect ? "#047857" : "#C2410C", fontWeight: 600, opacity: 0.8 }}>
                  {isCorrect
                    ? "You really know your stuff!"
                    : "But now you know — that's what counts!"}
                </p>
              </div>

              {/* The answer */}
              <div
                style={{
                  animation: "bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both",
                  background: "#FFFFFF",
                  borderRadius: 24,
                  padding: "24px",
                  boxShadow: "0 4px 16px -2px rgba(0,0,0,0.06)",
                  border: "1px solid #E2E8F0",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div
                    style={{
                      background: currentClaim.isTrue
                        ? "linear-gradient(135deg, #10B981, #059669)"
                        : "linear-gradient(135deg, #F43F5E, #E11D48)",
                      color: "white",
                      padding: "4px 14px",
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {currentClaim.isTrue ? "✓ True" : "✗ Myth"}
                  </div>
                </div>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.65, fontWeight: 600, marginBottom: 0 }}>
                  {currentClaim.explanation}
                </p>
              </div>

              {/* Fun fact */}
              {currentClaim.funFact && (
                <div
                  style={{
                    animation: "bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s both",
                    background: `linear-gradient(135deg, ${catData.color}08, ${catData.color}15)`,
                    borderRadius: 20,
                    padding: "18px 22px",
                    border: `1.5px solid ${catData.color}20`,
                    marginBottom: 28,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: catData.color, marginBottom: 6 }}>
                    💡 Bonus fact
                  </div>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, fontWeight: 600 }}>
                    {currentClaim.funFact}
                  </p>
                </div>
              )}

              {/* Next button */}
              <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
                <button
                  className="next-btn"
                  onClick={handleNext}
                  style={{
                    flex: 1,
                    padding: "18px 24px",
                    borderRadius: 18,
                    border: "none",
                    background: `linear-gradient(135deg, ${catData.color}, ${catData.accent})`,
                    color: "white",
                    fontSize: 18,
                    fontWeight: 800,
                    fontFamily: "'Lilita One', cursive",
                    letterSpacing: 1,
                    boxShadow: `0 6px 20px -4px ${catData.color}50`,
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ===== ALL DONE SCREEN ===== */}
          {screen === "challenge" && allDone && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <div className="result-card" style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 64, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🎓</div>
                <div
                  style={{
                    fontFamily: "'Lilita One', cursive",
                    fontSize: "clamp(28px, 6vw, 36px)",
                    color: catData.color,
                    marginBottom: 8,
                  }}
                >
                  You've seen them all!
                </div>
                <p style={{ fontSize: 16, color: "#64748B", fontWeight: 600, maxWidth: 320 }}>
                  You've gone through every {catData.name.toLowerCase()} challenge. Impressive! 🌟
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
                <button
                  className="next-btn"
                  onClick={() => resetCategory(selectedCategory)}
                  style={{
                    padding: "16px 24px",
                    borderRadius: 16,
                    border: `2px solid ${catData.color}30`,
                    background: `${catData.color}10`,
                    color: catData.color,
                    fontSize: 16,
                    fontWeight: 800,
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  🔄 Play {catData.name} Again
                </button>
                <button
                  className="next-btn"
                  onClick={goHome}
                  style={{
                    padding: "16px 24px",
                    borderRadius: 16,
                    border: "none",
                    background: `linear-gradient(135deg, ${catData.color}, ${catData.accent})`,
                    color: "white",
                    fontSize: 16,
                    fontWeight: 800,
                    fontFamily: "'Lilita One', cursive",
                    letterSpacing: 1,
                    boxShadow: `0 6px 20px -4px ${catData.color}50`,
                  }}
                >
                  ← Try Another Category
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
