<script lang="ts" setup>
import { UAParser } from "ua-parser-js";

defineProps<{
  comments?:
    | {
        id: number;
        nickname: string;
        avatar?: string | null;
        createdAt: string;
        content: string;
        location?: string | null;
        userAgent?: string | null;
      }[]
    | null;
}>();
const getUa = useMemoize((ua: string) => UAParser(ua));
const os = (ua: string) => {
  const uaObj = getUa(ua);
  return `${uaObj.os.name} ${uaObj.os.version}`;
};
const browser = (ua: string) => {
  const uaObj = getUa(ua);
  return `${uaObj.browser.name} ${uaObj.browser.version}`;
};
</script>
<template>
  <div class="flex flex-col gap-4">
    <div
      class="flex items-start gap-4"
      v-for="comment in comments"
      :key="comment.id"
    >
      <UAvatar
        class="mt-4"
        :src="comment.avatar ?? ''"
        :alt="comment.nickname"
      />
      <div class="flex-grow">
        <div class="flex items-baseline gap-2">
          <span class="font-bold">{{ comment.nickname }}</span>
          <span class="text-sm text-gray-500">{{ comment.createdAt }}</span>
        </div>
        <p>{{ comment.content }}</p>
        <div class="flex gap-2 text-gray-500">
          <UBadge size="xs" color="gray" v-if="comment.location">
            {{ comment.location }}
          </UBadge>
          <UBadge size="xs" color="gray" v-if="comment.userAgent">
            {{ os(comment.userAgent) }}
          </UBadge>
          <UBadge size="xs" color="gray" v-if="comment.userAgent">
            {{ browser(comment.userAgent) }}
          </UBadge>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
