import { defineStore } from "pinia";
import { findCategoryList } from "@/api/category";
import { findTagList } from "@/api/tag";

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
    },
    // 重新拉取分类列表（分类管理页增删改后调用，保证下拉列表实时）
    async refreshCategoryList() {
      const res = await findCategoryList();
      this.categoryList = res.data.data;
    },
    // 重新拉取标签列表（标签管理页增删改后调用，保证下拉列表实时）
    async refreshTagList() {
      const res = await findTagList();
      this.tagList = res.data.data;
    }
  },
  persist: {
    storage: sessionStorage
  }
});
