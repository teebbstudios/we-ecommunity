export const ApiConfig = {
  apiHost: `https://demo.teebb.net`, //请修改为您的接口地址
  contentType: `application/ld+json`,
  patchContentType: `application/merge-patch+json`,
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
  getCollection: `/api/auth/families`,
  postCollection: `/api/auth/families`,
  getItem: (id) => {
    return `/api/auth/families/${id}`
  },
  getItemAddress: (id) => {
    return `/api/auth/families/${id}/address`
  },
  getItemQrcode: (id) => {
    return `/api/auth/families/${id}/qrcode`
  }
}

export const FileApi = {
  postCollection: `/api/auth/files`,
  getItem: (id) => {
    return `/api/files/${id}`
  }
}

export const UserApi = {
  postLogin: `/api/login`,
  getItem: (id) => {
    return `/api/auth/users/${id}`
  },
  putItem: (id) => {
    return `/api/auth/users/${id}`
  },
  getItemQrcode: (id) => {
    return `/api/auth/users/${id}/qrcode`
  },
  getItemPhone: (id) => {
    return `/api/auth/users/${id}/decrypt-phone`
  },
  getSosQrcode: (id) => {
    return `/api/auth/users/${id}/sos-qrcode`
  },
  postItemSendSos: (id) => {
    return `/api/auth/users/${id}/send-sos`
  },
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
  getCollection: `/api/auth/reservations`,
  postCollection: `/api/auth/reservations`,
  getItem: (id) => {
    return `/api/auth/reservations/${id}`
  }
}

export const ResidentApi = {
  getCollection: `/api/auth/residents`,
  postCollection: `/api/auth/residents`,
  getItem: (id) => {
    return `/api/auth/residents/${id}`
  },
  patchItem: (id) => {
    return `/api/auth/residents/${id}`
  },
  putItem: (id) => {
    return `/api/auth/residents/${id}`
  },
  getItemBindQrcode: (id) => {
    return `/api/auth/residents/${id}/bind-qrcode`
  },
}

export const SuggestionTypeApi = {
  getCollection: `/api/suggestion-types`,
  getItem: (id) => {
    return `/api/suggestion-types/${id}`
  }
}

export const SuggestionApi = {
  getCollection: `/api/auth/suggestions`,
  postCollection: `/api/auth/suggestions`,
  getItem: (id) => {
    return `/api/auth/suggestions/${id}`
  },
  putItem: (id) => {
    return `/api/auth/suggestions/${id}`
  }
}

export const FileUploader = function (config) {
  let promise = Promise.resolve(config);
  let url = ApiConfig.apiHost + FileApi.postCollection;
  if(config.rotate){
    url = url + "?rotate=true"
  }
  if (!config.watermark) {
    if (url.indexOf('?') !== -1) {
      url = url + '&watermark=false'
    } else {
      url = url + '?watermark=false'
    }
  }
  return promise.then(config => {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: url,
        filePath: config.filePath,
        name: config.name ? config.name : 'file',
        header: config.headers,
        success: response => {
          resolve(response)
        },
        fail: error => {
          reject(error)
        }
      });
    })
  })

}