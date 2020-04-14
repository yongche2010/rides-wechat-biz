import {request, getRid} from '../../../utils/util'

Page({
  data: {
    getRid: '',
    userInfo: {},
    cardList: [],
    id: 0,
    show: false
  },

  onLoad () {
    this.setData({
      rid: getRid()
    })
    // this.getRiderDetail()
  },

  onShow () {
    this.getRiderBankCardList()
  },

  getRiderDetail () {
    request('getRiderDetail', {
      rid: this.data.rid,
      service: 'gz.fyd.dispath'
    }).then( r => {
      console.log(r.data);
      this.setData({
        userInfo: r.data
      })
    })
  },

  getRiderBankCardList () {
    request('getRiderBankCardList', {
      rid: this.data.rid,
      service: 'gz.fyd.dispath'
    }).then( r => {
      console.log(r);
      let cardList = r.data.rs
      for (let i in cardList) {
        cardList[i].yn = false
      }
      this.setData({
        cardList
      })
      if (r.data.count === 0) {
        let pages = getCurrentPages();             //  获取页面栈
        let prevPage = pages[pages.length - 2];    // 上一个页面
        prevPage.setData({
          editToNew: true,
          id: 0                      
        })
      }
    })
  },

  deleteRiderBankCard (id) {
    request('deleteRiderBankCard', {
      id,
      rid: this.data.rid,
      service: 'gz.fyd.dispath'
    }).then( r => {
      console.log(r);
      this.getRiderBankCardList()
    })
  },

  onaddAccount () {
    wx.navigateTo({
      url: '/pages/mineChildren/editAccount/editAccount?type=add'
    })
  },

  oneditAccount (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/mineChildren/editAccount/editAccount?type=edit&id=${id}`
    })
  } ,

  ondeleteCard (e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      id,
      show: true
    })
  },

  onClose() {
    this.setData({
       shows: false 
      });
  },

  onconfirm () {
    this.deleteRiderBankCard(this.data.id) 
  },

  onselectCard (e) {
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let param = {};
    let string = "cardList["+index+"].yn"
    param[string] = true
    this.setData(param);
    console.log(id);
    let pages = getCurrentPages();             //  获取页面栈
    // let currPage = pages[pages.length - 1];    当前页面
    let prevPage = pages[pages.length - 2];    // 上一个页面
    prevPage.setData({
      id                      
    })
    wx.navigateBack({
      delta: 1
      })
  }
})