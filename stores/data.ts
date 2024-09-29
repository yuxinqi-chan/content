import { defineStore } from "pinia";
import type {
  SongType,
  CoverType,
  UserDataType,
  UserLikeDataType,
  CatType,
} from "@/types/player";
// import { playlistCatlist } from "@/api/playlist";
import { cloneDeep, isEmpty } from "lodash-es";
// import { isLogin } from "@/utils/auth";
// import { formatCategoryList } from "@/utils/format";

interface ListState {
  playList: SongType[];
  historyList: SongType[];
  cloudPlayList: SongType[];
  searchHistory: string[];
  localPlayList: CoverType[];
  userLikeData: UserLikeDataType;
  likeSongsList: {
    detail: CoverType;
    data: SongType[];
  };
  catData: {
    type: Record<number, string>;
    cats: CatType[];
    hqCats: CatType[];
  };
}

type UserDataKeys = keyof ListState["userLikeData"];

export const useDataStore = defineStore({
  id: "dataStore",
  state: (): ListState => ({
    // 播放列表
    playList: [],
    // 播放历史
    historyList: [],
    // 搜索历史
    searchHistory: [],
    // 本地歌单
    localPlayList: [],
    // 云盘歌单
    cloudPlayList: [],
    // 用户喜欢数据
    userLikeData: {
      songs: [],
      playlists: [],
      artists: [],
      albums: [],
      mvs: [],
      djs: [],
    },
    // 我喜欢的音乐
    likeSongsList: {
      detail: {
        id: 0,
        name: "我喜欢的音乐",
        cover: "/images/album.jpg?assest",
      },
      data: [],
    },
    // 分类数据
    catData: {
      type: {},
      cats: [],
      hqCats: [],
    },
  }),
  getters: {
    // 是否为喜欢歌曲
    isLikeSong: (state) => (id: number) =>
      state.userLikeData.songs.includes(id),
  },
  actions: {
    async loadData() {},
    // 更新播放列表
    async setPlayList(data: SongType | SongType[]): Promise<number> {
      try {
        // 若为列表
        if (Array.isArray(data)) {
          this.playList = data;
          return 0;
        }
        // 若为单曲
        else {
          // 若为单曲
          const song = cloneDeep(data as SongType);
          // 歌曲去重
          const playList = this.playList.filter((s) => s.id !== song.id);
          // 添加到歌单末尾
          playList.push(song);
          // 获取索引
          const index = playList.length - 1;
          // 更新本地存储
          this.playList = playList;
          return index;
        }
      } catch (error) {
        console.error("Error updating playlist:", error);
        throw error;
      }
    },
    // 新增下一首播放歌曲
    async setNextPlaySong(song: SongType, index: number): Promise<number> {
      // 移除重复的歌曲（如果存在）
      const playList = this.playList.filter((item) => item.id !== song.id);
      // 在当前播放位置之后插入歌曲
      const indexAdd = index + 1;
      playList.splice(indexAdd, 0, song);
      // 更新本地存储
      this.playList = playList;
      return indexAdd;
    },
    // 更改播放历史
    async setHistory(song: SongType) {
      try {
        let historyList: ListState["historyList"] = [];
        // 深拷贝
        song = cloneDeep(song);
        // 添加到首项并移除重复项
        const updatedList = [
          song,
          ...historyList.filter((item) => item.id !== song.id),
        ];
        // 最多 500 首
        if (updatedList.length > 500) {
          updatedList.splice(500);
        }
        // 更新播放历史
        this.historyList = updatedList as SongType[];
      } catch (error) {
        console.error("Error updating history:", error);
        throw error;
      }
    },
    // 清除播放历史
    async clearHistory(): Promise<void> {
      try {
        this.historyList = [];
      } catch (error) {
        console.error("Error clearing history:", error);
        throw error;
      }
    },
    // 更改我喜欢的音乐
    async setLikeSongsList(detail: CoverType, data: SongType[]) {
      this.likeSongsList = { detail, data };
    },
    // 获取我喜欢的歌单数据
    async getUserLikePlaylist() {
      const { loggedIn } = useUserSession();
      if (!loggedIn.value) return;
      return this.likeSongsList;
    },
    // 更改云盘歌单
    async setCloudPlayList(data: SongType[]) {
      this.cloudPlayList = data;
    },
    // 更改用户数据
    async setUserLikeData<K extends UserDataKeys>(
      name: K,
      data: ListState["userLikeData"][K],
    ): Promise<void> {
      try {
        this.userLikeData[name] = data;
      } catch (error) {
        console.error("Error updating user data:", error);
        throw error;
      }
    },
    // 清除用户数据
    async clearUserData() {
      try {
        await Promise.all(
          Object.keys(this.userLikeData).map(async (key) => {
            const userDataKey = key as UserDataKeys;
            await this.setUserLikeData(userDataKey, []);
            this.userLikeData[userDataKey] = [];
          }),
        );
      } catch (error) {
        console.error("Error clearing user data:", error);
        throw error;
      }
    },
    // 删除数据库
    async deleteDB(name?: string): Promise<void> {},
    // 获取歌单分类
    async getPlaylistCatList() {
      if (!isEmpty(this.catData.cats) && !isEmpty(this.catData.hqCats)) return;
      // 获取歌单分类
      try {
        const [catsRes, hqCatsRes] = await Promise.all([
          playlistCatlist(),
          playlistCatlist(true),
        ]);
        console.log(catsRes, hqCatsRes);
        this.catData = {
          type: catsRes.categories,
          cats: formatCategoryList(catsRes.sub),
          hqCats: formatCategoryList(hqCatsRes.tags),
        };
      } catch (error) {
        console.error("Error getting playlist cat list:", error);
        throw error;
      }
    },
  },
  // 持久化
  persist: {
    key: "data-store",
    pick: ["searchHistory", "catData"],
  },
});

// 获取歌单分类信息
const playlistCatlist = (hq: boolean = false) => {
  return $fetch<any>(`/playlist/${hq ? "highquality/tags" : "catlist"}`, {
    params: { hq, timestamp: Date.now() },
  });
};
