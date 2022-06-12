const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.status(200).send('Hello World!') // başarılı statusunu yollar
})

const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
