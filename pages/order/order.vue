<template>
	<view class="content">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
			<view class="chooseDate">
				<picker class="desc-picker" mode="date" :value="date"
				  @change="bindDateChange">
					<text class="yticon icon-lishijilu"></text>
				</picker>
				
			</view>
		</view>

		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view 
					class="list-scroll-content" 
					scroll-y
					@scrolltolower="tabItem.loadingType=='more'?loadData:''"
				>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>
					<!-- 订单列表 -->
					<view 
						v-for="(item,index) in tabItem.orderList" :key="index"
						class="order-item"
					>
						<view class="i-top b-b">
							<text class="time">创建时间：{{item.F_CreateDate}}</text>
							<text class="state" style="{color: #fa436a}">{{item.F_OrderStatusText}}</text>
							<text 
								v-if="item.F_OrderStatusText===9" 
								class="del-btn yticon icon-iconfontshanchu1"
								@click="deleteOrder(index)"
							></text>
						</view>
						<view class="price-box">
							<text class="num">服务项目:</text>
							<text class="price">{{item.F_ServiceFullName}}}</text>
						</view>
						<view class="price-box">
							<text class="num">客户姓名:</text>
							<text class="price">{{item.F_CustomerRealName}}</text>
						</view>
						<view class="price-box">
							<text class="num">联系电话:</text>
							<text class="price">{{item.F_CustomerMobile}}</text>
						</view>
						<view class="price-box">
							<text class="num">详细地址:</text>
							<text class="price">{{item.F_CustomerAddress}}</text>
						</view>
						<view class="price-box">
							<text class="num">工单编号:</text>
							<text class="price">{{item.F_OrderCode}}</text>
						</view>
						<view class="price-box">
							<text class="num">工单备注:</text>
							<text class="price">{{item.F_Description}}</text>
						</view>
						
						<!-- <view class="action-box b-t" v-if="item.state != 9">
							<button class="action-btn" @click="cancelOrder(item)">取消订单</button>
							<button class="action-btn recom">立即支付</button>
						</view> -->
					</view>
					 
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
					
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template> 

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import Json from '@/Json';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				begin:"",
				end:"",
				date:"",
				tabCurrentIndex: 0,
				page:1,
				navList: [{
						state: 0,
						text: '全部订单',
						loadingType: 'more',
						orderList: []
					},
					// {
					// 	state: 1,
					// 	text: '未分配',
					// 	loadingType: 'more',
					// 	orderList: []
					// },
					// {
					// 	state: 2,
					// 	text: '未服务',
					// 	loadingType: 'more',
					// 	orderList: []
					// },
					
				],
			};
		},
		
		onLoad(options){
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			this.page = 1;
			this.bigan = '';
			this.end = '';
			this.tabCurrentIndex = +options.state;
			// #ifndef MP
			this.loadData()
			// #endif
			// #ifdef MP
			if(options.state == 0){
				this.loadData()
			}
			// #endif
			
		},
		 
		methods: {
			//获取订单列表
			loadData(source){
				//这里是将订单挂载到tab列表下
				var that = this;
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				if(source === 'tabChange' && navItem.loaded === true){
					//tab切换只有第一次需要加载数据
					return;
				}
				if(navItem.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				navItem.loadingType = 'loading';
				setTimeout(()=>{
					that.doGetUserorderquery();
					
				}, 600);	
			}, 
			// 获取数据
			doGetUserorderquery(){
				var that = this;
				let navItem = this.navList[this.tabCurrentIndex];
				let opts = {
					url: this.$bmBaseApi.getUserorderquery,
					method: 'get'
				};
				let _postParam = {
				    pagination: {
				        rows: 10,
				        page: this.page,
				        sidx: 'F_CreateDate',
				        sord: 'DESC'
				    },
				    queryJson: '{}'
				};
				if (that.begin && that.end) {
				    _postParam.queryJson = JSON.stringify({ StartTime: that.begin, EndTime: that.end });
				}
				this.$httpTokenRequest(opts, _postParam).then(
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
							let orderList = res.data.data.rows;
							if(orderList){
								orderList.forEach(item=>{
									navItem.orderList.push(item);
								})
								//loaded 新字段用于表示数据加载完毕，如果为空可以显示空白页
								that.$set(navItem, 'loaded', true);
								navItem.loadingType = 'more';
								if(orderList.length<10){
									//判断是否还有数据， 有改为 more， 没有改为noMore 
									navItem.loadingType = 'noMore';
								}
							}else{
								navItem.loadingType = 'noMore';					
							}					
						} else {
							uni.showToast({
								title: res.data.code + res.data.info,
								duration: 1500
							})
							return false;
						}
					});
			},
			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			date_time() {
				var date = new Date();
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? '0' + m : m;
				var d = date.getDate();
				d = d < 10 ? '0' + d : d;
				
				var timeStr = y + '-' + m + '-' + d;
				return timeStr;
			},
			bindDateChange(e) {
				this.date = e.target.value;
				this.begin = e.target.value;
				this.end = this.date_time();
				this.page = 1;
				this.loadData();
			},
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
			//删除订单
			deleteOrder(index){
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(()=>{
					this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
					uni.hideLoading();
				}, 600)
			},
			//取消订单
			cancelOrder(item){
				uni.showLoading({
					title: '请稍后'
				})
				setTimeout(()=>{
					let {stateTip, stateTipColor} = this.orderStateExp(9);
					item = Object.assign(item, {
						state: 9,
						stateTip, 
						stateTipColor
					})
					
					//取消订单后删除待付款中该项
					let list = this.navList[1].orderList;
					let index = list.findIndex(val=>val.id === item.id);
					index !== -1 && list.splice(index, 1);
					
					uni.hideLoading();
				}, 600)
			},

			//订单状态文字和颜色
			orderStateExp(state){
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch(+state){
					case 1:
						stateTip = '待付款'; break;
					case 2:
						stateTip = '待发货'; break;
					case 9:
						stateTip = '订单已关闭'; 
						stateTipColor = '#909399';
						break;
						
					//更多自定义
				}
				return {stateTip, stateTipColor};
			}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
	}
	
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.chooseDate{
			height: 40px;
			.yticon {
				font-size: 44upx;
				color: #5eba8f;
				margin: 0 16upx 0 26upx;
				line-height: 40px;
			}
		}
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 100%;
					color: #fff;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.uni-swiper-item{
		height: auto;
	}
	.order-item{
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin-top: 16upx;
		.i-top{
			display: flex;
			align-items: center;
			height: 80upx;
			padding-right:30upx;
			font-size: $font-base;
			color: $font-color-dark;
			position: relative;
			.time{
				flex: 1;
			}
			.state{
				color: $base-color;
			}
			.del-btn{
				padding: 10upx 0 10upx 36upx;
				font-size: $font-lg;
				color: $font-color-light;
				position: relative;
				&:after{
					content: '';
					width: 0;
					height: 30upx;
					border-left: 1px solid $border-color-dark;
					position: absolute;
					left: 20upx;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
		.price-box{
			display: flex;
			justify-content: flex-start;
			align-items: baseline;
			padding: 20upx 20upx;
			font-size: $font-sm ;
			color: $font-color-light;
			.num{
				margin: 0 8upx;
				color: $font-color-dark;
			}
			.price{
				font-size: $font-sm;
				color: $font-color-dark;
				&:before{
					// content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}
		.action-box{
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;
			padding-right: 30upx;
		}
		.action-btn{
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-left: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			&:after{
				border-radius: 100px;
			}
			&.recom{
				background: #fff9f9;
				color: $base-color;
				&:after{
					border-color: #f7bcc8;
				}
			}
		}
	}
	
	
	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}
	
	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}
	
	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}
	
	.uni-load-more__img>view {
		position: absolute
	}
	
	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}
	
	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}
	
	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}
	
	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}
	
	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}
	
	.load2 {
		transform: rotate(30deg)
	}
	
	.load3 {
		transform: rotate(60deg)
	}
	
	.load1 view:nth-child(1) {
		animation-delay: 0s
	}
	
	.load2 view:nth-child(1) {
		animation-delay: .13s
	}
	
	.load3 view:nth-child(1) {
		animation-delay: .26s
	}
	
	.load1 view:nth-child(2) {
		animation-delay: .39s
	}
	
	.load2 view:nth-child(2) {
		animation-delay: .52s
	}
	
	.load3 view:nth-child(2) {
		animation-delay: .65s
	}
	
	.load1 view:nth-child(3) {
		animation-delay: .78s
	}
	
	.load2 view:nth-child(3) {
		animation-delay: .91s
	}
	
	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}
	
	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}
	
	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}
	
	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}
	
	@-webkit-keyframes load {
		0% {
			opacity: 1
		}
	
		100% {
			opacity: .2
		}
	}
</style>
