<script lang="ts" setup>
import { useSession } from "h3";

definePageMeta({
  layout: "centered",
  middleware: "guest",
});

const { t } = useI18n();

const title = t("Login");
const description = t(
  "Use one of the following providers to login to your account",
);

useSeoMeta({
  title,
  description,
});

/**
 * I'm not sure if this is the best way to handle this, but it works.
 */
const message = useState<string>("message");
if (import.meta.server) {
  const session = await useSession(useRequestEvent()!, {
    password: useRuntimeConfig().session.password,
  });

  message.value = session.data.message;

  await session.update({
    message: "",
  });
}
</script>

<template>
  <div>
    <UAlert
      v-if="message"
      class="mb-8"
      color="red"
      variant="outline"
      :close-button="{
        icon: 'i-ph-x-bold',
        color: 'red',
        variant: 'link',
        padded: false,
      }"
      :description="message"
      @close="message = ''"
    />

    <UCard class="min-w-[400px]">
      <AuthForm
        :title
        :description
        align="bottom"
        :providers="[
          {
            label: 'GitHub',
            icon: 'i-simple-icons-github',
            color: 'gray',
            external: true,
            to: '/auth/github',
          },
          {
            label: 'Twitch',
            icon: 'i-simple-icons-twitch',
            color: 'gray',
            external: true,
            to: '/auth/twitch',
          },
        ]"
      >
        <template #footer>
          <div class="flex justify-between">
            <div>
              {{ $t("Dont have an account yet") }}
              <NuxtLink to="/register" class="text-primary font-medium">
                {{ $t("Register") }}
              </NuxtLink>
            </div>
            <div>
              <NuxtLink to="/" class="text-primary font-medium">
                {{ $t("Back to home") }}
              </NuxtLink>
            </div>
          </div>
        </template>
      </AuthForm>
    </UCard>
  </div>
</template>
