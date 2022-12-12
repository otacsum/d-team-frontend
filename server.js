let express = require('express');

let app = express();

app.use(express.static(__dirname+'/dist/d-team-frontend'));

app.get('/*', (req, resp) => {
    resp.sendFile(__dirname+'/dist/d-team-frontend/index.html');
});

app.listen(process.env.PORT || 8081);
