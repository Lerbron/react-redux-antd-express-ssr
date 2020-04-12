import http from '@/utils/http'

function getCategoryAction(categories) {
  return {
    type: "GET_CATEGORY",
    categories
  }
}

export function getCategory() {
  return dispatch => {
    return new Promise((resolve, reject) => {

      http.get('/api/services/app/Category/GetAll')
        .then(data => {
          if (data && data.success) {
            dispatch(getCategoryAction(data.result.items))
            resolve(data)
          } else {
            reject(err)
          }
        })
    })
  }
}


function getListActions(list, page) {
  return {
    type: "GET_LIST",
    list,
    page: page + 1
  }
}

export function getList(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      http.get("/api/v1/topics", {
          params
        })
        .then(data => {
          if (data && data.success) {
            let {
              page
            } = params
            dispatch(getListActions(data.data, page))
            resolve(data)
          } else {
            reject(err)
          }
        })
    })
  }
}



function getDetailInfoAction(defailInfo) {
  return {
    type: "GET_DETAIL_INFO",
    defailInfo
  }
}

export function getDetailInfo(param) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      http.get("/api/services/app/Activity/GetActivity", {
          params
        })
        .then(data => {
          if (data && data.success) {
            dispatch(getDetailInfoAction(data.result.items))
            resolve(data)
          } else {
            reject(err)
          }
        })
    })
  }
}


function getDetailAction(detail) {
  return {
    type: "GET_DETAIL",
    detail
  }
}

export function getDetail(params) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      http.get("/api/v1/topics", {
          params
        })
        .then(data => {
          console.log()
          if (data && data.success) {
            let {
              page
            } = params
            dispatch(getDetailAction(data.data[0]))
            resolve(data)
          } else {
            reject(err)
          }
        })
    })
  }
}