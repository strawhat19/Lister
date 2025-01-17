import { Text, TextProps, fontFamily } from './Themed';


export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily }]} />;
}