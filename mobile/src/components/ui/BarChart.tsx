import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing, Radius } from "@/constants/theme";

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
  unit?: string;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  maxValue?: number;
  barHeight?: number;
  gap?: number;
  showValues?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  maxValue,
  barHeight = 28,
  gap = 12,
  showValues = true,
}) => {
  const max = maxValue ?? Math.max(...data.map(d => d.value), 1);
  const BAR_AREA_WIDTH = 180;

  const animatedWidths = useRef(data.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animatedWidths.map((anim, i) =>
      Animated.timing(anim, {
        toValue: (data[i].value / max) * BAR_AREA_WIDTH,
        duration: 700 + i * 60,
        delay: i * 40,
        useNativeDriver: false,
      }),
    );
    Animated.parallel(animations).start();
  }, [data]);

  return (
    <View style={styles.container}>
      {data.map((item, i) => {
        const color = item.color ?? Colors.chart[i % Colors.chart.length];

        return (
          <View key={i} style={[styles.row, { height: barHeight + gap }]}>
            <Text numberOfLines={1} style={styles.label}>
              {item.label}
            </Text>

            <View style={styles.barWrapper}>
              <View style={[styles.track, { height: barHeight }]} />
              <Animated.View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    width: animatedWidths[i],
                    backgroundColor: color,
                    shadowColor: color,
                  },
                ]}
              />
            </View>

            {showValues && (
              <Text style={[styles.valueText, { color }]}>
                {item.value % 1 === 0 ? item.value : item.value.toFixed(1)}
                {item.unit ? ` ${item.unit}` : ''}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  label: {
    width: 110,
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
    textAlign: 'right',
  },
  barWrapper: {
    flex: 1,
    height: 28,
    position: 'relative',
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceBorder,
    borderRadius: Radius.full,
  },
  bar: {
    position: 'absolute',
    left: 0,
    borderRadius: Radius.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  valueText: {
    width: 54,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.bold,
    textAlign: 'left',
  },
});
