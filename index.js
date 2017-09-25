
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api')
var fs = require('fs');
var keys = require('./keys.js');
var twitClient = new Twitter(keys[0]);

var action = process.argv[2];
var songMovieInput = process.argv[3];

var spotID = '1bcb09b178f347279f2f4e13011ac2df';
var spotSec = 'fa55cf83b9744e0c989ccda6d0311083';

var myTweets = function() {
  twitClient.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=JustHot8&count=20', {q: 'node.js'}, function(err, tweets, response) {
    if(!err && response.statusCode === 200) {

      fs.appendFile('log.txt','\r\n' + 'Command: my-tweets' + '\r\n', function(err) {
        if (err) {
          return console.log(err);
        } 
      });

      for(i=0; i<tweets.length; i++) {
        console.log('Tweet ' + (i+1) + ': ' + tweets[i].text);

        fs.appendFile('log.txt', (i+1) + ') ' + tweets[i].text + '\r\n', function(err) {
          if (err) {
            return console.log(err);
          } 
        });
      }
      
    } else {
      return console.log(err);
    }
  });
};

var spotifyThisSong = function(songMovieInput) {

  var spotify = new Spotify({
    id: spotKeys.spotID,
    secret: spotKeys.spotSec
  });

  spotify.search({type: 'track', query: songMovieInput}, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } else {
      console.log('Artist: ' + data.tracks.items[0].artists[0].name); 
      console.log('Track: ' + data.tracks.items[0].name);
      console.log('Preview URL: ' + data.tracks.items[0].preview_url);
      console.log('Album: ' + data.tracks.items[0].album.name);
      fs.appendFile('log.txt', '\r\n' + 'Command: spotify-this-song' + '\r\n' + 'Artist: ' + data.tracks.items[0].artists[0].name + '\r\n' + 'Track: ' + data.tracks.items[0].name + '\r\n' + 'Preview URL: ' + data.tracks.items[0].preview_url + '\r\n' + 'Album: ' + data.tracks.items[0].album.name + '\r\n', function(err) {
        if (err) {
          return console.log(err);
        } 
      });
    }
  });
};

var movieThis = function(songMovieInput) {
  request('http://www.omdbapi.com/?i=tt3896198&apikey=cbe83329&t=' + songMovieInput, function(err, response, body) {
    if (!err && response.statusCode === 200) {
      var movieData = (JSON.parse(body));
      console.log('Title: ' + movieData.Title);
      console.log('Year: ' + movieData.Year);
      console.log('IMDB Rating: ' + movieData.imdbRating);
      console.log('Rotten Tomatoes Rating: ' + movieData.Ratings[1].Value);
      console.log('Country of Production: ' + movieData.Country);
      console.log('Languages Offered: ' + movieData.Language);
      console.log('Plot Synopsis: ' + movieData.Plot);
      console.log('Actors: ' + movieData.Actors);

      fs.appendFile('log.txt', '\r\n' + 'Command: movie-this' + '\r\n' + 'Title: ' + movieData.Title + '\r\n' + 'Year: ' + movieData.Year + '\r\n' + 'IMDB Rating: ' + movieData.imdbRating + '\r\n' + 'Rotten Tomatoes Rating: ' + movieData.Ratings[1].Value +  '\r\n' + 'Country of Production: ' + movieData.Country + '\r\n' + 'Languages Offered: ' + movieData.Language + '\r\n' + 'Plot Synopsis: ' + movieData.Plot + '\r\n' +'Actors: ' + movieData.Actors + '\r\n', function(err) {
        if (err) {
          return console.log(err);
        } else {
        console.log("movies.txt was updated!");
        }
      });
      
    } else {
      console.log(err);
      console.log(response.statusCode);
    }
  });
};

var doWhatItSays = function() {
  fs.readFile('random.txt', 'utf8', function(err, data) {
    var txtData = data.split(",");
    action = txtData[0];
    songMovieInput = txtData[1];
    if (err) {
      console.log(err);
      throw err;
    } else {
      if(action === 'do-what-it-says') {
        return console.log('Please stop trying to crash!');
      } else if(action === 'my-tweets') {
        myTweets();
      } else if((action === 'spotify-this-song' || action === 'movie-this') && songMovieInput) {
        songMovieInput = txtData[1].replace(/["]+/g, '');
        liriBot(action, songMovieInput);
      }
    }
  });
};

//Movies and songs must be typed using hyphens to separate words.

var liriBot = function(action, songMovieInput) { 
  if(!action || (action !== 'spotify-this-song' && action !== 'movie-this' && action !== 'do-what-it-says' && action !== 'my-tweets')) {
    console.log('Please Enter a Valid Action: my-tweets, spotify-this-song, movie-this or do-what-it-says');
  } else if(action === 'spotify-this-song' && !songMovieInput) {
    spotifyThisSong('The Sign');
  } else if(action === 'movie-this' && !songMovieInput) {
    movieThis('Mr.Nobody');
  } else if(action === 'spotify-this-song' && songMovieInput) {
    spotifyThisSong(songMovieInput);
  } else if(action === 'movie-this' && songMovieInput) {
    movieThis(songMovieInput);
  } else if(action === 'my-tweets') {
    myTweets();
  } else if(action === 'do-what-it-says'){
    doWhatItSays();
  } else {
    return;
  }  
};

liriBot(action, songMovieInput);


