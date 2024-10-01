<script lang="ts" setup>
import { z } from "zod";

const props = defineProps<{
  replyTo: string;
}>();
const { t } = useI18n();

const page = ref(1);
const { data: commentsPage, refresh } = await useFetch(`/api/comments`, {
  query: {
    replyTo: props.replyTo,
    page,
  },
});
const initialState = () => ({
  nickname: undefined,
  email: undefined,
  site: undefined,
  content: undefined,
  token: undefined,
});
const state = reactive(initialState());

const schema = z.object({
  nickname: z.string().min(1, t("Required")),
  email: z.string().email(t("Required")),
  site: z.string().optional(),
  content: z.string().min(1, t("Required")),
  token: z.string().optional(),
});
const gravatarUrl = ref<string>();
const generateGravatarUrl = async () => {
  if (!state.email) return;
  const emailMd5 = await md5(state.email);
  gravatarUrl.value = `https://gravatar.com/avatar/${emailMd5}?d=mp`;
};
const onSubmit = async ({ data }: { data: typeof state }) => {
  await $fetch("/api/comments", {
    method: "POST",
    body: {
      ...data,
      replyTo: props.replyTo,
      avatar: gravatarUrl.value,
    },
  });
  page.value = 1;
  await refresh();
  Object.assign(state, initialState());
};
</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="text-lg text-gray-500">
      {{ `${commentsPage?.total} ${t("Comment")}` }}
    </div>
    <div class="flex items-start gap-4">
      <UAvatar class="mt-4" :src="gravatarUrl" :alt="state.nickname" />
      <UForm
        :schema="schema"
        :state="state"
        class="flex-grow"
        @submit="onSubmit"
      >
        <div class="flex gap-2">
          <UFormGroup
            class="flex-1"
            :label="$t('Nickname')"
            name="nickname"
            required
          >
            <UInput icon="i-mdi-account-outline" v-model="state.nickname" />
          </UFormGroup>
          <UFormGroup class="flex-1" :label="$t('Email')" name="email" required>
            <UInput
              icon="i-mdi-email-outline"
              v-model="state.email"
              @blur="generateGravatarUrl"
            />
          </UFormGroup>
          <UFormGroup class="flex-1" :label="$t('Site')" name="site">
            <UInput icon="i-mdi-link-variant" v-model="state.site" />
          </UFormGroup>
        </div>
        <UFormGroup class="mt-2" :label="$t('Content')" name="content" required>
          <UTextarea resize v-model="state.content"></UTextarea>
        </UFormGroup>
        <div class="mt-2 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-mdi-emoticon-outline"
            />
            <UButton color="gray" variant="ghost" icon="i-mdi-image" />
          </div>
          <div class="flex items-center space-x-2">
            <NuxtTurnstile v-model="state.token" />
            <UButton type="submit"> {{ $t("Publish") }} </UButton>
          </div>
        </div>
      </UForm>
    </div>
    <CommentComments :comments="commentsPage?.list" />
    <UPagination
      v-if="commentsPage && commentsPage.totalPages > 1"
      class="mx-auto"
      v-model="page"
      :page-count="10"
      :total="commentsPage.total"
    />
  </div>
</template>
