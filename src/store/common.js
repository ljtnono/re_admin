const common = {
  namespaced: true,
  state: () => ({
    // 文章分类列表
    categoryList: [],
    // 文章标签列表
    tagList: []
  }),
  getters:{
    categoryFilters(state) {
      return state.categoryList.map(category => {
        return {
          text: category.name,
          value: category.name
        }
      });
    }
  },
  actions:{

  },
  mutations:{
    // 修改文章分类列表
    changeCategoryList(state, categoryList) {
      state.categoryList = categoryList;
    },
    // 修改文章标签列表
    changeTagList(state, tagList) {
      state.tagList = tagList;
    }
  }
};

export default common;
