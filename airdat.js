jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}
// Data layer
// "old school" JS Objects -- done on-purpose
function AB(callback){
	that=this;
	RUN_MODE="LOCAL"; // other option is LIVE
	API_KEY="";
	APP_ID="appQTNunJetOT3r1B";
	BLOGID="recCGKQBlTWHqrGCu"
	PAGE_SIZE="99"; // 99 is max. After that you gotta add paging code
	atEntries={};
	atTags={};
	atCategories={};
	atMedia={};
	atBlogs={};
	atMyBlog={};
	atMyEntry={};
	atAuthors={};

	md = window.markdownit({
		  html:         true,        // Enable HTML tags in source
		  linkify:      true,        // Autoconvert URL-like text to links
		  typographer:  true
	});


	$.when(getAirTableData("Entries"), getAirTableData("Tags"), getAirTableData("Categories"), getAirTableData("Media"), getAirTableData("Blogs"), getAirTableData("Authors")).done(function(a1, a2, a3, a4, a5, a6){
	    // the code here will be executed when all four ajax requests resolve.
	    // a1, a2, a3 and a4 are lists of length 3 containing the response text,
	    // status, and jqXHR object for each of the four ajax calls respectively.
		// (Inside JQuery we switch contexts. Yet again.... so we use 'that')
		that.atEntries=a1[0];
		that.atTags=a2[0];
		that.atCategories=a3[0];
		that.atMedia=a4[0];
		that.atBlogs=a5[0];
		that.atAuthors=a6[0];
		that.atMyBlog=that.atBlogs.records.find(that.isMyBlog);
		that.atMyEntry=that.atEntries.records.find(that.isMyEntry);

		// set up any tracking/analytics
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', that.atMyBlog.fields['GA-Number']);
		var scriptUrl='https://www.googletagmanager.com/gtag/js?id='+that.atMyBlog.fields['GA-Number'];
		$.loadScript(scriptUrl, function(){});

		// resume whatever the page wants to do
		callback(that);
	});	

	function getAirTableData(tableName) {
		var qry="https://api.airtable.com/v0/" + APP_ID + "/" + tableName + "?maxRecords=" + PAGE_SIZE + "&view=Grid%20view&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved})&api_key=" + API_KEY;
		if (RUN_MODE==="LIVE") {
			return $.getJSON( "https://api.airtable.com/v0/" + APP_ID + "/" + tableName + "?maxRecords=" + PAGE_SIZE + "&view=Grid%20view&filterByFormula=AND(IS_AFTER(NOW(),{StartDate}),{Approved})&api_key=" + API_KEY, function( dat ){});
		}
		else { return $.getJSON( tableName + ".json", function( dat ){});}
	}

	this.GetIDFromQS = function() {
		var wl=window.location.href.toString();
		var lastSlash=wl.lastIndexOf("/");
		var endOfURI=wl.substring(lastSlash+1);
		var equalsLoc=endOfURI.indexOf("=");
		return endOfURI.substring(equalsLoc+1);
	}
			
	this.SelectedEntry = function() {
		this.atEntries.records.find(this.isMyEntry);
	}

	this.isMyEntry=function(entry){
		return entry.id === that.GetIDFromQS();
	}
	this.isMyBlog=function(blog){
		return blog.id === BLOGID;
	}
	this.findMediaItemForAName=function(mediaItemList, name){
		return mediaItemList.filter(
			(function(mediaItem){return mediaItem.fields.Name===name;}));
		};
	this.filterMediaItemListToThoseThatContainThisEntry=function(mediaItemList, entry){
		return this.atMedia.records.filter(this.mediaItemReferencesThisEntry);
	}
	this.mediaItemReferencesThisEntry=function(mediaItem){
		return mediaItem.fields.Entries.includes(that.GetIDFromQS());
	}

	this.LookupAuthors=function(authorIdArray){
		var myList=this.atAuthors.records;
		var ret=myList.filter(
			function(e) {
				return this.indexOf(e)<0;
				},authorIdArray
			);
		return ret;
	}
}