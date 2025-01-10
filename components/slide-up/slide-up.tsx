
import { web } from '@/shared/variables';
import { boardStyles } from '../board/styles';
import ItemView from '../board/item/item-view';
import { SharedContext } from '@/shared/shared';
import React, { useContext, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

export default function SlideUp({ indx, onSheetChange, closeBottomSheet }: any) {
    let { selected } = useContext<any>(SharedContext);
    const [snapPoints] = useState([`1%`, `85%`]);
    const bottomSheetRef = useRef<BottomSheet>(null);
    return (
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
            backgroundStyle={{ ...boardStyles.bottomSheetBackground, ...(selected != null && {backgroundColor: selected.backgroundColor}) }}
        >
            <BottomSheetView style={boardStyles.contentContainer}>
                <>
                    {selected != null ? <>
                        <ItemView isForm={true} selected={selected} />
                    </> : <></>}
                </>
            </BottomSheetView>
        </BottomSheet>
    )
}