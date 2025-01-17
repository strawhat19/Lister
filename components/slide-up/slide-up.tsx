
import { BlurView } from 'expo-blur';
import { Animated } from 'react-native';
import { web } from '@/shared/variables';
import { colors } from '../theme/Themed';
import { boardStyles } from '../board/styles';
import ItemView from '../board/item/item-view';
import { SharedContext } from '@/shared/shared';
import React, { useContext, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

export default function SlideUp({ maxHeight = `90%`, backgroundColor = colors.mainBG }: any) {
    let { indx, selected, onSheetChange, closeBottomSheet, blurBGContainerOpacity } = useContext<any>(SharedContext);

    const [blur,] = useState<any>(0);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [snapPoints, setSnapPoints] = useState([`1%`, maxHeight]);

    return (
        <>
            <Animated.View 
                id={`blurBGContainer`} 
                style={[
                    boardStyles.absolute, 
                    { 
                        pointerEvents: `none`, 
                        opacity: blurBGContainerOpacity, 
                        ...(web() && { backgroundColor: colors.mainBG }), 
                    },
                ]}
            >
                {web() ? <></> : <BlurView id={`blurBG`} intensity={blur} tint={`dark`} style={boardStyles.absolute} />}
            </Animated.View>
            <BottomSheet
                index={indx}
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                onChange={onSheetChange}
                onClose={closeBottomSheet}
                enableHandlePanningGesture={!web()}
                enableContentPanningGesture={!web()}
                handleIndicatorStyle={boardStyles.handleStyle} // Hide handle on web
                enablePanDownToClose={true} // Only enable drag to close on mobile
                backgroundStyle={{ 
                    ...boardStyles.bottomSheetBackground, 
                    ...(selected != null && {backgroundColor: selected.backgroundColor ? selected.backgroundColor : backgroundColor }) 
                }}
            >
                <BottomSheetView style={boardStyles.contentContainer}>
                    <>
                        {selected != null ? <>
                            <ItemView selected={selected} />
                        </> : <></>}
                    </>
                </BottomSheetView>
            </BottomSheet>
        </>
    )
}