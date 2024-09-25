<script setup lang="ts">
import type { BlogPost } from "~/types";

definePageMeta({
  alias: "/",
});

const page = ref({
  title: "博客",
  description: "",
});

const { data: posts } = await useAsyncData("posts", () =>
  queryContent<BlogPost>("/blogs")
    .where({ _extension: "md" })
    .sort({ date: -1 })
    .find(),
);

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
});

defineOgImageComponent("Blog", {
  title: page.value.title,
  description: page.value.description,
});
</script>

<template>
  <UContainer>
    <PageHeader v-bind="page" class="py-[50px]" />

    <PageBody>
      <BlogList>
        <BlogPost
          v-for="(post, index) in posts"
          :key="index"
          :to="post._path"
          :title="post.title"
          :description="post.description"
          :image="post.image"
          :date="
            new Date(post.date).toLocaleDateString($i18n.locale, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          "
          :authors="post.authors"
          :badge="post.badge"
          :orientation="index === 0 ? 'horizontal' : 'vertical'"
          :class="[index === 0 && 'col-span-full']"
          :ui="{
            description: 'line-clamp-2',
          }"
        />
      </BlogList>
    </PageBody>
  </UContainer>
</template>
