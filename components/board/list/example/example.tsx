import React, { Component } from 'react';
// import * as Haptics from 'expo-haptics';
import { View, TouchableOpacity, Text } from 'react-native'
import DraggableFlatList from 'react-native-draggable-dynamic-flatlist'

class Example extends Component {

  state = {
    data: [...Array(20)].map((d, index) => ({
      key: `item-${index}`,
      label: index,
      backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${index * 5}, ${132})`,
    }))
  }

  renderItem = ({ item, index, move, moveEnd, isActive }) => {
    return (
      <TouchableOpacity
        style={{ 
          height: 100, 
          backgroundColor: isActive ? 'blue' : item.backgroundColor,
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
        onLongPress={move}
        onPressOut={moveEnd}
      >
        <Text style={{ 
          fontWeight: 'bold', 
          color: 'white',
          fontSize: 32,
        }}>
          {item.label}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          scrollPercent={5}
          data={this.state.data}
          renderItem={this.renderItem}
          onMoveEnd={({ data }) => this.setState({ data })}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
        //   onPlaceHolderIndexChange={Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
        />
      </View>
    )
  }
}

export default Example