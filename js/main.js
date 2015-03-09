var tester = new JsTester();
var tests = [];

var methodDisplayNames = {
	"mustUse": "Must use",
	"mustNotUse": "Must NOT use",
	"mustUseNested": "Must use nested"
};

var types = tester.types;

// Initialize the application when the document is ready
$(document).ready(function() {
	for (var method in methodDisplayNames) {
		$("#new-test-method").append("<option value='" + method + "'>" + methodDisplayNames[method] + "</option>");
	}

	for (var i in types) {
		$("#new-test-type-single").append("<option>" + types[i] + "</option>");
	}
		
	buildTestList();
	runTests();
});
	
// Run all the tests
function runTests() {
	// If the code is not valid, set all results to false and don't run the other tests
	if (tester.isValid(getEditorText())) {
		displayResult($("#is-valid-result"), true);
	} else {
		displayResult($("#is-valid-result"), false);
		for (var i in tests) {
			displayResult($("#test-result-" + i), false);
		}			
		return;
	}

	for (var i = 0; i < tests.length; i++) {
		var result = tester[tests[i].method](getEditorText(), tests[i].argument);
		displayResult($("#test-result-" + i), result);
	}
}

// Based on whether or not the test passed, set the UI for images
function displayResult(element, passed) {
	if (passed) {
		element.attr("src", "images/check.png");
		element.attr("alt", "Test Passed");
		element.attr("title", "Test Passed");
	} else {
		element.attr("src", "images/x.png");
		element.attr("alt", "Test Failed");
		element.attr("title", "Test Failed");	
	}
}

// Add a test to the list, rebuild the UI, and run the tests
function addTest() {
	var arg;
	
	if ($("#new-test-method").val() == "mustUseNested") {
		arg = [];
		$(".new-test-type-multi").each(function() {
			if ($(this).val() !== "") {
				arg.push($(this).val());
			}
		});
		if (arg.length == 0) {
			alert("Please choose at least one type");
			return;
		}
	} else {
		arg = $("#new-test-type-single").val();
	}
	
	tests.push({method: $("#new-test-method").val(), argument: arg});
	buildTestList();
	runTests();
}

// Remove a test from the list, rebuild the UI, and run the tests
function removeTest(index) {
	tests.splice(index, 1);
	buildTestList();
	runTests();
}

// Add a type dropdown with the given index
function addTypeDropdown(index) {
	var newDropdown = '<select id="new-test-type-' + index + '" class="new-test-type-multi" onchange="newTypeMultiSelected(' + index + ');"></select>';
	$("#new-test-type-multi").append(newDropdown);
	populateTypeMultiDropdown(index);
}

// Populate the dropdown list of types with the given index
function populateTypeMultiDropdown(index) {
	$("#new-test-type-" + index).append("<option value=''>NONE</option>");
	for (var i in types) {
		$("#new-test-type-" + index).append("<option>" + types[i] + "</option>");
	}
}

// Handle event when a test method is selected from the dropdown
// Show/hide controls based on whether the method takes a single type or multiple
function methodSelected() {
	// Currently mustUseNested is the only method that takes multiple types
	if ($("#new-test-method").val() == "mustUseNested") {
		$("#new-test-type-single").hide();
		$("#new-test-type-multi").show();
		
		// Get rid of any previously selected types and just show one
		$("#new-test-type-multi").empty();
		addTypeDropdown(0);
	} else {
		$("#new-test-type-single").show();
		$("#new-test-type-multi").hide();
	}
}

// Handle event where a type is selected for a test that takes multiple types 
function newTypeMultiSelected(index) {
	// If this is the last one currently displayed and value is something other than blank
	if (index == $(".new-test-type-multi").length - 1) {
		var dropdown = $("#new-test-type-" + index);
		if (dropdown.val() !== "") {
			addTypeDropdown(index + 1);

		}
	}
}

// Build the HTML for the list of tests/results and add it to the DOM
function buildTestList() {
	var testList = $("#test-list");
	$(".js-test").remove();
	for (var i in tests) {
		var li = "<li class='js-test'><img id='test-result-" + i + "' class='test-result icon' src='images/x.png' />" + 
			methodDisplayNames[tests[i].method] + " " + 
			tests[i].argument +
			"<img id='test-delete-" + i + "' alt='Delete Test' title='Delete Test'  class='test-delete icon clickable' src='images/delete.png' onclick='removeTest(" + i + ");' />"
			"</li>";
		testList.append(li);
	}
}