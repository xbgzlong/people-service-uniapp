<template>
	<view class="container">
		<request-loading></request-loading>
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<!-- <view class="titleNview-placing"></view> -->
			<!-- 背景色区域 -->
			<view class="titleNview-text">12349便民服务</view>
			<view class="carouse-video">
				<video  id="myVideo" :src="src" objectFit="fill"
				 @error="videoErrorCallback" controls
				  poster="../../static/img/banner.png" @play='playMyVideo' ></video>
			</view>
		</view>
		<!-- 分类 -->
		<view class="cate-section">
			<view class="cate-item" @click="goToProductListPage(1)">
				<image src="/static/img/bmfw.png"></image>
				<text>便民服务</text>
			</view>
			<view class="cate-item" @click="goToProductListPage(2)">
				<image src="/static/img/jjyl.png"></image>
				<text>居家养老</text>
			</view>
			<view class="cate-item" @click="notDevalop">
				<image src="/static/img/wljg.png"></image>
				<text>为老机构</text>
			</view>
			<view class="cate-item" @click="notDevalop">
				<image src="/static/img/wlyp.png"></image>
				<text>为老用品</text>
			</view>
		</view>
		<view class="banner-img-box">
			<image src="/static/img/ggl.jpg" mode="scaleToFill"></image>
		</view>
		<!-- 便民服务 -->
		<view class="f-header m-t" @click="goToProductListPage(1)">
			<image src="/static/img/bmfw.png"></image>
			<view class="tit-box">
				<text class="tit">便民服务</text>
				<!-- <text class="tit2">Guess You Like It</text> -->
			</view>
			<text class="yticon icon-you"></text>
		</view>

		<view class="guess-section">
			<view v-for="(item, index) in bmgoodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.image" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.title}}</text>
				<text class="price">￥{{item.price}}</text>
			</view>
		</view>
		<!-- 猜你喜欢 -->
		<view class="f-header m-t"  @click="goToProductListPage(2)">
			<image src="/static/img/jjyl.png"></image>
			<view class="tit-box">
				<text class="tit">居家养老</text>
				<!-- <text class="tit2">Guess You Like It</text> -->
			</view>
			<text class="yticon icon-you"></text>
		</view>

		<view class="guess-section"  >
			<view v-for="(item, index) in ylgoodsList" :key="index" class="guess-item" @click="navToDetailPage(item)">
				<view class="image-wrapper">
					<image :src="item.image" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{item.title}}</text>
				<text class="price">￥{{item.price}}</text>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				src:"https://video-1255598775.cos.ap-nanjing.myqcloud.com/banner.mp4",
				videoContext:'',
				bmgoodsList: [],
				ylgoodsList: []
			};
		},
		onLoad() {
			
		},
		onReady() {
			this.videoContext = uni.createVideoContext('myVideo');
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
				let opts = {
					url: this.$bmBaseApi.getBmDisplayList,
					method: 'get'
				};
				this.$showLoading();
				
				this.$httpTokenRequest(opts, null).then(
					res => {
						this.$hideLoading()
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
							'config.webapi + "/serviceitem/getImg?data=" + data[i].F_MobileIMG + "&loginMark=" + logininfo.loginMark + "&token=" + logininfo.token'
							that.bmgoodsList = res.data.data;
							that.bmgoodsList.forEach(item => {
								item.image = that.$baseUrl + "serviceitem/getImg?data=" + item.F_MobileIMG + "&loginMark=" + logininfo.loginMark +
									"&token=" + logininfo.token;
								item.price = item.F_PriceStart;
								item.title = item.F_ServiceName;
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
				this.$httpTokenRequest(opts, null).then(
					res => {
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
							that.ylgoodsList = res.data.data;
							that.ylgoodsList.forEach(item => {
								item.image = that.$baseUrl + "serviceitem/getImg?data=" + item.F_MobileIMG + "&loginMark=" + logininfo.loginMark +
									"&token=" + logininfo.token;
								item.price = item.F_PriceStart;
								item.title = item.F_ServiceName;
							})
						} else {
							uni.showToast({
								title: res.data.code + res.data.info,
								duration: 1500
							})
						}
					})

			},
			notDevalop(){
				uni.showToast({
					title:"功能暂未开放",
					duration:1500
				})
			},
			playMyVideo(){
				
			},
			//详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.title;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			videoErrorCallback: function(e) {
				// uni.showModal({
				// 	content: e.target.errMsg,
				// 	showCancel: false
				// })
				console.log(e)
			},
			goToProductListPage(type) {
				
				if(type ==1){
					uni.switchTab({
					    url: '/pages/bmfw/index'
					});
				}else{
					uni.switchTab({
					    url: '/pages/jjyl/index'
					});
				}
			},

		},

	}
</script>

<style lang="scss">
	page {
		background: #f5f5f5;
	}

	.m-t {
		margin-top: 16upx;
	}

	/* 头部 视频 */
	.carousel-section {
		width: 100%;
		position: relative;
		padding-top: 0px;

		// .titleNview-placing {
		// 	height: var(--status-bar-height);
		// 	padding-top: 0px;
		// 	box-sizing: content-box;
		// }

		.titleNview-text {
			width: 100%;
			height: 140upx;
			background-color: #23e8e1;
			text-align: center;
			line-height: 140upx;
			color: #fff;
			font-size: 50upx;
		}

		.carouse-video {
			height: 450upx;
			width: 100%;
			background-color: #23e8e1;

			#myVideo {
				height: 450upx;
				width: 100%;
			}
		}

	}

	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		padding: 30upx 22upx;
		background: #fff;

		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
		}
	}

	.banner-img-box {
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.f-header {
		display: flex;
		align-items: center;
		height: 140upx;
		padding: 6upx 30upx 8upx;
		background: #fff;

		image {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}

		.tit-box {
			flex: 1;
			display: flex;
			flex-direction: column;
		}

		.tit {
			font-size: $font-lg +2upx;
			color: #font-color-dark;
			line-height: 1.3;
		}

		.tit2 {
			font-size: $font-sm;
			color: $font-color-light;
		}

		.icon-you {
			font-size: $font-lg +2upx;
			color: $font-color-light;
		}
	}



	/* 猜你喜欢 */
	.guess-section {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.guess-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
</style>
