import { firebaseServer } from '../../config/firebase/server'
import { addHours, differenceInHours } from 'date-fns'
import format from 'date-fns/format'

const database = firebaseServer.firestore()
const profile = database.collection('profiles')
const agenda = database.collection('agenda')

const startAt = new Date(2021, 1, 1, 8, 0)
const endAt = new Date(2021, 1, 1, 17, 0)
const totalHours = differenceInHours(endAt, startAt)

const timeBlocks = []

for(let blockIndex = 0; blockIndex <= totalHours; blockIndex++) {
  const time = format(addHours(startAt, blockIndex), 'HH:mm')
  timeBlocks.push(time)
}

const getUserId = async (username) => {
  const profileDoc = await profile
        .where('username', '==', username)
        .get()

  const { userId } = profileDoc.docs[0].data()
  return userId
}

const methods = {
  POST: async (req, res) => {
    const userId = await getUserId(req.body.username)
    const docId = `${userId}#${req.body.date}#${req.body.time}`
    const doc = await agenda.doc(docId).get()

    if (doc.exists) {
        return res.status(400).json({ message: 'Time blocked! '})
    }

    const block = await agenda.doc(docId).set({
        userId,
        date: req.body.date,
        time: req.body.time,
        name: req.body.name,
        phone: req.body.phone,
    })

    return res.status(200).json(block)
  },
  GET: async (req, res) => {
    console.log(req.query.when)
    try {
      // const profileDocs = await profile
      //   .where('username', '==', req.query.username)
      //   .get()
      // const snapshot = await agenda
      //   .where('userId', '==', profileDocs.user_id)
      //   .where('when', '==', req.query.when)
      //   .get()
    
      return res.status(200).json(timeBlocks)
  
    } catch (error) {
      console.log('FB ERROR:', error)
      return res.status(401)
    }
  }
}

export default async (req, res) => 
  methods[req.method]
  ? methods[req.method](req,res) 
  : res.status(405)