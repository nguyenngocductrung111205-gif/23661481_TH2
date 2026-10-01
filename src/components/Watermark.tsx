import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { STUDENT, VARIANT, examStamp } from '@constants/student';
import { THEME } from '@constants/theme';

export const Watermark: React.FC = () => {
  const stamp = examStamp();
  const text = `TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${stamp}`;

  return (
    <View
      style={[
        styles.container,
        VARIANT.watermarkAtTop ? styles.positionTop : styles.positionBottom,
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.border,
    zIndex: 999,
  },
  positionTop: {
    // placed at top of screen
  },
  positionBottom: {
    // placed at bottom of screen
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.text,
    letterSpacing: 0.5,
  },
});

export default Watermark;
