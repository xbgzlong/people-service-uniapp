import Vue from 'vue'
import store from './store'
import App from './App'

import Json from './Json' //测试用数据
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *  
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
// 检测登录态
const goToLogin = function(){
	let logininfo = "";
	uni.getStorage({
	    key: 'logininfo',
	    success: function(ress) {
	        logininfo = ress.data
	    }
	});
	if (!logininfo) {
		setTimeout(function(){
			uni.navigateTo({
			    url: '/pages/public/login'
			});
		},2000)
	    
	}
	
}
// 所有接口
const bmBaseApi = {
	getBmDisplayList:"serviceitem/getBmDisplayList",
	login:'account/login',
	getServiceitemList:"serviceitem/list",
	getTypepagelist:"serviceitem/typepagelist",
	getServiceDetail:'serviceitem/getData',
	getServicePrice:'serviceitem/getPriceList',
};

const baseUrl = 'http://120.224.235.68:8060/';  
const httpRequest = (opts, data) => {
    let httpDefaultOpts = {
        url: baseUrl+opts.url,
        data: data,
        method: opts.method,
        header: opts.method == 'get' ? {
        'X-Requested-With': 'XMLHttpRequest',
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
    } : {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
        dataType: 'json',
    }
    let promise = new Promise(function(resolve, reject) {
        uni.request(httpDefaultOpts).then(
            (res) => {
				
                resolve(res[1])
            }
        ).catch(
            (response) => {
                reject(response)
            }
        )
    })
    return promise
};
//带Token请求
const httpTokenRequest = (opts, data) => {
	var param = {};
	let logininfo = "";
	let token  = "";
	uni.getStorage({
	    key: 'logininfo',
	    success: function(ress) {
	        logininfo = ress.data
	    }
	});
	if (!logininfo) {
	    return false;
	}
	token =  logininfo.token;
	param.token = logininfo.token;
	param.loginMark = logininfo.loginMark;
	if(data){
		var type = typeof(data);
		if (type === 'object' || type === 'array') {
		    param.data = JSON.stringify(data);
		}
		else if (type === 'string') {
		    param.data = data;
		}
	}
    //此token是登录成功后后台返回保存在storage中的
    let httpDefaultOpts = {
        url: baseUrl+opts.url,
        data: param,
        method: opts.method,
        header: opts.method == 'get' ? {
        // 'Token': token,
        'X-Requested-With': 'XMLHttpRequest',
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8"
    } : {
        // 'Token': token,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
        dataType: 'json',
    }
    let promise = new Promise(function(resolve, reject) {
        uni.request(httpDefaultOpts).then(
            (res) => {
				resolve(res[1])
            }
        ).catch(
            (response) => {
                reject(response)
            }
        )
    })
    return promise
};
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}
Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg, json, prePage};
Vue.prototype.$baseUrl = baseUrl;
Vue.prototype.$bmBaseApi = bmBaseApi;
Vue.prototype.$httpRequest = httpRequest;
Vue.prototype.$httpTokenRequest = httpTokenRequest;
Vue.prototype.$goToLogin=goToLogin;
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()