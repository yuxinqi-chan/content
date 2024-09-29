// 音质数据
export const songLevelData = {
  l: {
    level: "standard",
    name: "标准音质",
  },
  m: {
    level: "higher",
    name: "较高音质",
  },
  h: {
    level: "exhigh",
    name: "极高音质",
  },
  sq: {
    level: "lossless",
    name: "无损音质",
  },
  hr: {
    level: "hires",
    name: "Hi-Res",
  },
  je: {
    level: "jyeffect",
    name: "高清环绕声",
  },
  sk: {
    level: "sky",
    name: "沉浸环绕声",
  },
  db: {
    level: "dolby",
    name: "杜比全景声",
  },
  jm: {
    level: "jymaster",
    name: "超清母带",
  },
};
// 排序选项
export const sortOptions = {
  default: {
    name: "默认排序",
    show: "all",
    icon: "i-mdi-sort",
  },
  titleAZ: {
    name: "标题升序（ A - Z ）",
    show: "all",
    icon: "i-mdi-sort-alphabetical-ascending",
  },
  titleZA: {
    name: "标题降序（ Z - A ）",
    show: "all",
    icon: "i-mdi-sort-alphabetical-descending",
  },
  arAZ: {
    name: "歌手升序（ A - Z ）",
    show: "song",
    icon: "i-mdi-sort-alphabetical-ascending",
  },
  arZA: {
    name: "歌手降序（ Z - A ）",
    show: "song",
    icon: "i-mdi-sort-alphabetical-descending",
  },
  timeUp: {
    name: "时长升序",
    show: "all",
    icon: "i-mdi-sort-clock-ascending",
  },
  timeDown: {
    name: "时长降序",
    show: "all",
    icon: "i-mdi-sort-clock-descending",
  },
  dateUp: {
    name: "日期升序",
    show: "radio",
    icon: "i-mdi-sort-calendar-ascending",
  },
  dateDown: {
    name: "日期降序",
    show: "radio",
    icon: "i-mdi-sort-calendar-descending",
  },
};
