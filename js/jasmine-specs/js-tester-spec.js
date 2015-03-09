describe("Tests for JsTester.mustUse method", function() {
	var tester = new JsTester();

	it("returns true if a type is used", function() {
		var result = tester.mustUse("var testVar = 42;", "VariableDeclaration");
		expect(result).toBe(true);
	});
	
	it("returns true if a type is used, nested", function() {
		var result = tester.mustUse("for (var i = 0; i < 10; i++) {if (i == 5) {var testVar = 42;}}", "IfStatement");
		expect(result).toBe(true);
	});
			
	it("returns false when a type is not used", function() {
		var result = tester.mustUse("if (true) {var testVar = 42;}", "ForStatement");
		expect(result).toBe(false);
	});	
	
	it("throws error when there is a syntax error", function() {
		var badCode = function() { 
			var result = tester.mustUse("if (true) {var testVar = 42;}}", "ForStatement"); 
		};
		expect(badCode).toThrow();
	});	
});

describe("Tests for JsTester.mustNotUse method", function() {
	var tester = new JsTester();
	
	it("returns false if a type is used", function() {
		var result = tester.mustNotUse("var testVar = 42;", "VariableDeclaration");
		expect(result).toBe(false);
	});
	
	it("returns false if a type is used, nested", function() {
		var result = tester.mustNotUse("for (var i = 0; i < 10; i++) {if (i == 5) {var testVar = 42;}}", "IfStatement");
		expect(result).toBe(false);
	});
			
	it("returns true when a type is not used", function() {
		var result = tester.mustNotUse("if (true) {var testVar = 42;}", "ForStatement");
		expect(result).toBe(true);
	});	
	
	it("throws error when there is a syntax error", function() {
		var badCode = function() { 
			var result = tester.mustNotUse("if (true) {var testVar = 42;}}", "ForStatement"); 
		};
		expect(badCode).toThrow();
	});	
});

describe("Tests for JsTester.mustUseNested method", function() {
	var tester = new JsTester();
	
	it("returns true if type[1] is used inside type[0]", function() {
		var result = tester.mustUseNested("if (true) {var foo = 1;}", ["IfStatement", "VariableDeclaration"]);
		expect(result).toBe(true);
	});

	it("returns false if type[1] and type[0] are present but not nested", function() {
		var result = tester.mustUseNested("var foo = 1; if (true) {doSomething();}", ["IfStatement", "VariableDeclaration"]);
		expect(result).toBe(false);
	});	
	
	it("returns false if type[0] is present, but type[1] is not", function() {
		var result = tester.mustUseNested("if (true) {doSomething();}", ["IfStatement", "VariableDeclaration"]);
		expect(result).toBe(false);
	});	
	
	it("returns true if 3 types are nested inside each other", function() {
		var result = tester.mustUseNested("for (var i = 0; i < 10; i++) {if (i == 5) {var foo = 1;}}", ["ForStatement", "IfStatement", "VariableDeclaration"]);
		expect(result).toBe(true);
	});	

	it("returns true if 3 types are nested inside each other, even with intervening types", function() {
		var result = tester.mustUseNested("for (i = 0; i < 10; i++) {if (i == 5) { for (j = 0; j < 3; j++) {var foo = 1;}}}", ["ForStatement", "IfStatement", "VariableDeclaration"]);
		expect(result).toBe(true);
	});	
	
	it("returns false if 3 types are NOT nested inside each other", function() {
		var result = tester.mustUseNested("var foo = 1; for (var i = 0; i < 10; i++) {if (i == 5) {doSomething();}}; foo = 2;", ["ForStatement", "IfStatement", "AssignmentExpression"]);
		expect(result).toBe(false);
	});	
	
	it("returns true if 2 types are nested inside each other, even if other instances of type[0] exist", function() {
		var result = tester.mustUseNested("if (foo == 1) {doSomething();} if (foo == 2) {for (var i = 0; i < 10; i++) {doSomething();}}", ["IfStatement", "ForStatement"]);
		expect(result).toBe(true);
	});	

	it ("returns false if a type is not nested inside itself", function() {
		var result = tester.mustUseNested("if (foo == 1) {}", ["IfStatement", "IfStatement"]);
		expect(result).toBe(false);
	});
	
	it ("returns true if a type is  nested inside itself", function() {
		var result = tester.mustUseNested("if (foo == 1) {if (bar == 2) {doSomething();}}", ["IfStatement", "IfStatement"]);
		expect(result).toBe(true);
	});
	
	it ("returns true if types are nested inside the conditional of an if statement", function() {
		var result = tester.mustUseNested("if (getSomething(x < 0 ? 0 : x) == 1) {var x = 2;}", ["IfStatement", "CallExpression", "ConditionalExpression"]);
		expect(result).toBe(true);
	});
	
	it("throws error if types is not an array", function() {
		var badCode = function() { 
			var result = tester.mustUseNested("if (true) {var foo = 1;}", "IfStatement");
		};
		expect(badCode).toThrow();
	});
	
	it("throws error when there is a syntax error", function() {
		var badCode = function() { 
			var result = tester.mustUseNested("if (true) {var testVar = 42;}}", ["ForStatement", "IfStatement"]); 
		};
		expect(badCode).toThrow();
	});	
});

describe("Tests for JsTester.isValid method", function() {
	var tester = new JsTester();
	
	it("returns true if code is valid", function() {
		var result = tester.isValid("var testVar = 42;");
		expect(result).toBe(true);
	});
	
	it("returns false if code is not valid", function() {
		var result = tester.isValid("if (true) {var testVar = 42;}}");
		expect(result).toBe(false);
	});	
});

describe("Tests for README example", function() {
	var tester = new JsTester();

	it("returns true for all three examples", function() {
		var myCode = "try {if (a == 1) {doSomething();}} catch (err) {}";
		var result1 = tester.mustUse(myCode, "IfStatement");  
		var result2 = tester.mustNotUse(myCode, "ForStatement");
		var result3 = tester.mustUseNested(myCode, ["TryStatement", "IfStatement", "CallExpression"]);
		
		expect(result1 && result2 && result3).toBe(true);
	});
});