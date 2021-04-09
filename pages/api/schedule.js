import { firebaseServer } from '../../config/firebase/server'
import { addHours, differenceInHours } from 'date-fns'
import format from 'date-fns/format'

const database = firebaseServer.firestore()
const profile = database.collection('profile')
const agenda = database.collection('agenda')

const startAt = new Date(2021, 1, 1, 8, 0)
const endAt = new Date(2021, 1, 1, 17, 0)
const totalHours = differenceInHours(endAt, startAt)

const timeBlocks = []

for(let blockIndex = 0; blockIndex <= totalHours; blockIndex++) {
  const time = format(addHours(startAt, blockIndex), 'HH:mm')
  timeBlocks.push(time)
}

export default async (req, res) => {
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