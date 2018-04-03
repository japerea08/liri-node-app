require("dotenv").config();
//imports js file containing keys
var keys = require("./keys.js");


//code for commands app can take:
//"my-tweets" displays last 20 tweets and when they were created in the terminal
if(process.argv[2] === "my-tweets"){
	displayTweets();
}


//"spotify-this-song" <song> user enters in the name of song as an argument
//displays to the terminal: artist(s), song name, preview link, album
else if(process.argv[2] === "spotify-this-song"){
	var song = "";
	for(var i = 3;  i < process.argv.length; i++){
		song += process.argv[i] + " ";
	}
	displaySong(song);
}

//"movie-this" <movie name> displays title of the movie, year, IMBD rating, 
//rotten tomatoes, country where the movie was produced, language, plot, actors
else if(process.argv[2] === "movie-this"){
	var movie = "";
	for(var i = 3; i < process.argv.length; i++){
		if(process.argv.length > 3){
			movie += process.argv[i] + "+";
		}
		else{
			movie += process.argv[i];
		}	 
	}
	displayMovie(movie);
}

else if(process.argv[2] === "do-what-it-says"){
	const fs = require("fs");
	fs.readFile("./random.txt", "utf8", (err, data)=>{
		const query = data.split(",");
		console.log(query);
		if(query[0] === "my-tweets"){
			displayTweets();
		}
		else if(query[0] === "spotify-this-song"){
			displaySong(query[1]);
		}
		else if(query[0] === "movie-this"){
			displayMovie(query[1]);
		}
	});
}

//"do-what-it-says" uses fs package to take text from random.txt and use it to call a command

function displayTweets(){
	const Twitter = require("twitter");
	var client = new Twitter({
		consumer_key: keys.twitter.consumer_key,
		consumer_secret: keys.twitter.consumer_secret,
		access_token_key: keys.twitter.access_token_key,
		access_token_secret: keys.twitter.access_token_secret
	});

	client.get("statuses/user_timeline", {screen_name: "Jperea08", count: 20},(error, tweets, response)=>{
		if(!!error){
			console.log("This is the error: " + error);
		}
		for(var i = 0; i < tweets.length; i++){
		console.log("Tweet " + (i+1) + ": " + tweets[i].text + " Created on " + tweets[i].created_at);
		}
	});
}

function displaySong(song){
	const Spotify = require("node-spotify-api");
	var spotify = new Spotify({
		id: keys.spotify.id,
		secret: keys.spotify.secret
	});

	spotify.search({type: "track", query: song, limit: 1},(err, data)=>{
		if(!!err){
			console.log(err);
			return;
		}
		//console.log(JSON.stringify(data, null, 2));
		var artist = "";
		for(var i = 0; i < data.tracks.items[0].album.artists.length; i++){
			artist += data.tracks.items[0].album.artists[i].name + ", "; 
		}
		console.log("Artist: " + artist);
		console.log("Song Name: " + data.tracks.items[0].name);
		console.log("Preview Link: " + data.tracks.items[0].external_urls.spotify);
		console.log("Album: " + data.tracks.items[0].album.name);
	});

}

function displayMovie(movie){
	const request = require("request");
	var url = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;
	request(url, (error, response, body)=>{
		if(!!error){
			console.log(error);
			return;
		}
		var movieObject = JSON.parse(response.body);
		if(typeof movieObject.Title === "undefined"){
			console.log("Perhaps you mispelled something...");
			return;
		}
		console.log("Title: " + movieObject.Title +"\n");
		console.log("Year: " + movieObject.Year +"\n");
		
		//go through the array of ratings to get IMBD and Rotten Tomatoes
		for(var i = 0; i < movieObject.Ratings.length; i++){
			if(movieObject.Ratings[i].Source === "Internet Movie Database" || movieObject.Ratings[i].Source === "Rotten Tomatoes"){
				console.log(movieObject.Ratings[i].Source + ": " + movieObject.Ratings[i].Value +"\n");
			}
		}
		console.log("Country: " + movieObject.Country +"\n");
		console.log("Language: " + movieObject.Language +"\n");
		console.log("Plot: " + movieObject.Plot +"\n");
		console.log("Actors: " + movieObject.Actors +"\n");
	});
}
//
