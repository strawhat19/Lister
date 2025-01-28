
import { BlurView } from 'expo-blur';
import { Animated } from 'react-native';
import { web } from '@/shared/variables';
import { colors } from '../theme/Themed';
import { boardStyles } from '../board/styles';
import ItemView from '../board/item/item-view';
import { SharedContext } from '@/shared/shared';
import React, { useContext, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

export const defaultSlideUpHeight = `90%`;

export default function SlideUp({ maxHeight = defaultSlideUpHeight, backgroundColor = colors.transparent }: any) {
    let { indx, selected, onSheetChange, closeBottomSheet, selectedColor, colorPickerOpen, blurBGContainerOpacity } = useContext<any>(SharedContext);

    const [blur,] = useState<any>(0);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [snapPoints, ] = useState([`1%`, maxHeight]);

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
                enablePanDownToClose={true} // Only enable drag to close on mobile
                handleIndicatorStyle={[boardStyles.handleStyle, { backgroundColor: selected == null ? colors.transparent : colors.mainBG }]} // Hide handle on web
                backgroundStyle={{ 
                    ...boardStyles.bottomSheetBackground, 
                    ...(selected != null && { backgroundColor: colorPickerOpen ? selectedColor : (selected.backgroundColor ? selected.backgroundColor : backgroundColor) }), 
                }}
            >
                <BottomSheetView style={boardStyles.contentContainer}>
                    <>
                        {selected != null ? <>
                            <ItemView />
                        </> : <></>}
                    </>
                </BottomSheetView>
            </BottomSheet>
        </>
    )
}