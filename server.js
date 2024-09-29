const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const getPath = (grid, start, end) => {
    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [];
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const distance = Array.from({ length: rows }, () => Array(cols).fill(-1));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));

    queue.push(start);
    distance[start[0]][start[1]] = 0;

    while (queue.length > 0) {
        const [x, y] = queue.shift();

        if (x === end[0] && y === end[1]) {
            const path = [];
            let curr = end;

            while (curr) {
                path.unshift(curr);
                curr = parent[curr[0]][curr[1]];
            }
            return path;
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && ny >= 0 && nx < rows && ny < cols && distance[nx][ny] === -1) {
                if (grid[nx][ny] === 0 || grid[nx][ny] === 3) {
                    distance[nx][ny] = distance[x][y] + 1;
                    parent[nx][ny] = [x, y];
                    queue.push([nx, ny]);
                }
                if (grid[x][y] === 2) {
                    for (const [ddx, ddy] of directions) {
                        const ax = x + ddx;
                        const ay = y + ddy;
                        if (ax >= 0 && ay >= 0 && ax < rows && ay < cols && grid[ax][ay] === 1) {
                            grid[ax][ay] = 0;
                        }
                    }
                }
            }
        }
    }

    return [];
};

app.post('/api/find-path', (req, res) => {
    const { grid, start, end } = req.body;

    if (grid[start[0]][start[1]] === 1 || grid[end[0]][end[1]] === 1) {
        return res.json({ path: [] });
    }

    const path = getPath(grid, start, end);
    return res.json({ path });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
