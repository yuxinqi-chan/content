<template>
  <div :class="['player-data', settingStore.playerType, { center }]">
    <!-- 名称 -->
    <div class="name">
      <span class="name-text text-hidden">{{
        musicStore.playSong.name || "未知曲目"
      }}</span>
      <UPopover
        v-if="statusStore.playUblock"
        mode="hover"
        placement="right-start"
        raw
      >
        <template #panel>
          <UIcon :depth="3" name="i-mdi-cloud-lock-open" size="22" />
        </template>
        <div
          :style="{
            '--theme': theme,
          }"
          class="player-tip"
        >
          <span
            >该歌曲暂时无法播放，为您采用其他音源，可能会与原曲存在差别</span
          >
        </div>
      </UPopover>
      <!-- 云盘歌曲 -->
      <UIcon
        v-if="musicStore.playSong.pc"
        :depth="3"
        name="i-mdi-cloud"
        size="22"
      />
    </div>
    <!-- 别名 -->
    <span v-if="musicStore.playSong.alia" class="alia">
      {{ musicStore.playSong.alia }}
    </span>
    <!-- 歌手 -->
    <div v-if="musicStore.playSong.type !== 'radio'" class="artists">
      <UIcon :depth="3" name="Artist" size="20" />
      <div v-if="Array.isArray(musicStore.playSong.artists)" class="ar-list">
        <span v-for="ar in musicStore.playSong.artists" :key="ar.id" class="ar">
          {{ ar.name }}
        </span>
      </div>
      <div v-else class="ar-list">
        <span class="ar">{{
          musicStore.playSong.artists || "未知艺术家"
        }}</span>
      </div>
    </div>
    <div v-else class="artists">
      <UIcon :depth="3" name="i-mdi-account-music" size="20" />
      <div class="ar-list">
        <span class="ar">{{
          musicStore.playSong.dj?.creator || "未知艺术家"
        }}</span>
      </div>
    </div>
    <!-- 专辑 -->
    <div v-if="musicStore.playSong.type !== 'radio'" class="album">
      <UIcon :depth="3" name="i-mdi-album" size="20" />
      <span class="name-text text-hidden">
        {{
          typeof musicStore.playSong.album === "string"
            ? musicStore.playSong.album || "未知专辑"
            : musicStore.playSong.album?.name || "未知专辑"
        }}
      </span>
    </div>
    <!-- 电台 -->
    <div v-if="musicStore.playSong.type === 'radio'" class="dj">
      <UIcon :depth="3" name="i-mdi-podcast" size="20" />
      <span class="name-text text-hidden">{{
        musicStore.playSong.dj?.name || "播客电台"
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  center?: boolean;
  theme?: string;
}>();

const musicStore = useMusicStore();
const statusStore = usePlayerStatusStore();
const settingStore = useSettingStore();
</script>

<style lang="scss" scoped>
.player-data {
  display: flex;
  flex-direction: column;
  width: 70%;
  max-width: 50vh;
  margin-top: 24px;
  padding: 0 2px;
  .n-icon {
    color: rgb(var(--main-color));
  }
  .name {
    display: flex;
    align-items: center;
    margin-left: 4px;
    .name-text {
      font-size: 26px;
      font-weight: bold;
      line-clamp: 2;
      -webkit-line-clamp: 2;
    }
    .n-icon {
      margin-left: 12px;
      transform: translateY(1px);
      cursor: pointer;
    }
  }
  .alia {
    margin: 6px 0 6px 2px;
    opacity: 0.6;
    font-size: 18px;
  }
  .artists {
    margin-top: 2px;
    display: flex;
    align-items: center;
    .n-icon {
      margin-right: 4px;
    }
    .ar-list {
      display: -webkit-box;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      word-break: break-all;
      .ar {
        font-size: 16px;
        opacity: 0.7;
        display: inline-flex;
        transition: opacity 0.3s;
        cursor: pointer;
        &::after {
          content: "/";
          margin: 0 4px;
          transition: none;
        }
        &:last-child {
          &::after {
            display: none;
          }
        }
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .album,
  .dj {
    margin-top: 2px;
    font-size: 16px;
    display: flex;
    align-items: center;
    .n-icon {
      margin-right: 4px;
    }
    .name-text {
      opacity: 0.7;
      transition: opacity 0.3s;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
  }
  &.record {
    width: 100%;
    padding: 0 80px 0 24px;
    .name {
      .name-text {
        font-size: 30px;
      }
    }
  }
  &.center {
    align-items: center;
    padding: 0 2px;
    .name {
      text-align: center;
    }
  }
}
.player-tip {
  width: 240px;
  padding: 12px 20px;
  border-radius: 12px;
  color: rgb(var(--theme));
  background-color: rgba(var(--theme), 0.18);
  backdrop-filter: blur(10px);
}
</style>
