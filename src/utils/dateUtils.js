import { format, isToday, isPast, isFuture, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy hh:mm a');
};

export const formatTime = (date) => {
  return formatDate(date, 'hh:mm a');
};

export const isDateToday = (date) => {
  if (!date) return false;
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isToday(parsedDate);
  } catch (error) {
    return false;
  }
};

export const isDatePast = (date) => {
  if (!date) return false;
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isPast(parsedDate);
  } catch (error) {
    return false;
  }
};

export const isDateFuture = (date) => {
  if (!date) return false;
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isFuture(parsedDate);
  } catch (error) {
    return false;
  }
};

export const getCalendarDays = (date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const isSameDate = (date1, date2) => {
  if (!date1 || !date2) return false;
  try {
    const parsedDate1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const parsedDate2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return isSameDay(parsedDate1, parsedDate2);
  } catch (error) {
    return false;
  }
};

export const formatInputDate = (date) => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, 'yyyy-MM-dd');
  } catch (error) {
    return '';
  }
};

export const formatInputDateTime = (date) => {
  if (!date) return '';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    return '';
  }
};