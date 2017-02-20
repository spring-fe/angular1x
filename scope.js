function Scope(){
	this.$$watchers = [];
}

Scope.prototype.$watch = function(watchFn, listenerFn){
	var watcher = {
		watchFn: watchFn,
		listenerFn: listenerFn
	};
	this.$$watchers.push(watcher);
}