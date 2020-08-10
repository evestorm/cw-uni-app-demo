// 作者:于大明

//------------------------------mock数据引入---------------------------
import homePageMock from './homePage_mock.js';

//------------------------------组件引入-------------------------
import homePageHead from './home-page-head/home-page-head.vue';

import DemoStudentTe from '@/service/Demo/DemoStudentTeAppService.js';
import util from '@/common/util.js';

const PageConstData = {
	swipeOption: [{
		text: '删除',
		style: {
			backgroundColor: '#dd524d'
		}
	}]
}

export default {
	components: {
		homePageHead
	},
	data() {
		return {
			// 常量
			PageConstData,
			//-----------------------------页面相关--------------------------
			urlOption: {}, // url参数

			//-----------------------------表格相关--------------------------
			// 请求远程参数
			queryPage: {
				pageIndex: 1,
				pageSize: 5,
				order: 'createTime desc',
				studentName: '',
				className: '',
				isAppend: true // 控制是滚动底部刷新 还是上拉加载
			},
			// 列表数据参数 对应 homePageMock.pageList
			pageList: {
				dataList: [], // 返回的data数据
				pageCount: 0, // 多少页
				rowCount: 0 // 总共多少数据
			},
			selctId: '', // 选中的ID
			isAllSelect: false
		};
	},
	// 页面触底
	onReachBottom() {
		this.queryPage.isAppend = true;
		this.queryPage.pageIndex++;
	},
	// 页面下拉
	onPullDownRefresh() {
		this.queryPage.isAppend = false;
		this.queryPage.pageIndex++;
	},
	// 页面加载事件
	onLoad(options) {
		this.urlOption = options;
		this.getPageList();
		// 注册刷新表格事件
		uni.$on(this.$AppConst.DemoIndexConstData.listRefrsh, res => {
			// let item=res;
			// this.pageList.dataList.unshift(item);
			this.selctId = res.id;
			this.getPageList();
		});
	},
	// 顶部导航按钮事件
	onNavigationBarButtonTap(e) {
		if (e.text == '全选') {
			this.isAllSelect = !this.isAllSelect;
			this.calPageList.forEach(x => (x.selected = this.isAllSelect));
		} else if (e.text == '新增') {
			// 清除全局选择数据
			getApp().globalData.demoIndexPageData.selectStudent = {
				studentName: '',
				studentAge: 0,
				studentBirthday: '',
				studentHeight: 0,
				studentIsVip: 0,
				studentLevel: 0,
				classGUID: '',
				studentDesc: '',
				studentFavor: '',
				studentHeadUrl: ''
			};
			uni.navigateTo({
				url: '/pages/demoSub/demoEdit/demoEdit'
			});
		}
	},
	methods: {
		// 节流监听搜索改变
		onChgSearch: util.debounce(function(val) {
			if (!val) {
				delete this.queryPage.filter;
			} else {
				this.queryPage.filter = {
					type: 'and',
					innerType: 'or',
					conditions: [{
							attribute: 'studentName',
							datatype: 'nvarchar',
							operatoer: 'like',
							value: val
						},
						{
							attribute: 'className',
							datatype: 'nvarchar',
							operatoer: 'like',
							value: val
						}
					]
				};
			}
			this.queryPage.pageIndex = 1;
			this.getPageList();
		}, 1000),
		async getPageList() {
			// 第一次加载
			if (this.queryPage.pageIndex == 1) {
				this.pageList = await DemoStudentTe.GetViewPage(this.queryPage);
			} else if (this.pageList.rowCount > this.pageList.dataList.length) {
				//总的数据大于当前数据才加载
				let myPageList = await DemoStudentTe.GetViewPage(this.queryPage);
				// 控制下拉和触底刷新
				if (this.queryPage.isAppend) {
					myPageList.dataList = this.pageList.dataList.concat(myPageList.dataList);
				} else {
					myPageList.dataList = myPageList.dataList.concat(this.pageList.dataList);
					uni.stopPullDownRefresh(); // 停止下拉刷新
				}
				this.pageList = myPageList;
			} else {
				if (!this.queryPage.isAppend) {
					uni.showToast({
						title: '数据已全部加载'
					});
					uni.stopPullDownRefresh(); // 停止下拉刷新
				}
			}
		},
		// 点击滑块按钮
		swiperClick(e, index) {
			if (e.content.text == '删除') {
				this.deleteStudent(index);
			}
		},
		async deleteStudent(index) {
			let [error, res] = await uni.showModal({
				title: '提示',
				content: '是否删除'
			});

			if (res.confirm) {
				let res = await DemoStudentTe.DeleteByDto({
					id: this.calPageList[index].id
				});
				// this.calPageList.splice(index, 1);
				this.$util.removeArray(this.calPageList, this.calPageList[index]);
				console.log(this.pageList);
			}
		},
		// 选中某个Item
		selectItem(item) {
			this.selctId = item.id;
			getApp().globalData.demoIndexPageData.selectStudent = item;
		},
		// 切换某个学生的checkbox
		toggleSel(item) {
			item.selected = !item.selected;
			if (item.selected) {
				this.selctId = item.id;
			} else {
				this.selctId = '';
			}
		},
		// 新增学生
		addStu() {
			// 清除全局选择数据
			getApp().globalData.demoIndexPageData.selectStudent = {
				studentName: '',
				studentAge: 0,
				studentBirthday: '',
				studentHeight: 0,
				studentIsVip: 0,
				studentLevel: 0,
				classGUID: '',
				studentDesc: '',
				studentFavor: '',
				studentHeadUrl: ''
			};
			uni.navigateTo({
				url: '/pages/demoSub/demoEdit/demoEdit'
			});
		}
	},
	computed: {
		// 左滑参数
		swipeOption() {
			return [{
				text: '删除',
				style: {
					backgroundColor: '#dd524d'
				}
			}];
		},
		// 列表进行处理
		calPageList() {
			let dataList = this.$util.null2str(this.pageList.dataList);
			dataList.forEach((item, index) => {
				// 有初始化选中的Id 那么选中
				if (this.selctId == item.id) {
					this.$set(item, 'selected', true);
				} else {
					// 设置属性需要通过这种方式设置 不然没办法双向绑定  其他设置为false
					this.$set(item, 'selected', false);
				}
			});
			return dataList;
		},
		// 是否加载完成
		isAllLoad() {
			// 是空先展示空
			return !this.isEmpty && this.pageList.rowCount == this.pageList.dataList.length;
		},
		// 是否没有数据
		isEmpty() {
			return this.pageList.dataList.length == 0;
		}
	},
	filters: {},
	watch: {
		'queryPage.pageIndex': {
			handler(val, oldval) {
				this.getPageList();
			}
		}
	}
};
