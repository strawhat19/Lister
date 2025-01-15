import { colors } from '@/components/theme/Themed';
import { ColumnType, ItemType, Views, TaskType } from './types/types';

export const defaultCategories = {
  To_Do: `To Do`,
  Active: `Active`,
  Done: `Done`,
}

export const defaultListIDs = {
  listColumn_1_items: `listColumn_1_items`,
  listColumn_2_active: `listColumn_2_active`,
  listColumn_3_complete: `listColumn_3_complete`,
}

export const defaultTaskObjects = {
  One: new TaskType({id: `aeiou`, index: 1, name: `This is a test of how long a task can be`, type: Views.Task}), 
  Two: new TaskType({id: `bedce`, index: 2, name: `This is a test of how long a task can be 2`, type: Views.Task}), 
  Three: new TaskType({id: `zpaom`, index: 3, name: `Three`, type: Views.Task}), 
  Four: new TaskType({id: `ximci`, index: 4, name: `Four`, type: Views.Task}), 
  Five: new TaskType({id: `podad`, index: 5, name: `Five`, type: Views.Task}), 
  Six: new TaskType({id: `xmmdw`, index: 6, name: `Six`, type: Views.Task}),
}

export const defaultTasks: TaskType[] = Object.values(defaultTaskObjects);

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
    type: Views.Item,
    name: `Jelly Fish`,
    tasks: defaultTasks,
    fontColor: colors.white,
    image: defaultImages.jelly_fish,
    backgroundColor: colors.appleGreen,
    listID: defaultListIDs.listColumn_1_items,
    summary: `Discover the mesmerizing beauty of jellyfish as they drift gracefully in the ocean.`,
    description: `Discover the mesmerizing beauty of jellyfish as they drift gracefully in the ocean. This card celebrates the tranquility and elegance of marine life.`,
  }),
  MotherNature: new ItemType({
    id: 2,
    key: 2,
    type: Views.Item,
    tasks: defaultTasks,
    name: `Mother Nature`,
    image: defaultImages.hand_leaf,
    backgroundColor: colors.appleBlue,
    listID: defaultListIDs.listColumn_1_items,
    summary: `Immerse yourself in the nurturing embrace of nature.`,
    description: `Immerse yourself in the nurturing embrace of nature. This card reflects the harmony between humanity and the environment, symbolized by a delicate hand cradling a leaf. Immerse yourself in the nurturing embrace of nature. This card reflects the harmony between humanity and the environment. Immerse yourself in the nurturing embrace of nature. This card reflects the harmony between humanity and the environment.`,
  }),
  PlayingMusic: new ItemType({
    id: 3,
    key: 3,
    type: Views.Item,
    tasks: defaultTasks,
    name: `Playing Music`,
    backgroundColor: colors.appleRed,
    image: defaultImages.playing_keyboard,
    listID: defaultListIDs.listColumn_2_active,
    summary: `Let the melody flow with the joy of playing music.`,
    description: `Let the melody flow with the joy of playing music. This card represents creativity and the universal language of music that brings people together.`,
  }),
  Festivals: new ItemType({
    id: 4,
    key: 4,
    type: Views.Item,
    name: `Festivals`,
    tasks: defaultTasks,
    fontColor: colors.dark,
    image: defaultImages.wind_flag,
    backgroundColor: colors.appleYellow,
    listID: defaultListIDs.listColumn_2_active,
    summary: `Capture the spirit of celebration and unity in vibrant festivals.`,
    description: `Capture the spirit of celebration and unity in vibrant festivals. This card showcases the joy and cultural richness of festive occasions.`,
  }),
  CleanEnergy: new ItemType({
    id: 5,
    key: 5,
    type: Views.Item,
    tasks: defaultTasks,
    name: `Clean Energy`,
    image: defaultImages.wind_mills,
    backgroundColor: colors.applePurple,
    listID: defaultListIDs.listColumn_3_complete,
    summary: `Step into a sustainable future with clean energy.`,
    description: `Step into a sustainable future with clean energy. This card highlights the beauty and importance of renewable energy sources like wind power.`,
  }),
  Singing: new ItemType({
    id: 6,
    key: 6,
    name: `Singing`,
    type: Views.Item,
    tasks: defaultTasks,
    image: defaultImages.singing_rockstar,
    backgroundColor: colors.appleGreenShade,
    listID: defaultListIDs.listColumn_3_complete,
    summary: `Celebrate the power of vocal expression and the passion of singing.`,
    description: `Celebrate the power of vocal expression and the passion of singing. This card is a tribute to artists and performers who inspire through music.`,
  }),
  TheOutside: new ItemType({
    id: 7,
    key: 7,
    type: Views.Item,
    tasks: defaultTasks,
    name: `The Outside`,
    fontColor: colors.dark,
    image: defaultImages.wind_curtains,
    backgroundColor: colors.appleGreenMint,
    listID: defaultListIDs.listColumn_3_complete,
    summary: `Feel the refreshing breeze and freedom of the outdoors.`,
    description: `Feel the refreshing breeze and freedom of the outdoors. This card evokes a sense of openness and connection with nature's boundless beauty.`,
  }),
  TheSky: new ItemType({
    id: 8,
    key: 8,
    name: `The Sky`,
    type: Views.Item,
    tasks: defaultTasks,
    image: defaultImages.sky,
    backgroundColor: colors.navy,
    listID: defaultListIDs.listColumn_3_complete,
    summary: `The sky is a vast, expansive canvas that stretches endlessly above, painted with a palette that shifts throughout the day.`,
    description: `At dawn, it awakens with soft hues of pink, orange, and lavender, gradually brightening into a radiant blue as the sun ascends. During the day, it can appear as a brilliant azure dome, dotted with fluffy white clouds drifting lazily, or cloaked in dramatic shades of gray when storms approach. At dusk, the sky transforms again, showcasing fiery streaks of red, gold, and purple, fading into deeper tones as night falls. Under the cover of darkness, it becomes a velvet-black expanse adorned with twinkling stars and the silvery glow of the moon, offering a sense of wonder and mystery. The sky is ever-changing, a reflection of the world's moods and an eternal reminder of nature's boundless beauty.`,
  }),
}

export const defaultItems: ItemType[] = Object.values(itemObjects);

export const defaultColumns: ColumnType[] = [
  { 
    index: 1, 
    name: `Items`, 
    type: Views.Column,
    category: defaultCategories.To_Do,
    id: defaultListIDs.listColumn_1_items,
    listID: defaultListIDs.listColumn_1_items,
    items: [itemObjects.JellyFish, itemObjects.MotherNature],
  }, 
  { 
    index: 2, 
    name: `Active`, 
    type: Views.Column,
    category: defaultCategories.Active,
    id: defaultListIDs.listColumn_2_active,
    listID: defaultListIDs.listColumn_2_active,
    items: [itemObjects.Festivals, itemObjects.PlayingMusic],
  },
  { 
    index: 3, 
    name: `Complete`, 
    type: Views.Column,
    category: defaultCategories.Done,
    id: defaultListIDs.listColumn_3_complete,
    listID: defaultListIDs.listColumn_3_complete,
    items: [itemObjects.CleanEnergy, itemObjects.TheOutside, itemObjects.Singing, itemObjects.TheSky],
  },
]