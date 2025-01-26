import React, { useContext } from 'react';
import { SharedContext } from '@/shared/shared';
import { colors, View } from '@/components/theme/Themed';
import { Pagination } from 'react-native-reanimated-carousel';
import { paginationHeightMargin, paginationSize } from '@/shared/variables';

export default function SliderPagination({ carouselRef }: any) {
    let { selected, progress, boardColumns } = useContext<any>(SharedContext);

    const onPressPagination = (index: number) => {
        carouselRef.current?.scrollTo({
          count: index - progress.value,
          animated: true,
        });
    }

    return (
        <View style={{ 
            flex: 1, 
            width: `100%`, 
            pointerEvents: `none`, 
            opacity: selected == null ? 1 : 0, 
            backgroundColor: colors.transparent, 
            marginTop: -1 * (paginationHeightMargin - 112), 
        }}>
            <Pagination.Basic
                data={boardColumns}
                progress={progress}
                size={paginationSize}
                onPress={onPressPagination}
                containerStyle={{ gap: 10 }}
                activeDotStyle={{ backgroundColor: colors.active }}
                dotStyle={{ backgroundColor: colors.disabled, borderRadius: 40 }}
            />
        </View>
    )
}