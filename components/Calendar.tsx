import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface CalendarProps {
  onSelectDate: (date: Date) => void;
  startDate: Date | null;
  endDate: Date | null;
  minDate?: Date;
  maxDate?: Date;
}

export default function Calendar({ 
  onSelectDate, 
  startDate, 
  endDate, 
  minDate = new Date(),
  maxDate 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };
  
  const isDateInRange = (date: Date) => {
    if (startDate && endDate) {
      return date >= startDate && date <= endDate;
    }
    return false;
  };
  
  const isStartDate = (date: Date) => {
    if (!startDate) return false;
    return date.getDate() === startDate.getDate() && 
           date.getMonth() === startDate.getMonth() && 
           date.getFullYear() === startDate.getFullYear();
  };
  
  const isEndDate = (date: Date) => {
    if (!endDate) return false;
    return date.getDate() === endDate.getDate() && 
           date.getMonth() === endDate.getMonth() && 
           date.getFullYear() === endDate.getFullYear();
  };
  
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    
    return false;
  };
  
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };
  
  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };
  
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const disabled = isDateDisabled(date);
      const isStart = isStartDate(date);
      const isEnd = isEndDate(date);
      const inRange = isDateInRange(date);
      
      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[
            styles.dayCell,
            isStart && styles.startDateCell,
            isEnd && styles.endDateCell,
            inRange && !isStart && !isEnd && styles.inRangeCell,
            disabled && styles.disabledCell,
          ]}
          onPress={() => !disabled && onSelectDate(date)}
          disabled={disabled}
        >
          <Text style={[
            styles.dayText,
            (isStart || isEnd) && styles.selectedDayText,
            disabled && styles.disabledDayText,
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return days;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <ChevronLeft size={20} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{formatMonth(currentMonth)}</Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <ChevronRight size={20} color={colors.textDark} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.weekdaysContainer}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
          <Text key={index} style={styles.weekdayText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.daysContainer}>
        {renderCalendar()}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.startDateCell]} />
          <Text style={styles.legendText}>Data Inicial</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.endDateCell]} />
          <Text style={styles.legendText}>Data Final</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    textTransform: 'capitalize',
  },
  weekdaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textLight,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textDark,
  },
  startDateCell: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  endDateCell: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  inRangeCell: {
    backgroundColor: 'rgba(83, 127, 231, 0.1)',
  },
  selectedDayText: {
    color: colors.white,
    fontFamily: 'Inter-Medium',
  },
  disabledCell: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: colors.textLight,
  },
  legend: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textLight,
  },
});