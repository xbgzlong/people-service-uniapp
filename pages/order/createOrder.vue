<template>
	<view>
		<view class="yt-list">
			<request-loading></request-loading>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit yticon icon-naozhong"></text>
				<picker class="desc-picker" mode="date" :value="date" :start="startDate"
				 :end="endDate" @change="bindDateChange">
					<view v-if="date" class="desc">{{date}}</view>
					<view v-else class="placeholder pickerfont" >请选择日期</view>
				</picker>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit yticon icon-naozhong"></text>
				<picker class="desc-picker" mode="time" :value="time" 
				  @change="bindTimeChange">
					<view v-if="time" class="desc">{{time}}</view>
					<view v-else class="placeholder pickerfont" >请选择时间</view>
				</picker>
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit yticon icon-shouhuodizhi"></text>
				<input class="desc" type="text" v-model="address" placeholder="请填写地点" placeholder-class="placeholder" />
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit yticon icon-yishouhuo"></text>
				<input class="desc" type="text" v-model="name" placeholder="请填写姓名" placeholder-class="placeholder" />
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit  yticon icon-dianhua-copy"></text>
				<input class="desc" type="text" v-model="phone" placeholder="请填写电话" placeholder-class="placeholder" />
			</view>
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit yticon icon-bianji"></text>
				<input class="desc" type="text" v-model="remake" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view>
		</view>

		<!-- 底部 -->
		<view class="footer">
			<text class="submit" @click="submit">提交订单</text>
		</view>



	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: {},
				date: '',
				address: "",
				name: "",
				phone: "",
				remake: "",
				time:"",
				endDate: '2040-08-08',
				startDate: "",
			}
		},
		onLoad(option) {
			//商品数据
			this.options = option;
			console.log(option);
		},
		methods: {
			bindDateChange(e) {
				this.date = e.target.value
			},
			bindTimeChange(e){
				this.time = e.target.value
			},
			submit() {
				var data = {};
				///新增时赋默认值
				data.servicetime = this.date + " " + this.time;
				data.F_CustomerAddress = this.address;
				data.F_CustomerRealName = this.name;
				data.F_CustomerMobile = this.phone;
				data.F_Description = this.remake;
				data.F_OrderStatus = "11";
				data.F_OrderStatusText = "新工单";
				data.F_OrderSource = "3";
				data.F_OrderSourceText = "移动端";
				data.F_OrderType = "2";
				data.F_OrderTypeText = "诉求";
				var providerData = {};
				providerData.F_ServiceId = this.options.serviceid;
				providerData.F_ServiceName = this.options.servicename;
				providerData.F_ServiceFullName = this.options.pName + ' --> ' + this.options.servicename;
				var serviceItemList = JSON.stringify(providerData);
				var postdatas = {
					orderinfo: data,
					sendJosn: serviceItemList
				}
				let logininfo = "";
				uni.getStorage({
					key: 'logininfo',
					success: function(ress) {
						logininfo = ress.data
					}
				});
				var postdata = {
					token: logininfo.token,
					loginMark: "Customer_" + logininfo.account, //learun.deviceId(),// 正式请换用设备号
					data: JSON.stringify(postdatas)
				};
				var that = this;
				let opts = {
					url: this.$bmBaseApi.postCreateOrder,
					method: 'post'
				};

				this.$httpRequest(opts, postdata).then(
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
							uni.navigateBack({
								index: 1
							})
						} else {
							uni.showToast({
								title: res.data.code + res.data.info,
								duration: 1500
							})
						}
					});

			},
			stopPrevent() {}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}
	.pickerfont{
		font-size: 22upx;
	}
	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		border-bottom: 1upx solid #F5F5F5;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 100upx;
		height: 100upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 36upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
		.desc-picker{
			width: 300upx;
			
		}
	}

	
	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 110upx;
		padding: 10upx 0;
		justify-content: space-between;
		font-size: 30upx;
		background: rgba(255, 255, 255, 0.7);
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 45upx;
			margin: 0 auto;
			width: 80%;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: $base-color;
		}
	}
</style>
