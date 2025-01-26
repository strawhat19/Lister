import { colors } from '@/components/theme/Themed';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';

const SOUND_OF_SILENCE = ['hello', 'darkness', 'my', 'old', 'friend'];

export default function DragListComponent() {
  const [data, setData] = useState(SOUND_OF_SILENCE);

  function keyExtractor(str: string, _index: number) {
    return str;
  }

  function renderItem(info: DragListRenderItemInfo<string>) {
    const { item, onDragStart, onDragEnd, isActive } = info;

    return (
        <TouchableOpacity
            key={item}
            onPressOut={onDragEnd}
            onLongPress={onDragStart}
            style={{ flex: 1, width: `100%`, height: 35, justifyContent: `center`, alignItems: `center`, backgroundColor: colors.black, opacity: isActive ? 0.5 : 1 }}
        >
            <Text style={{ color: colors.white, textAlign: `center`, fontSize: 22 }}>
                {item}
            </Text>
        </TouchableOpacity>
    );
  }

  async function onReordered(fromIndex: number, toIndex: number) {
    const copy = [...data];
    const removed = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, removed[0]);
    setData(copy);
  }

  return (
    <View style={{ flex: 1, width: `100%`, height: `100%`, justifyContent: `center`, alignItems: `center`, paddingTop: 100, backgroundColor: colors.black }}>
      <DragList
        data={data}
        renderItem={renderItem}
        onReordered={onReordered}
        keyExtractor={keyExtractor}
        onDragEnd={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
        onDragBegin={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
        onHoverChanged={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
        contentContainerStyle={{ gap: 3, width: `100%`, backgroundColor: colors.black }}
      />
    </View>
  );
}