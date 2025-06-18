// index.js

const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const port = 3000;

// 데이터베이스 연결
const db = new sqlite3.Database('product.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the product.db database.');
});

// EJS를 뷰 엔진으로 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일(css, js, images) 제공 설정
app.use(express.static(path.join(__dirname, 'public')));
// POST 요청의 body를 파싱하기 위한 미들웨어
app.use(express.urlencoded({ extended: true }));


// 라우팅 (Routing)

// 1. 메인 페이지: 영화 목록 표시 
app.get('/', (req, res) => {
    // 키워드 검색 및 필터링 쿼리 
    const keyword = req.query.keyword || '';
    const category = req.query.category || 'movie_title'; // 기본 필터: 제목
    
    // SQL 쿼리 작성 (키워드가 포함된 영화 검색)
    const sql = `SELECT * FROM movies WHERE ${category} LIKE ? ORDER BY movie_rate DESC`;
    const params = [`%${keyword}%`];

    db.all(sql, params, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('index', { movies: rows, keyword: keyword, category: category });
    });
});

// 2. 로그인 페이지 
app.get('/login', (req, res) => {
    res.render('login');
});

// 3. 회원가입 페이지 
app.get('/signup', (req, res) => {
    res.render('signup');
});

// 4. 영화 상세 정보 페이지 
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

        // 후기 정보 불러오기 (File I/O) 
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

// 5. 새로운 후기 추가 처리 
app.post('/movies/:movie_id/comment', (req, res) => {
    const movieId = req.params.movie_id;
    const newComment = req.body.comment;

    if (!newComment) {
        return res.redirect(`/movies/${movieId}`);
    }

    fs.readFile('comment.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading comments file.");
        }

        const allComments = JSON.parse(data);
        if (!allComments[movieId]) {
            allComments[movieId] = [];
        }
        allComments[movieId].push(newComment);

        fs.writeFile('comment.json', JSON.stringify(allComments, null, 2), (err) => {
            if (err) {
                return res.status(500).send("Error writing comments file.");
            }
            // 후기 추가 후 상세 페이지로 리다이렉트
            res.redirect(`/movies/${movieId}`);
        });
    });
});


// 서버 실행
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});