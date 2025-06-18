const sqlite3 = require('sqlite3').verbose();


const moviesData = [
    { title: "Toy Story", release_date: "1995-10-30", vote_average: 7.7, image: "https://i.ebayimg.com/00/s/MTYwMFgxMDgy/z/MewAAOSwE0ZaqT7H/$_57.JPG?set_id=8800005007", overview: "Led by Woody, Andy's toys live happily in his room until Andy's birthday brings Buzz Lightyear onto the scene. Afraid of losing his place in Andy's heart, Woody plots against Buzz. But when circumstances separate Buzz and Woody from their owner, the duo eventually learns to put aside their differences." },
    { title: "Jumanji", release_date: "1995-12-15", vote_average: 6.9, image: "https://m.media-amazon.com/images/M/MV5BYTFkMjFmODgtYzRiZi00NmQwLTliZWMtMzRhMWQ5ZmY3ZDExXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", overview: "When two kids find and play a magical board game, they release a man trapped for decades in it and a host of dangers that can only be stopped by finishing the game." },
    { title: "Grumpier Old Men", release_date: "1995-12-22", vote_average: 6.5, image: "https://i.ebayimg.com/images/g/zdwAAOSw8gVX~i4D/s-l640.jpg", overview: "A family wedding reignites the ancient feud between next-door neighbors and fishing buddies John and Max. Meanwhile, a sultry Italian divorcée opens a restaurant at the local bait shop, alarming the locals who worry she'll scare the fish away." },
    { title: "Waiting to Exhale", release_date: "1995-12-22", vote_average: 6.1, image: "https://m.media-amazon.com/images/M/MV5BZWU4NzA3MDQtODYyOS00OTliLTk3MGEtYzM2ZjNkZmI5ODk5XkEyXkFqcGc@._V1_.jpg", overview: "Based on Terry McMillan's novel, this film follows four very different African-American women and their relationships with men." },
    { title: "Father of the Bride Part II", release_date: "1995-02-10", vote_average: 5.7, image: "https://m.media-amazon.com/images/M/MV5BOTMwNzE2Y2YtNzZhMy00YTljLWI1MzQtMTI3YjkxYTg2NjRmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", overview: "Just when George Banks has recovered from his daughter's wedding, he receives the news that she's pregnant ... and that George's wife, Nina, is expecting too. He was planning on selling their home, but that's all changed now." },
    { title: "Heat", release_date: "1995-12-15", vote_average: 7.7, image: "https://m.media-amazon.com/images/M/MV5BMTkxYjU1OTMtYWViZC00ZjAzLWI3MDktZGQ2N2VmMjVjNDRlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", overview: "Obsessive master thief Neil McCauley leads a top-notch crew on various daring heists throughout Los Angeles while determined detective Vincent Hanna pursues him without rest. Each man recognizes and respects the ability and dedication of the other even though they are on opposite sides of the law." },
    { title: "Sabrina", release_date: "1995-12-15", vote_average: 6.2, image: "https://m.media-amazon.com/images/M/MV5BNGZiMmM3YjEtZmQ3Zi00OTQxLTk5MGQtOTBhMDM1MWVkNzFmXkEyXkFqcGc@._V1_.jpg", overview: "An ugly duckling having undergone a remarkable change, still harbors feelings for her crush: a carefree playboy, but not before his business-focused brother has something to say about it." },
    { title: "Tom and Huck", release_date: "1995-12-22", vote_average: 5.4, image: "https://m.media-amazon.com/images/M/MV5BMDA3MmZjYmItOTc4MS00ZDhhLTg1NTQtZmVlMzFiNTAyYjdhXkEyXkFqcGc@._V1_.jpg", overview: "A mischievous young boy, Tom Sawyer, witnesses a murder by the vicious Injun Joe. Tom becomes a target of Injun Joe's murderous wrath." },
    { title: "Sudden Death", release_date: "1995-12-22", vote_average: 5.5, image: "https://m.media-amazon.com/images/M/MV5BZmUwYmQ1MGYtNDk4MC00YjkyLTg2YTktZmE3NmZkZDY2MGE1XkEyXkFqcGc@._V1_.jpg", overview: "A former fireman takes on a group of terrorists holding the Vice President and others hostage during the seventh game of the NHL Stanley Cup finals." },
    { title: "GoldenEye", release_date: "1995-11-16", vote_average: 6.6, image: "https://m.media-amazon.com/images/M/MV5BOGQxNmYyY2YtZGIyNy00ODgxLThhZWEtZGIyNjJhYzFlOTllXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", overview: "James Bond must stop a catastrophic crime syndicate from using a satellite weapon against London." },
    { title: "The American President", release_date: "1995-11-17", vote_average: 6.5, image: "https://upload.wikimedia.org/wikipedia/en/f/f2/The_American_President_%28movie_poster%29.jpg", overview: "Comedy-drama about a widowed U.S. president and a lobbyist who fall in love. It's all above-board, but politics is a tricky business." },
    { title: "Dracula: Dead and Loving It", release_date: "1995-12-22", vote_average: 5.7, image: "https://m.media-amazon.com/images/M/MV5BN2I2MjQzYTgtZWU5ZS00ZGZmLWFhNmQtNjVlODE0OTM4Y2JhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", overview: "Mel Brooks' parody of the classic Dracula story." },
    { title: "Balto", release_date: "1995-12-22", vote_average: 7.1, image: "https://m.media-amazon.com/images/M/MV5BNzY2OGY3MTYtMTlhNC00MDUyLWE2OGEtNzMzZjQxYjFiYjRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", overview: "An outcast half-wolf risks his life to prevent a deadly epidemic from ravaging Nome, Alaska." },
    { title: "Nixon", release_date: "1995-12-22", vote_average: 7.1, image: "https://m.media-amazon.com/images/M/MV5BNDk3YWU1NmEtMDBhMC00ZGYwLWFiNzQtMzkwMzg4YjA4MDY4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", overview: "A biographical story of former U.S. President Richard Nixon, from his days as a young boy to his eventual corruption and downfall." },
    { title: "Cutthroat Island", release_date: "1995-12-22", vote_average: 5.7, image: "https://m.media-amazon.com/images/M/MV5BZTQ3OWY2NTctOTAyNS00MThjLTgyZjEtNzgzZGNiZDNhODUyXkEyXkFqcGc@._V1_.jpg", overview: "A female pirate and her companion race against their rivals to find a hidden island that contains a fabulous treasure." },
    { title: "Casino", release_date: "1995-11-22", vote_average: 7.8, image: "https://m.media-amazon.com/images/M/MV5BMDRlZWZjZjYtYzY2NS00ZWVjLTkwYzAtZTA2ZDAzMGRiYmYwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", overview: "A tale of greed, deception, money, power, and murder occur between two best friends: a mafia enforcer and a casino executive, compete against each other over a gambling empire, and over a fast-living and self-absorbed socialite." },
    { title: "Sense and Sensibility", release_date: "1995-12-13", vote_average: 7.2, image: "https://m.media-amazon.com/images/M/MV5BY2MyZWJhNjktMWQ2My00OTgwLWI1NjEtYjUzM2M2N2M4Mzc4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", overview: "Rich Mr. Dashwood dies, leaving his second wife and her three daughters poor by the rules of inheritance. The two eldest daughters are the titular opposites." },
    { title: "Four Rooms", release_date: "1995-12-09", vote_average: 6.5, image: "https://m.media-amazon.com/images/M/MV5BMmNlMjE5YTEtZTU1My00MDc1LTgwNzctNTZlYmJmNTM3ZjYzXkEyXkFqcGc@._V1_.jpg", overview: "It's Ted the Bellhop's first night on the job...and the hotel's very unusual guests are about to place him in some outrageous predicaments. It's a wild night for Ted, who's wrapped up in a bizarre world of sex, mystery, and intrigue." },
    { title: "Ace Ventura: When Nature Calls", release_date: "1995-11-10", vote_average: 6.1, image: "https://m.media-amazon.com/images/M/MV5BMjk3ZDUwYTMtYmQyYy00NTg1LWExOTItNTcxODM3NDZiNjMyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", overview: "Ace Ventura, Pet Detective, returns from a spiritual quest to investigate the disappearance of a rare white bat, the sacred animal of a tribe in Africa." },
    { title: "Money Train", release_date: "1995-11-21", vote_average: 5.4, image: "https://m.media-amazon.com/images/M/MV5BZGIzODJmMGYtMzY2My00ZGJkLTg1YzMtNmY2ZTVlYmI5YzYyXkEyXkFqcGc@._V1_.jpg", overview: "A vengeful New York transit cop decides to steal a trainload of subway fares. His foster brother, a fellow cop, tries to protect him." }
];


const db = new sqlite3.Database('./product.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the product.db database.');
});

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS movies`, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Table 'movies' is dropped.");
    });
    const createTableSql = `
        CREATE TABLE movies (
            movie_id INTEGER PRIMARY KEY AUTOINCREMENT,
            movie_image TEXT,
            movie_title TEXT NOT NULL,
            movie_overview TEXT,
            movie_release_date TEXT,
            movie_rate REAL
        )
    `;
    db.run(createTableSql, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Table 'movies' created successfully.");
    });

    const insertSql = `INSERT INTO movies (movie_title, movie_release_date, movie_rate, movie_image, movie_overview) VALUES (?, ?, ?, ?, ?)`;
    moviesData.forEach((movie) => {
        db.run(insertSql, [movie.title, movie.release_date, movie.vote_average, movie.image, movie.overview], (err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    });
    console.log(`${moviesData.length} records inserted into 'movies' table.`);

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
    });
});