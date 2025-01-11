import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { View } from '@/components/theme/Themed';
import { paginationHeightMargin } from '@/shared/variables';
import { Pagination } from 'react-native-reanimated-carousel';

export default function SliderPagination({ progress, carouselRef }: any) {
    let { carouselData } = useContext<any>(SharedContext);

    const onPressPagination = (index: number) => {
        carouselRef.current?.scrollTo({
          count: index - progress.value,
          animated: true,
        });
    }

    return (
        <View style={{ flex: 1, width: `100%`, marginTop: -1 * (paginationHeightMargin - 55), pointerEvents: `none` }}>
            <Pagination.Basic
                size={8}
                data={carouselData}
                progress={progress}
                onPress={onPressPagination}
                containerStyle={{ gap: 10, }}
                activeDotStyle={{ backgroundColor: `#fff` }}
                dotStyle={{ backgroundColor: `rgba(255, 255, 255, 0.5)`, borderRadius: 40 }}
            />
        </View>
    )
}