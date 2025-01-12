import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { colors, View } from '@/components/theme/Themed';
import { paginationHeightMargin } from '@/shared/variables';
import { Pagination } from 'react-native-reanimated-carousel';

export default function SliderPagination({ carouselRef, backgroundColor = colors.mainBG }: any) {
    let { selected, progress, carouselData } = useContext<any>(SharedContext);

    const onPressPagination = (index: number) => {
        carouselRef.current?.scrollTo({
          count: index - progress.value,
          animated: true,
        });
    }

    return (
        <View style={{ flex: 1, opacity: selected == null ? 1 : 0, backgroundColor: colors.transparent, width: `100%`, marginTop: -1 * (paginationHeightMargin - 130), pointerEvents: `none` }}>
            <Pagination.Basic
                size={8}
                data={carouselData}
                progress={progress}
                onPress={onPressPagination}
                containerStyle={{ gap: 10, }}
                activeDotStyle={{ backgroundColor: `#ffffff` }}
                dotStyle={{ backgroundColor: `rgba(255, 255, 255, 0.5)`, borderRadius: 40 }}
            />
        </View>
    )
}