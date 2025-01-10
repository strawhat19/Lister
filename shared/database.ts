import { ItemType } from './types/types';
import { 
    colors,
    vertImages, 
    defaultDarkTabBorderColor, 
} from '@/components/theme/Themed';

export const defaultVertImageCards: ItemType[] = [
    new ItemType({
        id: 1,
        key: 1,
        name: `Jelly Fish`,
        fontColor: `white`,
        image: vertImages.jelly_fish,
        listID: `1-listColumn-items`,
        backgroundColor: colors.appleGreen,
        summary: `Discover the mesmerizing beauty of jellyfish as they drift gracefully in the ocean.`,
        description: `Discover the mesmerizing beauty of jellyfish as they drift gracefully in the ocean. This card celebrates the tranquility and elegance of marine life.`,
    }),
    new ItemType({
        id: 2,
        key: 2,
        name: `Mother Nature`,
        image: vertImages.hand_leaf,
        listID: `1-listColumn-items`,
        backgroundColor: colors.appleBlue,
        summary: `Immerse yourself in the nurturing embrace of nature.`,
        description: `Immerse yourself in the nurturing embrace of nature. This card reflects the harmony between humanity and the environment, symbolized by a delicate hand cradling a leaf. Immerse yourself in the nurturing embrace of nature. This card reflects the harmony between humanity and the environment, symbolized by a delicate hand cradling a leaf. Immerse yourself in the nurturing embrace of nature. This card reflects the harmony between humanity and the environment, symbolized by a delicate hand cradling a leaf. Immerse yourself in the nurturing embrace of nature. This card reflects the harmony between humanity and the environment, symbolized by a delicate hand cradling a leaf. Immerse yourself in the nurturing embrace of nature. This card reflects the harmony between humanity and the environment, symbolized by a delicate hand cradling a leaf. This card reflects the harmony between humanity and the environment, symbolized by a delicate hand cradling a leaf.`,
    }),
    new ItemType({
        id: 3,
        key: 3,
        name: `Playing Music`,
        listID: `2-listColumn-active`,
        backgroundColor: colors.appleRed,
        image: vertImages.playing_keyboard,
        summary: `Let the melody flow with the joy of playing music.`,
        description: `Let the melody flow with the joy of playing music. This card represents creativity and the universal language of music that brings people together.`,
    }),
    new ItemType({
        id: 4,
        key: 4,
        name: `Festivals`,
        image: vertImages.wind_flag,
        listID: `2-listColumn-active`,
        backgroundColor: colors.appleYellow,
        fontColor: defaultDarkTabBorderColor,
        summary: `Capture the spirit of celebration and unity in vibrant festivals.`,
        description: `Capture the spirit of celebration and unity in vibrant festivals. This card showcases the joy and cultural richness of festive occasions.`,
    }),
    new ItemType({
        id: 5,
        key: 5,
        name: `Clean Energy`,
        image: vertImages.wind_mills,
        listID: `3-listColumn-complete`,
        backgroundColor: colors.applePurple,
        summary: `Step into a sustainable future with clean energy.`,
        description: `Step into a sustainable future with clean energy. This card highlights the beauty and importance of renewable energy sources like wind power.`,
    }),
    new ItemType({
        id: 6,
        key: 6,
        name: `Singing`,
        listID: `3-listColumn-complete`,
        image: vertImages.singing_rockstar,
        backgroundColor: colors.appleGreenShade,
        summary: `Celebrate the power of vocal expression and the passion of singing.`,
        description: `Celebrate the power of vocal expression and the passion of singing. This card is a tribute to artists and performers who inspire through music.`,
    }),
    new ItemType({
        id: 7,
        key: 7,
        name: `The Outside`,
        listID: `3-listColumn-complete`,
        image: vertImages.wind_curtains,
        fontColor: defaultDarkTabBorderColor,
        backgroundColor: colors.appleGreenMint,
        summary: `Feel the refreshing breeze and freedom of the outdoors.`,
        description: `Feel the refreshing breeze and freedom of the outdoors. This card evokes a sense of openness and connection with nature's boundless beauty.`,
    }),
];