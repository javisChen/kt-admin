import {post, get, del, put} from '@/utils/request'

const api = {
  apiCategories: '/api/categories',
  apiCategory: '/api/category',
}

export default api

export const getApiCategories = (params) => get({url: api.apiCategories, params})

export const addApiCategory = (data) => post({url: api.apiCategory, data})

export const deleteApiCategory = (params) => del({url: `${api.apiCategory}`, params})

export const updateApiCategory = (data) => put({url: api.apiCategory, data})


