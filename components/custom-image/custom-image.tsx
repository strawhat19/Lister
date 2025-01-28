import { Image, Platform } from 'react-native';
import { defaultImages } from '@/shared/database';
import { CustomImageType } from '@/shared/types/types';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function CustomImage({
    style,
    source,
    width = 750,
    height = 1260,
    effect = `blur`,
    onLoad = () => {},
    onError = () => {},
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
                onLoad={onLoad}
                onError={onError}
                className={className} 
            />
        ) : (
            Object.values(defaultImages).includes(src) ? (
                <Image id={id} alt={alt} source={src} style={style} onLoad={onLoad} onError={onError} />
            ) : (
                <Image id={id} alt={alt} src={src} source={src} style={style} onLoad={onLoad} onError={onError} />
            )
        )
    )
}