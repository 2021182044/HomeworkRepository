const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const port = 3000;

const db = new sqlite3.Database('product.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the product.db database.');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const keyword = req.query.keyword || '';
    const sortOption = req.query.sort || 'rating_desc'; 

    let orderByClause = '';
    switch (sortOption) {
        case 'rating_asc':
            orderByClause = 'ORDER BY movie_rate ASC';
            break;
        case 'release_desc':
            orderByClause = 'ORDER BY movie_release_date DESC';
            break;
        case 'release_asc':
            orderByClause = 'ORDER BY movie_release_date ASC';
            break;
        case 'rating_desc':
        default:
            orderByClause = 'ORDER BY movie_rate DESC';
            break;
    }

    const sql = `SELECT * FROM movies WHERE movie_title LIKE ? ${orderByClause}`;
    const params = [`%${keyword}%`];

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.render('index', { movies: rows, keyword: keyword, sortOption: sortOption });
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});
app.get('/movies/:movie_id', (req, res) => {
    const movieId = req.params.movie_id;
    const sql = `SELECT * FROM movies WHERE movie_id = ?`;

    db.get(sql, [movieId], (err, movie) => {
        if (err) {
            res.status(500).send("Database error");
            return console.error(err.message);
        }
        if (!movie) {
            return res.status(404).send("Movie not found");
        }
        fs.readFile('comment.json', 'utf8', (err, data) => {
            if (err) {
                 res.status(500).send("Error reading comments");
                 return console.error(err);
            }
            const allComments = JSON.parse(data);
            const movieComments = allComments[movieId] || [];
            res.render('movie_detail', { movie: movie, comments: movieComments });
        });
    });
});


app.post('/movies/:movie_id/comment', (req, res) => {
    const movieId = req.params.movie_id;
    const newComment = req.body.comment;
    
    console.log('--- 후기 등록 요청 시작 ---');
    console.log('영화 ID:', movieId);
    console.log('새로운 후기 내용:', newComment);

    if (!newComment || newComment.trim() === '') {
        console.log('후기 내용이 비어있어 리다이렉트합니다.');
        return res.redirect(`/movies/${movieId}`);
    }

    const commentFilePath = path.join(__dirname, 'comment.json');
    console.log('comment.json 파일 경로:', commentFilePath);

    fs.readFile(commentFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일 읽기 실패:', err);
            return res.status(500).send("Error reading comments file.");
        }
        console.log('1. 파일 읽기 성공.');

        let allComments;
        try {
            allComments = JSON.parse(data);
            console.log('2. JSON 파싱 성공.');
        } catch (parseErr) {
            console.error('JSON 파싱 실패:', parseErr);
            return res.status(500).send("Failed to parse comment.json. The file might be corrupted.");
        }

        if (!allComments[movieId]) {
            allComments[movieId] = [];
        }
        allComments[movieId].push(newComment);
        console.log('3. 새로운 후기 메모리에 추가 완료.');

        fs.writeFile(commentFilePath, JSON.stringify(allComments, null, 2), (err) => {
            if (err) {
                console.error('파일 쓰기 실패:', err);
                return res.status(500).send("Error writing comments file.");
            }
            console.log('4. 파일 쓰기 성공! comment.json 업데이트 완료.');
            
            // 후기 추가 후 상세 페이지로 리다이렉트
            console.log('5. 상세 페이지로 리다이렉트합니다.');
            console.log('--- 후기 등록 요청 종료 ---');
            res.redirect(`/movies/${movieId}`);
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});