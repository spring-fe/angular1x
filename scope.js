function Scope(){
	this.$$watchers = [];
}
//valueEq为真时，基于值的检查开启。
Scope.prototype.$watch = function(watchFn, listenerFn, valueEq){
	var watcher = {
		watchFn: watchFn,
		listenerFn: listenerFn || function() {},
		valueEq: !!valueEq
	};
	this.$$watchers.push(watcher);
}

Scope.prototype.$digestOnce = function(){
	var self = this;
	var dirty;
	_.forEach(this.$$watchers,function(watch){
		var newValue = watch.watchFn(self);
		var oldValue = watch.last;
		if(newValue !== oldValue){
			watch.listenerFn(newValue, oldValue, self);
			dirty = true;
		}
		watch.last = (watch.valueEq ? _.cloneDeep(newValue) : newValue);
	});
	return dirty;
}

Scope.prototype.$digest = function(){
	var ttl = 10;
	var dirty;
	do{
		dirty = this.$$digestOnce();
		if(dirty && !(ttl--)){
			throw "10 digest iterations reached";
		}
	}while(dirty);
}

//值相等检测函数
Scope.prototype.$$areEqual = function(newValue, oldValue, valueEq){
	if(valueEq){
		return _.isEqual(newValue, oldValue);//如果是对象或数组，递归按值比较
	}else{
		return newValue === oldValue ||
			(typeof newValue === 'number' && typeof oldValue === 'number'
				&& isNaN(newValue) && isNaN(oldValue));//非数字(NaN判断)
	}
}

Scope.prototype.$eval = function(expr, locals){
	return expr(this, locals);
}

Scope.prototype.$apply = function(expr){
	try{
		return this.$eval(expr);

	}finally{
		this.$digest();
	}
}