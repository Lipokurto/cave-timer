import React from 'react';

import { ImageBackground, StyleSheet } from 'react-native';

import scrollTexture from '../assets/hit_icons/scrollTexture.jpg';
import { resolvePath } from './resolve-path';

type Props = {
  children: JSX.Element;
};

export default function PaperBG({ children }: Props) {
  return (
    <ImageBackground
      source={{ uri: resolvePath(scrollTexture) }}
      resizeMode="stretch"
      style={style.image}>
      {children}
    </ImageBackground>
  );
}

const style = StyleSheet.create({
  image: {
    paddingBottom: '7.5%',
  },
});
