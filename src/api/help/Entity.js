import $api from "../index";

const categoryApi = {
  getCategories: () => {
    return $api.get(`/categories`);
  },
  createCategory: (category) => {
    return $api.post(`/categories`, category);
  },
  getCategoryById: (id) => {
    return $api.get(`/categories/${id}`);
  },
  getPostsByCategory: (id) => {
    return $api.get(`/categories/${id}/posts`);
  },
  getSortedCategories: () => {
    return $api.get(`/categories/sorted`);
  },
};

const commentApi = {
  getCommsPost: (id) => {
    return $api.get(`/posts/${id}/comments`);
  },
  createComments: (id, comment) => {
    return $api.post(`/posts/${id}/comments`, comment);
  },
  getCommentsLike: (id) => {
    return $api.get(`/comments/${id}/like`);
  },
  setCommentLike: (id) => {
    return $api.post(`/comments/${id}/like`);
  },
  setCommentDisLike: (id) => {
    return $api.post(`/comments/${id}/dislike`);
  },
  deleteCommentLike: (id) => {
    return $api.delete(`/comments/${id}/like`);
  },
  deleteCommentDisLike: (id) => {
    return $api.delete(`/comments/${id}/dislike`);
  },
  getCommentById: (id) => {
    return $api.get(`/comments/${id}`);
  },
  editComment: (id) => {
    return $api.patch(`/comments/${id}`);
  },
  deleteComm: (id) => {
    return $api.delete(`/comments/${id}`);
  }
};

const postApi = {
  createPost: (post) => {
    return $api.post('/posts', post);
  },
  changePost: (id, post) => {
    return $api.patch(`/posts/${id}`, post);
  },
  getPosts: (params) => {
    if (!params) {
      return $api.get(`/posts?page=1`);
    }
    return $api.get(`/posts?${params}`);
  },
  getPostById: (id) => {
    return $api.get(`/posts/${id}`);
  },
  getComments: (id) => {
    return $api.get(`/posts/${id}/comments`);
  },
  getCategories: (id) => {
    return $api.get(`/posts/${id}/categories`);
  },
  getPostLikes: (id) => {
    return $api.get(`/posts/${id}/like`);
  },
  deletePost: (id) => {
    return $api.delete(`/posts/${id}/`);
  },
  setPostLike: (id) => {
    return $api.post(`/posts/${id}/like`);
  },
  setPostDisLike: (id) => {
    return $api.post(`/posts/${id}/dislike`);
  },
  deletePostLike: (id) => {
    return $api.delete(`/posts/${id}/like`);
  },
  deletePostDisLike: (id) => {
    return $api.delete(`/posts/${id}/dislike`);
  },
  getPostsUser: (id) => {
    return $api.get(`/users/${id}/posts`);
  },
  imgChange: (id, formData) => {
    return $api.post(`/posts/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
};

const userApi = {
  getUsers: (params) => {
    if (!params) {
      return $api.get(`/users?page=1`);
    }
    return $api.get(`/users?${params}`);
  },
  getUserById: (id) => {
    return $api.get(`/users/${id}`);
  },
  getPostsByUser: (id) => {
    return $api.get(`/users/${id}/posts`);
  },
  changeAvatar:(id, formData) => {
    $api.patch(`/users/avatar`,formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return $api.post(`/users/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export { categoryApi, commentApi, postApi, userApi };