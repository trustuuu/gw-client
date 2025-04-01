import { map } from "ramda";

export const fromFirebaseDate = (fbDate) =>
  new Date(
    typeof fbDate === "string"
      ? Date.parse(fbDate)
      : fbDate._seconds
      ? fbDate._seconds * 1000
      : fbDate
  );
export const formatDate = (date) => date.toLocaleDateString();
export const formatTime = (time) => time.toLocaleTimeString();
export const formatDateTime = (date) =>
  `${formatDate(date)} ${formatTime(date)}`;

export const formatFirebaseDate = (fbDate) =>
  formatDate(fromFirebaseDate(fbDate));
export const formatFirebaseTime = (fbDate) =>
  formatTime(fromFirebaseDate(fbDate));
export const formatFirebaseDateTime = (fbDate) =>
  `${formatFirebaseDate(fbDate)} ${formatFirebaseTime(fbDate)}`;

export const updateCreatedAtFromFirebaseDate = (data) =>
  map((d) => ({ ...d, createdAt: fromFirebaseDate(d.createdAt) }), data);
