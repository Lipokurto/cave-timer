import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';

import buttWood from '../../assets/timer/button.png';
import healIcon from '../../assets/timer/icons/heal.png';
import repairIcon from '../../assets/timer/icons/repair.png';
import heavyIcon from '../../assets/timer/icons/heavy.png';
import deadIcon from '../../assets/timer/icons/scull.png';
import planIcon from '../../assets/timer/icons/mine.png';
import tradeIcon from '../../assets/timer/icons/trade.png';

import WoodBG from '../../utils/woodBG';
import { resolvePath } from '../../utils/resolve-path';

const timers = [
  { type: 'heal', name: 'Лечение', time: [0, 15, 0], icon: healIcon },
  { type: 'repair', name: 'Ремонт', time: [0, 15, 0], icon: repairIcon },
  { type: 'heavy', name: 'Тяж. ранение', time: [0, 15, 0], icon: heavyIcon },
  { type: 'dead', name: 'Мертвяк', time: [2, 0, 0], icon: deadIcon },
  { type: 'plan', name: 'План работ', time: [2, 0, 0], icon: planIcon },
  { type: 'trade', name: 'Снабжение', time: [2, 0, 0], icon: tradeIcon },
];

export default function MyTime({ navigation }: any): JSX.Element {
  const renderButtons = React.useMemo(
    () =>
      timers.map(e => {
        return (
          <ImageBackground
            source={{ uri: resolvePath(buttWood) }}
            resizeMode="stretch"
            // eslint-disable-next-line react-native/no-inline-styles
            imageStyle={{
              width: 140,
              height: 105,
            }}
            style={style.item}
            key={e.name}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MyTimer', {
                  params: {
                    timer: e.time,
                    type: e.type,
                  },
                })
              }>
              <Image
                source={{
                  height: 50,
                  width: 50,
                  uri: resolvePath(e.icon),
                }}
                style={style.icon}
              />

              <Text
                style={[
                  style.text,
                  // eslint-disable-next-line react-native/no-inline-styles
                  { fontSize: e.type === 'heavy' ? 24 : 26 },
                ]}>
                {e.name}
              </Text>
            </TouchableOpacity>
          </ImageBackground>
        );
      }),
    [navigation],
  );

  return (
    <WoodBG>
      <View style={style.container}>{renderButtons}</View>
    </WoodBG>
  );
}

const style = StyleSheet.create({
  container: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 5,
  },
  icon: {
    alignSelf: 'center',
    height: 60,
    width: 60,
  },
  item: {
    height: 105,
    width: 140,
    display: 'flex',
    flexDirection: 'column',
    margin: '2%',
  },
  text: {
    marginTop: -7,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#000000',
    fontFamily: 'mr_ReaverockG',
    textShadowColor: '#ffffff',
    textShadowRadius: 10,
  },
});
