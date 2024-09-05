import { Image, ImageSourcePropType } from 'react-native';

export function resolvePath(src: ImageSourcePropType) {
  const resolvedImg = Image.resolveAssetSource(src).uri;
  return resolvedImg;
}
