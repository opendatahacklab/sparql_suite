/**
 * SPARQL processor is a javascript library to query a sparql endpoint.
 * It has been developed in the context of the PON project PRISMA - PiattafoRme cloud Interoperbili per SMArt-government,
 * and it is release under the CC-BY 2.0 license (see http://creativecommons.org/licenses/by/2.0/)
 *
 * @author Cristiano Longo, Andrea Costazza.
 * 
 * @licstart  The following is the entire license notice for the 
 * JavaScript code in this page.
 * 
 * Copyright 2016 Cristiano Longo, Andrea Costazza
 * 
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms  of the GNU Lesser General 
 * Public License as published by the Free Software Foundation, either version 
 * 3 of the License, or  (at your option) any later version. The code is distributed 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 * 
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.   
 * 
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 */

/**
 * Helper function to print strings in HTML elements.
 * See https://css-tricks.com/snippets/javascript/htmlentities-for-javascript/
 */
function htmlentities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/**
 * Perform a query against the specified endpoint and process results by the
 * given processor object. The queryProcessor object must have the attribute query,
 * which returns the query which will be performed against the specified endpoint,
 * and the two methods
 * process(row) , which will be invoked to process each row in the result set (sequentially) and
 * flush(), which is called  when all the result set rows has been processed.
 *
 * @param endpoint URI of the sparql endpoint 
 * @param queryProcessor is an object delegate to specify the uery and handle the query result
 * 
 * @return the performed query, for debugging purposes
 */
function sparql_query(endpoint, queryProcessor){
	var querypart = "query=" + encodeURIComponent(queryProcessor.query);
	// Get our HTTP request object.
	var xmlhttp = new XMLHttpRequest();
	//Include POST OR GET
	xmlhttp.open('POST', endpoint, true); 
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.setRequestHeader("Accept", "application/sparql-results+json");	
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState==4 ){
			if(xmlhttp.status==200){				
				//Request accept				
				var resultAsJson=eval('(' + xmlhttp.responseText + ')');
				for(var i = 0; i<  resultAsJson.results.bindings.length; i++) {
					queryProcessor.process(resultAsJson.results.bindings[i]);
				}
				queryProcessor.flush();
			} else {
				// Some kind of error occurred.
					alert("Sparql query error: " + xmlhttp.status + " "
						+ xmlhttp.responseText);
			}
		}	
	};
	xmlhttp.send(querypart);
	return queryProcessor.query;
}

//Request HTTP
function getHTTPObject(){
	var xmlhttp;
	if(!xmlhttp && typeof XMLHttpRequest != 'undefined'){
		try{
			// Code for old browser
			xmlhttp=new ActiveXObject('Msxml2.XMLHTTP');
			}
		catch(err){
			try{
				// Code for IE6, IE5
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(err2){
				try{
					// Code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				}
				catch(err3){
					xmlhttp=false;
				}
			}			
		}
	}
	return xmlhttp;
}