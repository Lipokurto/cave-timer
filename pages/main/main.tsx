import React from 'react';
import DatePicker from 'react-native-date-picker';
import * as Progress from 'react-native-progress';

import {
  Button,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import WoodBG from '../../utils/woodBG';
import bgPaper from '../../assets/cave/paper.png';
import buttonImg from '../../assets/cave/buttons/button.png';
import greenTitle from '../../assets/cave/title/green.png';
import redTitle from '../../assets/cave/title/red.png';
import clearIcon from '../../assets/cave/reload/clearIcon.png';
import flag from '../../assets/cave/reload/flag.png';
import { resolvePath } from '../../utils/resolve-path';

type Time = { hh: number; mm: number };
type Container = {
  status: Status;
  loader: number;
};

type Status = 'empty' | 'working' | 'last';

type Cave = {
  name: string;
  status: Status;
  startTime: Time;
  endTime: Time;
  restTime: Time;
  cooldown: Time;
  progress: number;
  containers: Container[];
};

type ActiveElement =
  | 'startTime'
  | 'cooldown'
  | 'c-01'
  | 'c-02'
  | 'c-03'
  | 'c-04'
  | 'c-05'
  | 'c-06';

const cave: Cave = {
  name: '',
  status: 'empty',
  startTime: { hh: 0, mm: 0 },
  endTime: { hh: 0, mm: 0 },
  cooldown: { hh: 1, mm: 0 },
  restTime: { hh: 6, mm: 0 },
  progress: 0,
  containers: [
    {
      status: 'empty',
      loader: 0,
    },
    {
      status: 'empty',
      loader: 0,
    },
    {
      status: 'empty',
      loader: 0,
    },
    {
      status: 'empty',
      loader: 0,
    },
    {
      status: 'empty',
      loader: 0,
    },
    {
      status: 'empty',
      loader: 0,
    },
  ],
};

function formatTime(date: Date): Time {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return { hh: hours, mm: minutes };
}

function timeToString(time: Time): string {
  const hh = time.hh.toString().padStart(2, '0');
  const mm = time.mm.toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

function getEndTimeByCooldown(time: Time): Time {
  const hhToMinutes = time.hh * 60;
  const startMinutes = hhToMinutes + time.mm;
  const allTime = startMinutes * 6;
  const hh = Math.floor(allTime / 60);
  const mm = allTime % 60;
  return { hh, mm };
}

function getRestTime(currentTime: Time, endTime: Time): Time {
  const currentTimeToMinutes = currentTime.hh * 60 + currentTime.mm;
  const endTimeToMinutes = endTime.hh * 60 + endTime.mm;
  const restTimeInMinutes = endTimeToMinutes - currentTimeToMinutes;
  const hh = Math.floor(restTimeInMinutes / 60);
  const mm = restTimeInMinutes % 60;
  return { hh, mm };
}

export default function Main(): JSX.Element {
  const [date, setDate] = React.useState<Time>({ hh: 0, mm: 0 });
  const [open, setOpen] = React.useState(false);
  const [caves, setCaves] = React.useState<Cave[]>(
    Array(4)
      .fill(cave)
      .map((e: Cave, i) => ({ ...e, name: `${i + 1}` })),
  );
  const [currentCave, setCurrentCave] = React.useState<string>('');
  const [activeElement, setActiveElement] =
    React.useState<ActiveElement>('startTime');

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      setDate(formatTime(currentDate));

      const currentCaves: Cave[] = caves?.map(e => {
        const currentProgressMinutes =
          (e.endTime.hh - e.startTime.hh) * 60 +
          (e.endTime.mm - e.startTime.mm);

        const currentTimeMinutes =
          (formatTime(currentDate).hh - e.startTime.hh) * 60 +
          (formatTime(currentDate).mm - e.startTime.mm);

        const currentProgress = currentTimeMinutes / currentProgressMinutes;
        const progress = currentProgress !== Infinity ? currentProgress : 0;
        return {
          ...e,
          progress: progress >= 1 ? 0 : progress,
          status: progress === 0 || progress >= 1 ? 'empty' : 'working',
          restTime:
            progress === 0 || progress >= 1
              ? { hh: 0, mm: 0 }
              : {
                  hh: getRestTime(formatTime(currentDate), e.endTime).hh,
                  mm: getRestTime(formatTime(currentDate), e.endTime).mm,
                },
        };
      });
      setCaves(currentCaves);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [caves]);

  const reloadTimers = React.useCallback(() => {
    setCaves(
      Array(4)
        .fill(cave)
        .map((e: Cave, i) => ({ ...e, name: `${i + 1}` })),
    );
  }, []);

  const handleModalOpenChange = React.useCallback(
    (name: string, element: ActiveElement) => {
      setCurrentCave(name);
      setActiveElement(element);
      setOpen(!open);
    },
    [open],
  );

  const handleTimeConfirm = React.useCallback(
    (start: Date) => {
      const currentCaves = caves?.map(e => {
        if (e.name === currentCave) {
          if (activeElement === 'startTime') {
            const currentEndTime = {
              hh: formatTime(start).hh + e.cooldown.hh * 6,
              mm: formatTime(start).mm + e.cooldown.mm,
            };

            const currentProgressMinutes =
              (currentEndTime.hh - formatTime(start).hh) * 60 +
              (currentEndTime.mm - formatTime(start).mm);

            const currentTimeMinutes =
              (date.hh - formatTime(start).hh) * 60 +
              (date.mm - formatTime(start).mm);
            return {
              ...e,
              startTime: formatTime(start),
              endTime: currentEndTime,
              progress: currentTimeMinutes / currentProgressMinutes,
            };
          }

          if (activeElement === 'cooldown') {
            const currentEndTime = {
              hh: e.startTime.hh + getEndTimeByCooldown(formatTime(start)).hh,
              mm: e.startTime.mm + getEndTimeByCooldown(formatTime(start)).mm,
            };

            const currentProgressMinutes =
              (currentEndTime.hh - e.startTime.hh) * 60 +
              (currentEndTime.mm - e.startTime.mm);

            const currentTimeMinutes =
              (date.hh - e.startTime.hh) * 60 + (date.mm - e.startTime.mm);
            return {
              ...e,
              cooldown: formatTime(start),
              endTime: currentEndTime,
              progress: currentTimeMinutes / currentProgressMinutes,
            };
          }
        }

        return e;
      });
      setCaves(currentCaves);
    },
    [activeElement, caves, currentCave, date],
  );

  const caveItem = React.useCallback(
    (item: Cave) => {
      const isFirstStart = item.startTime.hh === 0 && item.startTime.mm === 0;
      return (
        <ImageBackground
          key={item.name}
          source={{ uri: resolvePath(bgPaper) }}
          resizeMode="stretch"
          style={style.item}>
          <ImageBackground
            style={{ height: 50 }}
            source={{
              uri: resolvePath(item.status === 'empty' ? redTitle : greenTitle),
            }}
            resizeMode="center"
            // eslint-disable-next-line react-native/no-inline-styles
            imageStyle={{
              width: 125,
              marginTop: -2,
              marginLeft: -59,
            }}>
            <Text style={style.titleItem}>{item.name}</Text>
          </ImageBackground>

          <TouchableOpacity
            style={style.bgButton}
            onPress={() => handleModalOpenChange(item.name, 'startTime')}>
            <ImageBackground
              source={{ uri: resolvePath(buttonImg) }}
              resizeMode="stretch"
              // eslint-disable-next-line react-native/no-inline-styles
              imageStyle={{
                width: 100,
                height: 30,
              }}>
              <Text style={style.buttonText}>
                {isFirstStart ? 'start' : `st: ${timeToString(item.startTime)}`}
              </Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            style={style.bgButton}
            onPress={() => handleModalOpenChange(item.name, 'cooldown')}>
            <ImageBackground
              source={{ uri: resolvePath(buttonImg) }}
              resizeMode="stretch"
              // eslint-disable-next-line react-native/no-inline-styles
              imageStyle={{
                width: 100,
                height: 30,
              }}>
              <Text style={style.buttonText}>
                {`cd: ${timeToString(item.cooldown)}`}
              </Text>
            </ImageBackground>
          </TouchableOpacity>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={style.description}>
              {isFirstStart ? 'end /' : `e: ${timeToString(item.endTime)}  `}
            </Text>

            <Text style={style.description}>
              {isFirstStart ? 'rest' : `r: ${timeToString(item.restTime)}`}
            </Text>
          </View>

          <View style={style.progress}>
            <Text style={style.description}>
              {`${(item.progress * 100).toFixed(0)}%`}
            </Text>
            <Progress.Bar
              progress={item.progress}
              width={80}
              height={20}
              animated
              unfilledColor={item.status === 'working' ? '#FFFFFF' : 'coral'}
              borderRadius={10}
              color={item.status === 'working' ? 'green' : 'coral'}
            />
          </View>
        </ImageBackground>
      );
    },
    [handleModalOpenChange],
  );

  const renderTime = React.useMemo(() => {
    const dateTimer = new Date();
    if (activeElement === 'startTime') {
      return dateTimer;
    }

    dateTimer.setHours(1, 0, 0, 0);
    return dateTimer;
  }, [activeElement]);

  return (
    <>
      <WoodBG>
        <View>
          <View style={style.timeContainer}>
            <TouchableOpacity style={style.reload} onPress={reloadTimers}>
              <ImageBackground
                source={{ uri: resolvePath(flag) }}
                resizeMode="center"
                // eslint-disable-next-line react-native/no-inline-styles
                imageStyle={{
                  width: 100,
                  height: 75,
                }}>
                <Image
                  source={{
                    height: 30,
                    width: 30,
                    uri: resolvePath(clearIcon),
                  }}
                  style={{ marginLeft: 35, marginTop: 15 }}
                />
              </ImageBackground>
            </TouchableOpacity>

            {/* <Button title="reload" onPress={reloadTimers} /> */}
            <Text style={style.time}>{timeToString(date)}</Text>
          </View>
          <FlatList
            data={caves}
            contentContainerStyle={style.container}
            renderItem={({ item }) => caveItem(item)}
          />
        </View>
      </WoodBG>

      <DatePicker
        date={renderTime}
        modal
        open={open}
        locale="en_GB"
        mode="time"
        is24hourSource="locale"
        onConfirm={handleTimeConfirm}
        onCancel={() => setOpen(!open)}
      />
    </>
  );
}

const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 5,
  },
  item: {
    height: 200,
    width: 150,
    alignItems: 'center',
  },
  titleItem: {
    fontSize: 35,
    textAlign: 'center',
    fontFamily: 'mr_ReaverockG',
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowRadius: 10,
  },
  time: {
    fontSize: 72,
    fontFamily: 'mr_ReaverockG',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'mr_ReaverockG',
  },
  progress: {
    padding: 3,
    borderRadius: 5,
  },
  buttonText: {
    marginTop: 3,
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#FFFFFF',
    fontFamily: 'mr_ReaverockG',
    textShadowColor: '#000000',
    textShadowRadius: 10,
  },
  bgButton: { width: 100, height: 30 },
  statusRed: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'mr_ReaverockG',
    textShadowColor: '#FFFFFF',
    textShadowRadius: 10,
  },
  statusGreen: {
    color: 'green',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'mr_ReaverockG',
    textShadowColor: '#FFFFFF',
    textShadowRadius: 10,
  },
  reload: {
    width: 100,
    height: 70,
  },
  timeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
