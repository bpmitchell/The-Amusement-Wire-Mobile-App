//EDIT THESE LINES
//Title of the blog
var TITLE = "";
//RSS url
var RSS = "http://feeds.feedburner.com/AmusementWire";
//Stores entries
var entries = [];
var selectedEntry = "";

//listen for detail links
$(".contentLink").live("click", function() {
    selectedEntry = $(this).data("entryid");
});

function renderEntries(entries) {
var s = '';
$.each(entries, function(i, v) {
s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + '<div class="navtit"><h2>' + v.title + '</h2></div>' + '<div class="small">'+ v.pubDate + '</div>' + '</a></li>'
;});
$("#linksList").html(s);
$("#linksList").listview("refresh");        
}

//Listen for main page
$("#mainPage").live("pageinit", function() {
    //Set the title
    $("h1", this).text(TITLE);    
    $.ajax({
        url:RSS,
        success:function(res,code) {
            entries = [];
            var xml = $(res);
            var items = xml.find("item");
            $.each(items, function(i, v) {
            
            var ray = $(v).find("media:thumbnail");
                console.log(ray);
                
                entry = { 
                    title:$(v).find("title").text(), 
                    link:$(v).find("link").text(), 
                    pubDate:$(v).find("pubDate").text(),
                    ray:$(v).find("media:thumbnail").text(),
                    description:$.trim($(v).find("description").text())
                   
                    };
                    
                entries.push(entry);
                
            });
            //store entries
            localStorage["entries"] = JSON.stringify(entries);
            renderEntries(entries);
            
        },
        error:function(jqXHR,status,error) {
            //try to use cache
            if(localStorage["entries"]) {
                $("#status").html("Using cached version...");
                entries = JSON.parse(localStorage["entries"])
                renderEntries(entries);                
            } else {
                $("#status").html("Sorry, we are unable to get the RSS and there is no cache.");
            }
        }
    });
    
});

$("#mainPage").live("pagebeforeshow", function(event,data) {
    if(data.prevPage.length) {
        $("h1", data.prevPage).text("");
        $("#entryText", data.prevPage).html("");
    };
});

//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
    //Set the title
    var contentHTML = "";
    contentHTML += '<div class="bg-txt-s">';
    contentHTML += '<h3>'+ entries[selectedEntry].title + '</h3>';
    contentHTML += '<h4>' + entries[selectedEntry].pubDate + '</h4>';
    contentHTML += entries[selectedEntry].description;
    $("#entryText",this).html(contentHTML);
});
	