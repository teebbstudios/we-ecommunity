export const ApiConfig = {
  apiHost: `http://127.0.0.1:8000`,
  contentType: `application/ld+json`,
  accept: `application/ld+json, `,
}

export const BuildingApi = {
  getCollection: `/api/buildings`,
  getItem: (id) => {
    return `/api/buildings/${id}`
  }
}

export const CategoryApi = {
  getCollection: `/api/categories`,
  getItem: (id) => {
    return `/api/categories/${id}`
  }
}

export const CertificationApi = {
  getCollection: `/api/certifications`,
  getItem: (id) => {
    return `/api/certifications/${id}`
  }
}

export const CommunityApi = {
  getCollection: `/api/communities`,
  getItem: (id) => {
    return `/api/communities/${id}`
  }
}

export const FamilyApi = {
  getCollection: `/api/families`,
  postCollection: `/api/families`,
  getItem: (id) => {
    return `/api/families/${id}`
  }
}

export const FileApi = {
  postCollection: `/api/files`,
  getItem: (id) => {
    return `/api/files/${id}`
  }
}

export const UserApi = {
  postLogin: `/api/login`,
}

export const PostApi = {
  getCollection: `/api/posts`,
  getItem: (id) => {
    return `/api/posts/${id}`
  }
}

export const RelationApi = {
  getCollection: `/api/relations`,
  getItem: (id) => {
    return `/api/relations/${id}`
  }
}

export const ReplyApi = {
  getCollection: `/api/replies`,
  getItem: (id) => {
    return `/api/replies/${id}`
  }
}

export const ReservationTypeApi = {
  getCollection: `/api/reservation-types`,
  getItem: (id) => {
    return `/api/reservation-types/${id}`
  }
}

export const ReservationApi = {
  getCollection: `/api/reservations`,
  postCollection: `/api/reservations`,
  getItem: (id) => {
    return `/api/reservations/${id}`
  }
}

export const ResidentApi = {
  getCollection: `/api/residents`,
  postCollection: `/api/residents`,
  getItem: (id) => {
    return `/api/residents/${id}`
  }
}

export const SuggestionTypeApi = {
  getCollection: `/api/suggestion-types`,
  getItem: (id) => {
    return `/api/suggestion-types/${id}`
  }
}

export const SuggestionApi = {
  getCollection: `/api/suggestions`,
  postCollection: `/api/suggestions`,
  getItem: (id) => {
    return `/api/suggestions/${id}`
  },
  patchItem: (id) => {
    return `/api/suggestions/${id}`
  }
}


