<template>
	<view class="container">
		<view class="avatar-box b-b m-t"  hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-avatar">头像</text>
			<image :src="userinfo.url || '../../static/img/on-boy.jpg' " class="cell-img" mode=""></image>
		</view>
		<view v-if="userinfo.account" class="list-cell b-b"  hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">账号</text>
			<text class="cell-more">{{userinfo.account}}</text>
		</view>
		<view v-if="userinfo.realName" class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">姓名</text>
			<text class="cell-more ">{{userinfo.realName}}</text>
		</view>
		<view v-if='userinfo.gender'  class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">性别</text>
			<text v-if='userinfo.gender==1' class="cell-more">男</text>
			<text v-else class="cell-more">女</text>
		</view>
		<view v-if='userinfo.company'  class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">公司</text>
			<text class="cell-more">{{userinfo.company}}</text>
		</view>
		<view v-if='userinfo.department'  class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">部门</text>
			<text class="cell-more ">{{userinfo.department}}</text>
		</view>
		
		<!-- <view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#fa436a" @change="switchChange" />
		</view> -->
		<!-- <view class="list-cell m-t b-b" @click="navTo('清除缓存')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">清除缓存</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<!-- <view class="list-cell b-b" @click="navTo('关于Dcloud')" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">关于Dcloud</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell">
			<text class="cell-tit">检查更新</text>
			<text class="cell-tip">当前版本 1.0.3</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">退出登录</text>
		</view>
	</view>
</template>

<script>
	import {  
	    mapMutations  
	} from 'vuex';
	export default {
		data() {
			return {
				userinfo:''
			};
		},
		onLoad() {
			var userinfo = ''
			uni.getStorage({
			    key: 'userinfo',
			    success: function(ress) {
			        userinfo = ress.data;
			    }
			});
			this.userinfo = userinfo;
		},
		methods:{
			...mapMutations(['logout']),

			navTo(url){
				this.$api.msg(`跳转到${url}`);
			},
			//退出登录
			toLogout(){
				uni.showModal({
				    content: '确定要退出登录么',
				    success: (e)=>{
				    	if(e.confirm){
				    		this.logout();
				    		setTimeout(()=>{
				    			uni.navigateTo({
				    				url: '/pages/public/login'
				    			});
				    		}, 200)
				    	}
				    }
				});
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.avatar-box{
		padding: 20upx;
		line-height:100upx;
		background: #fff;
		border-bottom: 1upx solid #E4E7ED;
		.cell-avatar{
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-img{
			height: 100upx;
			width: 100upx;
			float: right;
			vertical-align:middle;
		}
	}
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		vertical-align:middle;
		&.log-out-btn{
			width: 80%;
			border-radius: 60upx;
			background: $base-color;
			margin: 40upx auto;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				font-size:$font-base +6upx ;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
