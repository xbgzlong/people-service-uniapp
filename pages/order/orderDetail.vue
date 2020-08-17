<template>
	<view class="">
		<!--客户信息-->
		<view class="title" style="width:100%;text-align:left;background-color:#23E8E1">
			<text>客户信息</text>
		</view>
		<view class="lr-form-row">
			<text class="left">客户姓名:</text>
			<text class="right">{{od.F_CustomerRealName}}</text>
		   
		</view>
		<view class="lr-form-row">
			<text class="left">客户电话:</text>
			<text class="right">{{od.F_CustomerMobile}}</text>
		   
		</view>
		<view class="lr-form-row">
			<text class="left">详细地址:</text>
			<text class="right">{{od.F_CustomerAddress}}</text>
		    
		</view>
		
		<!--工单信息-->
		<view class="title" style="width:100%;text-align:left;background-color:#23E8E1">
		   <text>工单信息</text>
		</view>
		<view class="lr-form-row">
			<text class="left">工单编号:</text>
			<text class="right">{{od.F_OrderCode}}</text>
		    
		</view>
		<view class="lr-form-row">
			<text class="left">工单类型:</text>
			<text class="right">{{od.F_OrderTypeText}}</text>
		   
		</view>
		<view class="lr-form-row">
			<text class="left">工单状态:</text>
			<text class="right">{{od.F_OrderStatusText}}</text>
		    
		</view>
		<view class="lr-form-remark">
			<text class="left">工单备注:</text>
			<view class="textareabox">
				<textarea auto-height  class="textarea" :value="od.F_Description" disabled />
			</view>
			
		    
		</view>
		
		<!--派送信息-->
		<view class="title" style="width:100%;text-align:left;background-color:#23E8E1">
		    <text>派送信息</text>
		</view>
		<view class="lr-form-row">
			<text class="left">派送方式:</text>
			<text class="right">{{od.F_SendModeText}}</text>
		   
		</view>
		<view class="lr-form-row">
			<text class="left">派送类型:</text>
			<text class="right">{{od.F_SendTypeText}}</text>
		   
		</view>
		<view class="lr-form-row">
			
			<text class="left">服务项目:</text>
			<text class="right">{{od.F_ServiceName}}</text>
		    
		</view>
		<view class="lr-form-row">
			<text class="left">紧急程度:</text>
			<text class="right">{{od.F_SendUrgentText}}</text>
		   
		</view>
		<view class="lr-form-row">
			<text class="left">工单时限:</text>
			<text class="right">{{od.F_SendTimeLimitText}}</text>
		    
		</view>
		<view class="lr-form-row">
			<text class="left">派送时间:</text>
			<text class="right">{{od.F_SendFirstTime}}</text>
		   
		</view>
		<view class="lr-form-row">
			<text class="left">派送人员:</text>
			<text class="right">{{od.F_SendUserName}}</text>
		    
		</view>
		<view class="lr-form-row">
			<text class="left">派送建议:</text>
			<text class="right">{{od.F_SendRemark}}</text>
		   
		</view>
		<view class="lr-form-row">
			<text class="left">受理时间:</text>
			<text class="right">{{od.F_AcceptDate}}</text>
		   
		</view>
		<view class="lr-form-row">
			<text class="left">受理人员:</text>
			<text class="right">{{od.F_AcceptUserName}}</text>
		    
		</view>
		<view class="lr-form-remark">
			<text class="left">受理备注:</text>
			<view class="textareabox">
				<textarea auto-height  class="textarea" :value="od.F_AcceptRemark" disabled />
			</view>
			
		    
		</view>
		
		<!--回复信息-->
		<view class="title" >
		   <text>回复信息</text>
		</view>
		
		<view class="lr-form-remark">
			<text class="left">备注信息:</text>
			<view class="textareabox">
				<textarea auto-height  class="textarea" :value="od.F_ReplyRemark" disabled />
			</view>
			
		    
		</view>
		
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				od:{}
			}
			
		},
		onLoad(){
			
		},
		onShow() {
			var that = this;
			uni.getStorage({
			    key: 'orderDetail_key',
			    success: function (res) {
			        that.od = res.data;
			    }
			});
		},
		methods:{
			
		},
		
	}
</script>

<style lang="scss">
	.title{
		width:100%;
		height: 70upx;
		line-height: 70upx;
		text-align:left;
		padding-left: 50upx;
		background-color:#23E8E1;
		
	}
	.lr-form-row{
		width: 80%;
		box-sizing: border-box;
		margin:0 10%;
		height: 70upx;
		line-height: 70upx;
		border-bottom: 1upx solid #f5f5f5;
		font-size: 30upx;
		color: #555555;
	}
	.left{
		margin-right: 20upx;
	}
	.lr-form-remark{
		width: 80%;
		box-sizing: border-box;
		margin:0 10%;
		line-height: 70upx;
		border-bottom: 1upx solid #f5f5f5;
		font-size: 30upx;
		color: #555555;
		.textareabox{
			width: 100%;
			height: 140upx;
			width: 100%;
			border: 1upx solid #f5f5f5;
			margin-bottom: 20upx;
			.textarea{
				font-size: 30upx;
			}
		}
		
	}
</style>
