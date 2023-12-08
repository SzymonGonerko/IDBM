import React, { useEffect, useState } from 'react';
import { useSpring } from '@react-spring/three';
import { CustomRoundedBox } from './CustomRoundedBox.js';
import { Text, Mask } from '@react-three/drei';
import playBold from '../../assets/fonts/Play-Bold.ttf';
import { a } from '@react-spring/three';

export const PortalList = ({ data, setParentData, position, searchMovie }) => {
  const [jj, setJj] = useState(-10);
  const [boxPosition, setBoxPosition] = useState([]);

  const { x_coordinate } = useSpring({
    x_coordinate: jj,
    config: { tension: 150, friction: 100, precision: 0.00001 }
  });
  const shift = x_coordinate.to([0, 1], [0, 1]);

  const onWheel = (e) => {
    if (e.deltaY < 0) {
      setJj((p) => {
        return p - 1;
        if (p <= -3) return p;
        else {
        }
      });
    } else {
      setJj((p) => {
        return p + 1;
        if (p >= 2) return p;
        else {
        }
      });
    }
  };

  useEffect(() => {
    if (data.length <= 0) return () => null;
    const arr = [];
    for (let i = 0; i < data.length / 3; i++) {
      for (let j = 0.4; j >= -0.4; j = j - 0.4) {
        arr.push([i * 3.2, j, 0.3]);
      }
    }
    const newArr = data.map((_, i) => arr[i]);

    let top = 0;
    let middle = 0;
    let down = 0;
    for (let i = newArr.length - 1; i >= 0; i--) {
      let curr = data[i]?.item.length;
      let prev = data[i - 3]?.item.length;
      if (newArr[i][1] == 0.4) {
        arr[i][0] += top;
        if (curr > 20 && prev < 20) top += 0.5;
        if (curr <= 20 && prev <= 20) top += 1;
        if (curr < 20 && prev > 20) top += 0.5;
      }
      if (newArr[i][1] == 0) {
        arr[i][0] += middle;
        if (curr > 20 && prev < 20) middle += 0.5;
        if (curr <= 20 && prev <= 20) middle += 1;
        if (curr < 20 && prev > 20) middle += 0.5;
      }
      if (newArr[i][1] == -0.4) {
        arr[i][0] += down;
        if (curr > 20 && prev < 20) down += 0.5;
        if (curr <= 20 && prev <= 20) down += 1;
        if (curr < 20 && prev > 20) down += 0.5;
      }
    }
    let middleX = -(newArr[0][0] + newArr[newArr.length - 1][0]) / 2;
    searchMovie ? setJj(middleX) : null;

    setBoxPosition(newArr);
    document.addEventListener('mousewheel', onWheel);
    return () => document.removeEventListener('mousewheel', onWheel);
  }, [data]);

  const handleClick = (event, i) => {
    event.stopPropagation();
    if (searchMovie !== undefined) {
      return searchMovie(data[i].item);
    }
    setParentData((p) => {
      const [...arr] = p;
      arr[i].isSelected = !arr[i].isSelected;
      return arr;
    });
  };

  return (
    <>
      <group position={position}>
        <mesh position={[0, 0, 0]}>
          <Mask id={1} colorWrite={true} position={[0, 0, 0]}>
            <boxGeometry args={[4.95, 2, 0.2]} />
            <meshStandardMaterial color={[0.05, 0.05, 0.05]} />
          </Mask>
          <mesh position={[0, 0, 0]} scale={1}>
            <a.group position={[0, 0.1, 0]} position-x={shift}>
              {boxPosition.length > 0 &&
                data?.map((el, i) => {
                  return (
                    <CustomRoundedBox
                      key={i}
                      color={[0.06, 0.06, 0.06]}
                      args={[el.item.length > 20 ? 3 : 2, 0.28, 0.2]}
                      position={boxPosition[i]}
                      onClick={(e) => handleClick(e, i)}
                      isSelected={data[i]?.isSelected}
                      portal
                      onHover
                    >
                      <Text
                        color={'black'}
                        font={playBold}
                        position={[0, 0, 0.11]}
                        fontSize={0.19}
                        letterSpacing={-0.06}
                      >
                        {(el?.item).substring(0, 30).trim()}
                        {el?.item.length > 30 && '...'}
                      </Text>
                    </CustomRoundedBox>
                  );
                })}
            </a.group>
          </mesh>
        </mesh>
      </group>
    </>
  );
};
