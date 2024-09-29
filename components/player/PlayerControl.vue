<template>
  <div class="player-control">
    <Transition name="fade" mode="out-in">
      <div
        v-show="statusStore.playerMetaShow"
        class="control-content"
        @click.stop
      >
        <div class="left flex items-center gap-x-3 gap-y-2">
          <!-- 喜欢歌曲 -->
          <div
            v-if="musicStore.playSong.type !== 'radio'"
            class="menu-icon"
            @click="
              toLikeSong(
                musicStore.playSong,
                !dataStore.isLikeSong(musicStore.playSong.id),
              )
            "
          >
            <UIcon
              :name="
                dataStore.isLikeSong(musicStore.playSong.id)
                  ? 'i-mdi-cards-heart'
                  : 'i-mdi-cards-heart-outline'
              "
            />
          </div>
          <!-- 添加到歌单 -->
          <div
            class="menu-icon"
            @click.stop="
              openPlaylistAdd([musicStore.playSong], !!musicStore.playSong.path)
            "
          >
            <UIcon name="i-mdi-playlist-plus" />
          </div>
        </div>
        <div class="center">
          <div class="btn">
            <!-- 不喜欢 -->
            <div
              v-if="statusStore.personalFmMode"
              class="btn-icon"
              v-debounce="
                () => player.personalFMTrash(musicStore.personalFMSong?.id)
              "
            >
              <UIcon class="icon" :size="18" name="i-mdi-thumb-down" />
            </div>
            <!-- 上一曲 -->
            <div
              v-else
              class="btn-icon"
              v-debounce="() => player.nextOrPrev('prev')"
            >
              <UIcon :size="26" name="i-mdi-skip-previous" />
            </div>
            <!-- 播放暂停 -->
            <UButton
              :loading="statusStore.playLoading"
              :focusable="false"
              :keyboard="false"
              class="play-pause"
              color="primary"
              :ui="{ rounded: 'rounded-full' }"
              @click.stop="player.playOrPause()"
              :icon="statusStore.playStatus ? 'i-mdi-pause' : 'i-mdi-play'"
            >
            </UButton>
            <!-- 下一曲 -->
            <div class="btn-icon" v-debounce="() => player.nextOrPrev('next')">
              <UIcon :size="26" name="i-mdi-skip-next" />
            </div>
          </div>
          <!-- 进度条 -->
          <div class="slider">
            <span>{{ secondsToTime(statusStore.currentTime) }}</span>
            <URange
              v-model:value="statusStore.progress"
              :step="0.01"
              :min="0"
              :max="100"
              :tooltip="false"
              :keyboard="false"
              class="player-slider"
              @dragstart="player.pause(false)"
              @dragend="sliderDragend"
            />
            <span>{{ secondsToTime(statusStore.duration) }}</span>
          </div>
        </div>
        <div class="right flex items-center justify-end gap-x-3 gap-y-2">
          <!-- 显示评论 -->
          <div
            v-if="!musicStore.playSong.path && !statusStore.pureLyricMode"
            class="menu-icon"
            @click.stop="
              statusStore.showPlayerComment = !statusStore.showPlayerComment
            "
          >
            <UIcon
              :depth="statusStore.showPlayerComment ? 1 : 3"
              name="i-mdi-message"
            />
          </div>
          <!-- 播放模式 -->
          <div class="menu-icon" @click.stop="player.togglePlayMode(false)">
            <UIcon :name="playModeIcon" />
          </div>
          <!-- 播放列表 -->
          <div
            v-if="!statusStore.personalFmMode"
            class="menu-icon"
            @click.stop="statusStore.playListShow = !statusStore.playListShow"
          >
            <UIcon name="i-mdi-playlist-music" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// import { openPlaylistAdd } from "@/utils/modal";
// import { toLikeSong } from "@/utils/auth";
// import player from "@/utils/player";

const openPlaylistAdd = (...args: any) => {};
const toLikeSong = (...args: any) => {};
const player: any = {};

const dataStore = useDataStore();
const musicStore = useMusicStore();
const statusStore = usePlayerStatusStore();

// 当前播放模式图标
const playModeIcon = computed(() => {
  const mode = statusStore.playSongMode;
  return statusStore.playHeartbeatMode
    ? "i-mdi-heart-pulse"
    : mode === "repeat"
      ? "i-mdi-repeat"
      : mode === "repeat-once"
        ? "i-mdi-repeat-once"
        : "i-mdi-shuffle";
});

// 进度条拖拽结束
const sliderDragend = () => {
  const seek = calculateCurrentTime(statusStore.progress, statusStore.duration);
  statusStore.playStatus = true;
  // 调整进度
  player.setSeek(seek);
  player.play();
};
</script>

<style lang="scss" scoped>
.player-control {
  width: 100%;
  height: 80px;
  overflow: hidden;
  cursor: pointer;
  .control-content {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
  }
  .left,
  .right {
    opacity: 0;
    height: 100%;
    padding: 0 30px;
    transition: opacity 0.3s;
    .menu-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      border-radius: 8px;
      transition:
        background-color 0.3s,
        transform 0.3s;
      cursor: pointer;
      .n-icon {
        font-size: 24px;
        color: rgb(var(--main-color));
      }
      &:hover {
        transform: scale(1.1);
        background-color: rgba(var(--main-color), 0.14);
      }
      &:active {
        transform: scale(1);
      }
    }
  }
  .center {
    height: 100%;
    max-height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      .btn-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        transition:
          backdrop-filter 0.3s,
          background-color 0.3s,
          transform 0.3s;
        cursor: pointer;
        .n-icon {
          color: rgb(var(--main-color));
        }
        &:hover {
          transform: scale(1.1);
          backdrop-filter: blur(10px);
          background-color: rgba(var(--main-color), 0.14);
        }
        &:active {
          transform: scale(1);
        }
      }
      .play-pause {
        --n-width: 44px;
        --n-height: 44px;
        --n-color: rgba(var(--main-color), 0.14);
        --n-color-hover: rgba(var(--main-color), 0.2);
        --n-color-focus: rgba(var(--main-color), 0.2);
        --n-color-pressed: rgba(var(--main-color), 0.12);
        backdrop-filter: blur(10px);
        margin: 0 12px;
        transition:
          background-color 0.3s,
          transform 0.3s;
        .n-icon {
          color: rgb(var(--main-color));
          transition: opacity 0.1s ease-in-out;
        }
        :deep(.n-base-loading) {
          color: rgb(var(--main-color));
        }
        &:hover {
          transform: scale(1.1);
        }
        &:active {
          transform: scale(1);
        }
      }
    }
    .slider {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      max-width: 480px;
      font-size: 12px;
      cursor: pointer;
      .n-slider {
        margin: 6px 8px;
        --n-handle-size: 12px;
        --n-rail-height: 4px;
        --n-rail-color: rgba(var(--main-color), 0.14);
        --n-rail-color-hover: rgba(var(--main-color), 0.3);
        --n-fill-color: rgb(var(--main-color));
        --n-handle-color: rgb(var(--main-color));
        --n-fill-color-hover: rgb(var(--main-color));
      }
      span {
        opacity: 0.6;
      }
    }
  }
  &:hover {
    .left,
    .right {
      opacity: 1;
    }
  }
}
</style>
