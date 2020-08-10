// 作者:于大明

export default {
	name: 'home-page-head',
	// 注册属性
	props: {
		onAddStu: {
			type: Function,
		}
	},
	created(){
		
	},
	data() {
		return {
			// 查找的字符串
			searhText: ''
		};
	},
	methods: {
		// 注册事件 注意 暴露给外面的事件 以_on开头 里面的事件不用
		_onClick() {
			this.$emit('onClick');
		},
		_onAddStu() {
			this.$emit('onAddStu');
		}
	},
	computed: {
		// items(){
		// 	return this.inputItems;
		// }
	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	watch: {
		searhText(v,o){
			this.$emit('onChgSearch',v);
		}
	}
};