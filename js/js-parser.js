// Wrap the third-party esprima parser in our own class so that we can more easily swap
// out for another implementation later if desired.
function JsParser() {
	this.types = getTypes();
	
	this.parse = function(code) {
		return esprima.parse(code);
	}
	
	function getTypes() {
		var types = [];
		for (type in esprima.Syntax) {
			types.push(esprima.Syntax[type]);
		}
		return types;
	}
}