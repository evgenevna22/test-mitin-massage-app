import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import './bot'
import slotsRender from './routes/client/slots'
import adminRender from './routes/admin/admin'

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
)
app.use('/slots', slotsRender)
app.use('/admin', adminRender)

app.get('/', (req, res) => {
  res.send('Server is working')
})

// app.post('/webhook', (req, res) => {
//   bot.processUpdate(req.body)
//   res.sendStatus(200)
// })

const PORT = process.env.PORT || 2222
app.listen(PORT, () => {
  console.log(`Server is processing on ${PORT} port`)
})
