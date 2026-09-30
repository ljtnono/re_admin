import { defineStore } from "pinia";

export const useCommonStore = defineStore("common", {
  state: () => ({
    // 文章分类列表
    categoryList: [],
    // 文章标签列表
    tagList: [],
    // 角色列表
    roleList: []
  }),
  getters: {
    categoryFilters(state) {
      return state.categoryList.map((category) => ({
        text: category.name,
        value: category.name
      }));
    }
  },
  actions: {
    changeCategoryList(categoryList) {
      this.categoryList = categoryList;
    },
    changeTagList(tagList) {
      this.tagList = tagList;
    },
    changeRoleList(roleList) {
      this.roleList = roleList;
    }
  },
  persist: {
    storage: sessionStorage
  }
});
