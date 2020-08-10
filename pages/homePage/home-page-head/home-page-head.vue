<!--作者:于大明-->
<template>
	<view class="home-page-head">
		<uni-nav-bar :fixed="false" color="#333333" background-color="#FFFFFF">
			<block slot="left">
				<view class="row a-center">
					<!-- <uni-icons type="search" color="#333333" size="22" /> -->
					<view>查询：</view>
				</view>
			</block>
			<view class="d-flex a-center bg-gray radius-20 " style="height: 60rpx;line-height: 60rpx; width: 500rpx;">
				<uni-icons type="search" size="22" color="#666666" />
				<input confirm-type="search" type="text" v-model="searhText" />
			</view>
			<block slot="right">
				<view class="row a-center" @tap="_onAddStu">
					<view>新增</view>
				</view>
			</block>
		</uni-nav-bar>
	</view>
</template>

<script>
export { default } from './home-page-head.js';
</script>

<style lang="less" scoped>
@import url('home-page-head.less');
</style>
