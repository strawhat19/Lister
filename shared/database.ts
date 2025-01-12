import { colors } from '@/components/theme/Themed';
import { ColumnType, ItemType } from './types/types';

export const defaultImages = {
  sky: require('@/assets/images/hq/sky.jpg'),
  hand_leaf:  require('@/assets/images/hq/nature_hand_leaf.jpg'),
  wind_curtains:  require('@/assets/images/hq/wind_curtains.jpeg'),
  jelly_fish:  require('@/assets/images/hq/nature_jelly_fish.jpeg'),
  wind_flag:  require('@/assets/images/hq/festivals_wind_flag.jpeg'),
  singing_rockstar:  require('@/assets/images/hq/music_singing.jpg'),
  wind_mills:  require('@/assets/images/hq/clean_energy_wind_mills2.jpeg'),
  playing_keyboard:  require('@/assets/images/hq/music_playing_keyboard.jpg'),
}

export const itemObjects = {
  JellyFish: new ItemType({
    id: 1,
    key: 1,
    name: `Jelly Fish`,
    fontColor: `white`,
    listID: `1-listColumn-items`,
    image: defaultImages.jelly_fish,
    backgroundColor: colors.appleGreen,
    summary: `Discover the mesmerizing beauty of jellyfish as they drift gracefully in the ocean.`,
    description: `Discover the mesmerizing beauty of jellyfish as they drift gracefully in the ocean. This card celebrates the tranquility and elegance of marine life.`,
  }),
  MotherNature: new ItemType({
    id: 2,
    key: 2,
    name: `Mother Nature`,
    listID: `1-listColumn-items`,
    image: defaultImages.hand_leaf,
    backgroundColor: colors.appleBlue,
    summary: `Immerse yourself in the nurturing embrace of nature.`,
    description: `Immerse yourself in the nurturing embrace of nature. This card reflects the harmony between humanity and the environment, symbolized by a delicate hand cradling a leaf. Immerse yourself in the nurturing embrace of nature. This card reflects the harmony between humanity and the environment. Immerse yourself in the nurturing embrace of nature. This card reflects the harmony between humanity and the environment, symbolized by a delicate hand cradling a leaf. Symbolized by a delicate leaf.`,
  }),
  PlayingMusic: new ItemType({
    id: 3,
    key: 3,
    name: `Playing Music`,
    listID: `2-listColumn-active`,
    backgroundColor: colors.appleRed,
    image: defaultImages.playing_keyboard,
    summary: `Let the melody flow with the joy of playing music.`,
    description: `Let the melody flow with the joy of playing music. This card represents creativity and the universal language of music that brings people together.`,
  }),
  Festivals: new ItemType({
    id: 4,
    key: 4,
    name: `Festivals`,
    image: defaultImages.wind_flag,
    listID: `2-listColumn-active`,
    fontColor: colors.darkTabBorder,
    backgroundColor: colors.appleYellow,
    summary: `Capture the spirit of celebration and unity in vibrant festivals.`,
    description: `Capture the spirit of celebration and unity in vibrant festivals. This card showcases the joy and cultural richness of festive occasions.`,
  }),
  CleanEnergy: new ItemType({
    id: 5,
    key: 5,
    name: `Clean Energy`,
    image: defaultImages.wind_mills,
    listID: `3-listColumn-complete`,
    backgroundColor: colors.applePurple,
    summary: `Step into a sustainable future with clean energy.`,
    description: `Step into a sustainable future with clean energy. This card highlights the beauty and importance of renewable energy sources like wind power.`,
  }),
  Singing: new ItemType({
    id: 6,
    key: 6,
    name: `Singing`,
    listID: `3-listColumn-complete`,
    image: defaultImages.singing_rockstar,
    backgroundColor: colors.appleGreenShade,
    summary: `Celebrate the power of vocal expression and the passion of singing.`,
    description: `Celebrate the power of vocal expression and the passion of singing. This card is a tribute to artists and performers who inspire through music.`,
  }),
  TheOutside: new ItemType({
    id: 7,
    key: 7,
    name: `The Outside`,
    listID: `3-listColumn-complete`,
    fontColor: colors.darkTabBorder,
    image: defaultImages.wind_curtains,
    backgroundColor: colors.appleGreenMint,
    summary: `Feel the refreshing breeze and freedom of the outdoors.`,
    description: `Feel the refreshing breeze and freedom of the outdoors. This card evokes a sense of openness and connection with nature's boundless beauty.`,
  }),
  TheSky: new ItemType({
    id: 8,
    key: 8,
    name: `The Sky`,
    image: defaultImages.sky,
    listID: `4-listColumn-new`,
    backgroundColor: colors.navy,
    summary: `The sky is a vast, expansive canvas that stretches endlessly above, painted with a palette that shifts throughout the day.`,
    description: `At dawn, it awakens with soft hues of pink, orange, and lavender, gradually brightening into a radiant blue as the sun ascends. During the day, it can appear as a brilliant azure dome, dotted with fluffy white clouds drifting lazily, or cloaked in dramatic shades of gray when storms approach. At dusk, the sky transforms again, showcasing fiery streaks of red, gold, and purple, fading into deeper tones as night falls. Under the cover of darkness, it becomes a velvet-black expanse adorned with twinkling stars and the silvery glow of the moon, offering a sense of wonder and mystery. The sky is ever-changing, a reflection of the world's moods and an eternal reminder of nature's boundless beauty.`,
  }),
  TheSky2: new ItemType({
    id: 9,
    key: 9,
    name: `The Sky`,
    image: defaultImages.sky,
    listID: `4-listColumn-new`,
    backgroundColor: colors.navy,
    summary: `The sky is a vast, expansive canvas that stretches endlessly above, painted with a palette that shifts throughout the day.`,
    description: `At dawn, it awakens with soft hues of pink, orange, and lavender, gradually brightening into a radiant blue as the sun ascends. During the day, it can appear as a brilliant azure dome, dotted with fluffy white clouds drifting lazily, or cloaked in dramatic shades of gray when storms approach. At dusk, the sky transforms again, showcasing fiery streaks of red, gold, and purple, fading into deeper tones as night falls. Under the cover of darkness, it becomes a velvet-black expanse adorned with twinkling stars and the silvery glow of the moon, offering a sense of wonder and mystery. The sky is ever-changing, a reflection of the world's moods and an eternal reminder of nature's boundless beauty.`,
  }),
  TheSky3: new ItemType({
    id: 10,
    key: 10,
    name: `The Sky`,
    listID: `4-listColumn-new`,
    // image: defaultImages.sky,
    backgroundColor: colors.navy,
    summary: `The sky is a vast, expansive canvas that stretches endlessly above, painted with a palette that shifts throughout the day.`,
    description: `At dawn, it awakens with soft hues of pink, orange, and lavender, gradually brightening into a radiant blue as the sun ascends. During the day, it can appear as a brilliant azure dome, dotted with fluffy white clouds drifting lazily, or cloaked in dramatic shades of gray when storms approach. At dusk, the sky transforms again, showcasing fiery streaks of red, gold, and purple, fading into deeper tones as night falls. Under the cover of darkness, it becomes a velvet-black expanse adorned with twinkling stars and the silvery glow of the moon, offering a sense of wonder and mystery. The sky is ever-changing, a reflection of the world's moods and an eternal reminder of nature's boundless beauty.`,
  }),
}

export const defaultItems: ItemType[] = Object.values(itemObjects);

export const defaultColumns: ColumnType[] = [
  { 
    index: 1, 
    name: `Items`, 
    category: `To Do`,
    id: `1-listColumn-items`,
    items: [itemObjects.JellyFish, itemObjects.MotherNature,itemObjects.Singing ],
  }, 
  { 
    index: 2, 
    name: `Active`, 
    category: `Active`,
    id: `2-listColumn-active`,
    items: [itemObjects.Festivals],
  },
  { 
    index: 3, 
    name: `Complete`, 
    category: `Done`,
    id: `3-listColumn-complete`,
    items: [itemObjects.CleanEnergy, itemObjects.PlayingMusic, itemObjects.TheOutside],
  },
  { 
    index: 4, 
    name: `New`, 
    category: `New`,
    id: `4-listColumn-New`,
    items: [itemObjects.TheSky, itemObjects.TheSky2, itemObjects.TheSky3],
  },
]