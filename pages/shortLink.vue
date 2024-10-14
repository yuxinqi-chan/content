<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { t } = useI18n();
const config = useRuntimeConfig();
const { copy } = useCopyToClipboard();
const page = ref({
  title: t("short-link"),
  description: t("create-short-link"),
});
const created = ref(false);
const schema = z.object({
  url: z.string({ message: t("Required") }).url(t("Invalid URL")),
  slug: z.string().default(generateRandomSlug(6)),
  isProxy: z.boolean().default(false),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  url: undefined,
  slug: generateRandomSlug(6),
  isProxy: false,
});
watch(
  () => state.url,
  () => {
    created.value = false;
  },
);

function generateRandomSlug(length: number) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { url, slug, isProxy } = event.data;
  try {
    const res = await $fetch(`/api/shortlinks/${slug}`, {
      method: "PUT",
      body: { url, isProxy },
    });
    useSuccessToast(t("create-short-link-success"), t("copied"));
    state.slug = res.slug;
    state.url = res.url;
    created.value = true;
    copy(config.app.url + "/s/" + res.slug);
  } catch (error) {
    useErrorToast(
      t("error"),
      error instanceof Error ? error.message : String(error),
    );
  }
}
</script>

<template>
  <UContainer
    class="flex w-full max-w-screen-sm flex-grow flex-col justify-center"
  >
    <PageHeader v-bind="page" class="py-[50px]" />
    <PageBody>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup :label="$t('long-url')" name="url">
          <UInput
            v-model="state.url"
            placeholder="https://example.com/your-long-url"
          />
        </UFormGroup>

        <UFormGroup :label="$t('custom-slug-optional')" name="slug">
          <div class="flex items-center gap-2">
            <span class="mr-2"
              >{{ config.app.url }}/s/{{ created ? state.slug : "" }}</span
            >
            <UInput
              v-if="!created"
              v-model="state.slug"
              placeholder="your-custom-slug"
            >
            </UInput>
            <UButton
              color="gray"
              icon="i-mdi-autorenew"
              @click="state.slug = generateRandomSlug(6)"
            />
          </div>
        </UFormGroup>

        <UFormGroup :label="$t('is-proxy')" name="isProxy">
          <UToggle v-model="state.isProxy" :disabled="created" />
        </UFormGroup>
        <UButton type="submit"> {{ $t("create") }} </UButton>
      </UForm>
    </PageBody>
  </UContainer>
</template>
