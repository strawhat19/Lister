import { Image, Platform } from 'react-native';
import { CustomImageType } from '@/shared/types/types';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function CustomImage({
    style,
    source,
    width = 750,
    height = 1260,
    effect = `blur`,
    id = `customImage`,
    useReactLazyLoadOnMobile = false,
    className = `customImageClassName`,
    alt = Platform.OS == `web` ? `Image` : `Mobile Image`,
}: CustomImageType | any) {
    let src = source?.uri ? source.uri : source;
    return (
        (useReactLazyLoadOnMobile || Platform.OS == `web`) ? (
            <LazyLoadImage 
                id={id} 
                alt={alt} 
                src={src} 
                style={style}
                width={width}
                height={height} 
                effect={effect} 
                className={className} 
            />
        ) : <Image id={id} alt={alt} source={source} style={style} />
    )
}