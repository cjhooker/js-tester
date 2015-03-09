// Tests whether a piece of JavaScript codes contains certain functionality or structure
function JsTester() {
	var parser = new JsParser();
	
	// A list of all the valid types to pass to other methods
	this.types = parser.types;
	
	// Require that the code syntax is valid
	this.isValid = function(code) {
		try {
			// Parser will throw an error if the code is not valid
			parser.parse(code);
			return true;
		}
		catch (err) {
			return false;
		}
	}
	
	// Require that the code use a particular type (e.g. IfStatement or ForStatement)
	// Return true if it does, false otherwise
	this.mustUse = function(code, type) {	
		var syntaxTree = parser.parse(code);
		var matches = getObjects(syntaxTree, "type", type);
		return (matches.length > 0);
	}
	
	// Require that the code NOT use a particular type (e.g. IfStatement or ForStatement)
	// Return false if it does use it, true otherwise
	this.mustNotUse = function(code, type) {
		return !this.mustUse(code, type);	
	}

	// Require that the code use a particular structure of nested types (e.g. IfStatement or ForStatement)
	// typeArray is a list of the types that must be used, starting with the outermost type, and each
	// subsequent type must be nested within the previous type. It is not required that the types be nested 
	// directly within each other.
	// Return true if the code contains all the types nested in order, false otherwise.
	this.mustUseNested = function(code, types) {
		if (types.constructor !== Array) {
			throw "types argument must be an Array";
		}
		var syntaxTree = parser.parse(code);
		
		return findNested(syntaxTree, types);
	}
	
	// Recursively search through the syntax tree for a nested list of types
	function findNested(syntaxTree, types) {
		var matches = getObjects(syntaxTree, "type", types[0]);
		
		if (matches.length == 0) return false;
		
		// If we're at the end of the list of nested types, and we got a match, return true
		if (types.length == 1) return true;
		
		// If we're not at the end of the list, recursively go deeper into each match
		for (var i in matches) {
			var result = findNested(matches[i], types.slice(1, types.length));
			
			// If recursively searching any branch returns true, return true
			// Otherwise, keep looping through the branches
			if (result) return true;
		}
		
		return false;
	}
	
	// Return list of objects within obj (recursively) that match the given key and value
	// Top-level calls to this function will generally NOT include the root element of object as a match,
	// whereas the recursive calls always do. This is to handle the case of testing for a key/value pair 
	// that is nested within itself, to make sure we don't get false positives.
	function getObjects(object, key, value, includeSelf) {
		if (includeSelf === null) includeSelf = false;
		var objects = [];
		for (var i in object) {		
			if (!object.hasOwnProperty(i)) continue;
		
			if (typeof object[i] == 'object') {
				objects = objects.concat(getObjects(object[i], key, value, true));
			} else if (includeSelf == true && i == key && object[key] == value) {
				objects.push(object);
			}
		}
		return objects;
	}
}