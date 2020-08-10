<!--作者:于大明-->
<template>
	<view>
		<!--头部搜索-->
		<home-page-head @onChgSearch="onChgSearch" @onAddStu="addStu"></home-page-head>

		<!--列表展示-->
		<view class="page-center">
			<uni-swipe-action>
				<uni-swipe-action-item
					:options="swipeOption"
					@click="swiperClick($event, index)"
					v-for="(item, index) in calPageList"
					:key="item.id + index"
				>
					<view class="flex-1">
						<yyt-student :studentItem="item" @onSelectItem="selectItem" @toggleSel="toggleSel">
							<view slot="button">
								<button type="warn" plain="true" @tap.stop="deleteStudent(index)">
									删除
								</button>
							</view>
						</yyt-student>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>

			<view class="text-center" v-show="isAllLoad">
				----我也是有底线的-----
			</view>
			<view class="flex-column a-center d-flex" v-show="isEmpty">
				<image
					style="width: 140rpx;height: 120rpx;"
					src="https://pic.cwyyt.cn/upload/img/20200409/1216271627_empty-data.png"
				></image>
				<text>暂无数据</text>
			</view>
		</view>
	</view>
</template>

<script src="./homePage.js"></script>

<style lang="less" scoped>
@import url('homePage.less');
</style>
