// 对象转url参数
/**
 * @param {Object} obj数据
 * @param {Object} 第一个字符
 * @param {Object} key
 * @param {Object} encode
 */
function urlEncode(param, firstSymbol, key, encode) {
	if (param == null || Object.keys(param).length === 0) return '';
	let paramStr = '';
	let t = typeof(param);
	if (t == 'string' || t == 'number' || t == 'boolean') {
		paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
	} else {
		for (let i in param) {
			let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
			paramStr += urlEncode(param[i], '&', k, encode)
		}
	}

	firstSymbol = firstSymbol || '&';

	paramStr = firstSymbol + paramStr.substring(1, paramStr.length);
	return paramStr;
}

/**
 * null => ''
 * @param {*} data 要处理的数据
 */
function null2str(data) {
	for (let x in data) {
		if (data[x] === null) { // 如果是null 把直接内容转为 ''
			data[x] = '';
		} else {
			if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
				data[x] = data[x].map(z => {
					return null2str(z);
				});
			}
			if (typeof(data[x]) === 'object') { // 是json 递归继续处理
				data[x] = null2str(data[x])
			}
		}
	}
	return data;
}

// 获取当前界面和完整参数
function getCurrentPageUrl() {
	let pages = getCurrentPages(); // 获取加载的页面
	let currentPage = pages[pages.length - 1]; // 获取当前页面的对象
	let url = currentPage.route; // 当前页面url
	return url;
}

// 获取当前页带参数的url
function getCurrentPageUrlAndArgs() {
	let pages = getCurrentPages(); //获取加载的页面
	let currentPage = pages[pages.length - 1]; //获取当前页面的对象
	let url = currentPage.route; //当前页面url
	let options = currentPage.options || currentPage.$route.query; //如果要获取url中所带的参数可以查看options

	//拼接url的参数
	let urlWithArgs = url + '?';

	for (let key in options) {
		let value = options[key];
		urlWithArgs += key + '=' + value + '&';
	}

	urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
	return urlWithArgs;
}

/**
 * @description: 记录百度事件 https://tongji.baidu.com/web/help/article?id=236&type=0
 * @param {eventName} 事件名称 比如打电话 关单
 * @param {eventRemark} 事件备注  比如 首页底部打电话按钮触发
 * @example this.$util.baiduEvent('客户搜索','首页顶部客户搜索');
 */
function baiduEvent(eventName, eventRemark = '') {
	let pageUrl = getCurrentPageUrl();
	let userInfo = getApp().globalData.userInfo;
	if (userInfo) {
		let remark = {}
		_hmt.push(['_trackEvent', remark.storeName, remark.userName, eventRemark, JSON.stringify(remark)])
	}
}

/**
 * @description: 用于发送某个指定URL的PV统计请求  https://tongji.baidu.com/web/help/article?id=235&type=0
 * @param {pageUrl} 页面的URl
 * @example this.$util.baiduPageView();
 */
function baiduPageView(pageUrl) {
	let userInfo = getApp().globalData.userInfo;
	if (userInfo) {
		// 加上storeId
		pageUrl = `${pageUrl}?storeId=${userInfo.currentStoreId}`
		_hmt.push(['_setAutoPageview', false]);
		_hmt.push(['_trackPageview', pageUrl]);
	}
}

/**
 * @description: 防抖函数：函数被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时
 * @param {Function} fn 要执行的函数
 * @param {Number} delay  delay毫秒后执行回调
 */
function debounce(fn, delay = 500) {
	let timer = null;
	return function() {
		const context = this;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn.apply(context, arguments);
			timer = null;
		}, delay);
	};
}

/**
 * @description: 节流函数：规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行
 * @param {Function} fn 要执行的函数
 * @param {Number} gapTime  单位时间
 */
function throttle(fn, gapTime = 500) {
	let canUse = true;
	return function() {
		if (canUse) {
			fn.apply(this, arguments);
			canUse = false;
			setTimeout(() => (canUse = true), gapTime);
		}
	};
}

function removeArray(_arr, _obj) {
	var length = _arr.length;
	for (var i = 0; i < length; i++) {
		if (_arr[i] == _obj) {
			if (i == 0) {
				_arr.shift(); //删除并返回数组的第一个元素
				return _arr;
			} else if (i == length - 1) {
				_arr.pop(); //删除并返回数组的最后一个元素
				return _arr;
			} else {
				_arr.splice(i, 1); //删除下标为i的元素
				return _arr;
			}
		}
	}
}


export default {
	urlEncode,
	null2str,
	getCurrentPageUrl,
	getCurrentPageUrlAndArgs,
	baiduEvent,
	baiduPageView,
	debounce,
	throttle,
	removeArray
}
