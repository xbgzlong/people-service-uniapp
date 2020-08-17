<template>
	<view class="content">
		<request-loading></request-loading>
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)">
				{{item.name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view class="s-list">
				<view class="s-item">{{typeName}}</view>
				<view class="t-list">
					<view @click="navToList(item)" class="t-item" v-for="item in tlist" :key="item.id">
						<image :src="item.picture"></image>
						<text class="price-box">¥{{item.price}}</text>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 0,
				serviceId: "",
				flist: [],
				slist: [],
				tlist: [],
				typeName: '',
			}
		},
		
		onLoad(options) {
			if (options) {
				console.log(options)
			}
			
		},
		onShow() {
			this.loadData();
		},
		methods: {
			loadData() {
				var that = this;
				let userinfo = "";
				uni.getStorage({
				    key: 'userinfo',
				    success: function(ress) {
				        userinfo = ress.data
				    }
				});
				if (!userinfo) {
					uni.showModal({
					    title: '提示',
					    content: '您还未登录',
						showCancel:false,
					    success: function (res) {
					        if (res.confirm) {
					           uni.navigateTo({
					               url: '/pages/public/login'
					           });
					        } 
					    }
					});
					return
				}
				var typeId = 2;
				
				let opts = {
					url: this.$bmBaseApi.getServiceitemList,
					method: 'get'
				};
				let param = {};
				param.queryJson = JSON.stringify({
					typeId: typeId
				});
				this.$showLoading();
				this.$httpTokenRequest(opts, param).then(
					res => {
						that.$hideLoading();
						let logininfo = "";
						uni.getStorage({
							key: 'logininfo',
							success: function(ress) {
								logininfo = ress.data
							}
						});
						if (!logininfo) {
							return false;
						}
						if (res.data.code == 200) {
							that.flist = res.data.data;
							that.flist.forEach((item, index) => {
								item.name = item.F_ServiceName;
								item.id = index;
							})
							that.typeName = that.flist[0].F_ServiceName;
							that.pName = that.flist[0].F_ServiceName;
							that.pId = that.flist[0].F_ServiceId;
							that.doGetServiceList(that.flist[0].F_ServiceId);

						} else  {
							uni.showToast({
								title: res.data.code + res.data.info,
								duration: 1500
							})
							if(res.data.code == 410){
								uni.navigateTo({
									url:"/pages/public/login"
								})
							}
						}
					});


				// let list = await this.$api.json('cateList');
				// list.forEach(item=>{
				// 	if(!item.pid){
				// 		this.flist.push(item);  //pid为父级id, 没有pid或者pid=0是一级分类
				// 	}else if(!item.picture){
				// 		this.slist.push(item); //没有图的是2级分类
				// 	}else{
				// 		this.tlist.push(item); //3级分类
				// 	}
				// }) 

			},
			doGetServiceList(F_ServiceId) {
				var that = this;
				let opts = {
					url: this.$bmBaseApi.getTypepagelist,
					method: 'get'
				};
				let _postParam = {
					pagination: {
						rows: 100,
						page: 0,
						sidx: 'F_CreateDate',
						sord: 'DESC'
					},
					queryJson: JSON.stringify({
						pId: F_ServiceId
					})
				};
				// if (param.multipleData) {
				//     _postParam.queryJson = JSON.stringify(multipleData);
				// }
				this.$showLoading();
				this.$httpTokenRequest(opts, _postParam).then(
					res => {
						that.$hideLoading();
						let logininfo = "";
						uni.getStorage({
							key: 'logininfo',
							success: function(ress) {
								logininfo = ress.data
							}
						});
						if (!logininfo) {
							return false;
						}
						if (res.data.code == 200) {
							that.tlist = res.data.data.rows;
							that.tlist.forEach((item, index) => {
								item.name = item.F_ServiceName;
								item.id = index;
								if (item.F_PriceStart) {
									item.price = item.F_PriceStart;
								} else {
									item.price = 0;
								}
								item.picture = that.$baseUrl + "serviceitem/getImg?data=" + item.F_MobileIMG + "&loginMark=" + logininfo.loginMark +
									"&token=" + logininfo.token;
							})

						} else {
							uni.showToast({
								title: res.data.code + res.data.info,
								duration: 1500
							})
							if(res.data.code == 410){
								uni.navigateTo({
									url:"/pages/public/login"
								})
							}
						}
					});
			},
			// 一级分类点击
			tabtap(item) {
				if (!this.sizeCalcState) {
					this.calcSize();
				}
				this.currentId = item.id;
				this.typeName = item.F_ServiceName;
				this.pId = item.F_ServiceId;
				this.pName = item.F_ServiceName;
				this.doGetServiceList(item.F_ServiceId);
				let index = this.slist.findIndex(sitem => sitem.pid === item.id);
				this.tabScrollTop = this.tlist[0].top;

			},
			//右侧栏滚动
			asideScroll(e) {
				if (!this.sizeCalcState) {
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item => item.top <= scrollTop).reverse();
				if (tabs.length > 0) {
					this.currentId = tabs[0].pid;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize() {
				let h = 0;
				this.slist.forEach(item => {
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(item) {
				uni.navigateTo({
					url: '/pages/product/product?id=' + item.F_ServiceId + "&pId=" + this.pId + "&pName=" + this.pName
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}

	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}

	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;

		&.active {
			color: $base-color;
			background: #f8f8f8;

			&:before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside {
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}

	.s-item {
		width: 100%;
		display: flex;
		text-align: center;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
	}

	.price-box {

		color: $uni-color-primary;
	}

	.t-list {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;

		&:after {
			content: '';
			flex: 99;
			height: 0;
		}
	}

	.t-item {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 250upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;

		image {
			width: 140upx;
			height: 140upx;
		}
	}
</style>
