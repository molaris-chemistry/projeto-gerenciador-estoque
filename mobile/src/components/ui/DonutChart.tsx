import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { Colors, Typography, Spacing, Radius } from "@/constants/theme";

export interface DonutChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutChartDataPoint[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSubLabel?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 160,
  strokeWidth = 28,
  centerLabel,
  centerSubLabel,
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  let cumulativePercent = 0;
  const segments = data.map((item, i) => {
    const color = item.color ?? Colors.chart[i % Colors.chart.length];
    const percent = total > 0 ? item.value / total : 0;
    const strokeDasharray = `${percent * circumference} ${(1 - percent) * circumference}`;
    const rotation = -90 + cumulativePercent * 360;
    cumulativePercent += percent;
    return { ...item, color, strokeDasharray, rotation };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={Colors.surfaceBorder}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {segments.map((seg, i) => (
            <G key={i} rotation={seg.rotation} origin={`${center}, ${center}`}>
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={seg.color}
                strokeWidth={strokeWidth - 4}
                fill="none"
                strokeDasharray={seg.strokeDasharray}
                strokeLinecap="butt"
              />
            </G>
          ))}
          {centerLabel && (
            <>
              <SvgText
                x={center}
                y={center - 4}
                textAnchor="middle"
                fill={Colors.textPrimary}
                fontSize={20}
                fontWeight="800"
              >
                {centerLabel}
              </SvgText>
              {centerSubLabel && (
                <SvgText
                  x={center}
                  y={center + 16}
                  textAnchor="middle"
                  fill={Colors.textSecondary}
                  fontSize={10}
                >
                  {centerSubLabel}
                </SvgText>
              )}
            </>
          )}
        </Svg>
      </Animated.View>

      <View style={styles.legend}>
        {segments.map((seg, i) => {
          const percent = total > 0 ? Math.round((seg.value / total) * 100) : 0;
          return (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
              <Text style={styles.legendLabel} numberOfLines={1}>
                {seg.label}
              </Text>
              <Text style={[styles.legendPercent, { color: seg.color }]}>{percent}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  legend: {
    width: '100%',
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    flexShrink: 0,
  },
  legendLabel: {
    flex: 1,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weight.medium,
  },
  legendPercent: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },
});
