import * as Haptics from 'expo-haptics';
import React, { memo, useContext, useState } from 'react';
import { colors } from '@/components/theme/Themed';
import { ListRenderItemInfo, Pressable, StyleSheet, Text } from 'react-native';
import ReorderableList, { ReorderableListReorderEvent, reorderItems, useReorderableDrag, useIsActive } from 'react-native-reorderable-list';
import { SharedContext } from '@/shared/shared';
import { ItemType } from '@/shared/types/types';

// interface CardProps { id: string; color: string; height: number; }

// const rand = () => Math.floor(Math.random() * 200);

// const seedData: CardProps[] = Array(20)
//   .fill(null)
//   .map((_, i) => ({
//     height: 35,
//     id: i.toString(),
//     color: `rgb(${rand()}, ${rand()}, ${rand()})`,
//   }));

const Card: React.FC<ItemType> = memo(({id, name, backgroundColor}) => {
  const isActive = useIsActive();
  const drag = useReorderableDrag();

  const activateDrag = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    drag();
  }

  return (
    <Pressable onLongPress={() => activateDrag()} style={[styles.card, { height: isActive ? 40 : 35, backgroundColor: backgroundColor, }]} >
      <Text style={[styles.text, { color: colors.white }]}>
        {name}
      </Text>
    </Pressable>
  );
});

const Reorderable = () => {
  const { items } = useContext<any>(SharedContext);
  const [data, setData] = useState(items);

  const handleReorder = ({from, to}: ReorderableListReorderEvent) => {
    setData(value => reorderItems(value, from, to));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const renderItem = ({item}: ListRenderItemInfo<ItemType>) => {
    delete item.key;
    return (
      <Card {...item} />
    )
  };

  return (
    <ReorderableList
      data={data}
      shouldUpdateActiveItem
      renderItem={renderItem}
      onReorder={handleReorder}
      keyExtractor={item => item.id}
      style={{ backgroundColor: colors.black }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderBottomWidth: 1,
    justifyContent: 'center',
    borderBottomColor: colors.black,
  },
  text: {
    fontSize: 20,
  },
});

export default Reorderable;