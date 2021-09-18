<!--
 * @Description: 
 * @Autor: zhenghui
 * @Date: 2021-09-15 08:54:12
-->
<script setup>
  import {
    NConfigProvider,
    NGrid,
    NGridItem,
    NCard,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NGradientText,
    darkTheme,
  } from 'naive-ui';
  import { sortBy } from 'lodash-es';
  import { ref } from 'vue';

  import pointWave from '@/components/point-wave';
  import { getSystemMapList } from '@/api';
  import sysJson from '@/assets/json/sys.json';

  const theme = ref(darkTheme);
  const themeLabel = ref('深色');
  const hanldeChangeTheme = () => {
    if (!theme.value) {
      theme.value = darkTheme;
      themeLabel.value = '浅色';
    } else {
      theme.value = null;
      themeLabel.value = '深色';
    }
  };

  const systemMapList = ref([]);
  const getMenuList = async () => {
    try {
      const { data } = await getSystemMapList();
      systemMapList.value = sortBy(data, 'orderId');
    } catch {
      systemMapList.value = sysJson;
    }
  };
  getMenuList();

  const handleCardClick = ({ url }) => {
    window.open(url, '_blank');
  };
</script>

<template>
  <n-config-provider :theme="theme">
    <n-layout class="workbech" position="absolute">
      <n-layout-header bordered>
        <div class="workbech-header">
          <n-gradient-text type="info" :size="36">
            FFITM WORKBENCH
          </n-gradient-text>
          <n-gradient-text
            class="theme-btn"
            type="info"
            :size="18"
            @click="hanldeChangeTheme"
          >
            {{ themeLabel }}
          </n-gradient-text>
        </div>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;height:calc(100vh - 60px)">
        <n-grid :x-gap="12" :y-gap="8" :cols="4">
          <n-grid-item :key="index" v-for="(item, index) in systemMapList">
            <n-card :title="item.systemName" @click="handleCardClick(item)">
              {{ item.description }}
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-layout-content>
    </n-layout>
    <pointWave :color="0x4ec280" />
  </n-config-provider>
</template>

<style lang="scss">
  .workbech {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      .theme-btn {
        cursor: pointer;
      }
    }
  }
  .n-card {
    cursor: pointer;
  }
</style>
