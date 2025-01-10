import { SharedContext } from '@/shared/shared';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect } from 'react';
import { Text, View } from '@/components/theme/Themed';
import { Platform, StyleSheet } from 'react-native';

export default function ModalScreen({ children }: { children: React.ReactNode; }) {
  let { setModalOpen } = useContext<any>(SharedContext);

  useEffect(() => {
    setModalOpen(true);
    return () => setModalOpen(false);
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor={`#eee`} darkColor={`rgba(255,255,255,0.1)`} />
      <StatusBar style={Platform.OS === `ios` ? `dark` : `auto`} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})