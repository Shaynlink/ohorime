require('dotenv').config();
/**
 * this file is a worker, is must be launched with a main worker
 */
const { parentPort } = require('node:worker_threads');
const { EXPERIENCES_WORKER_TYPE } = require('../utils/constant');
const { MongoClient } = require('mongodb');

const mongo = new MongoClient(process.env.MONGODB_URI);
const db = mongo.db('ohorime');

console.log('[WORKER] 📶 Client trying connect to mongodb');

// Schedule Database operation to avoid operation overload
const operationToSchedule = new Set();

mongo.connect()
    .then(() => {
        console.log('[WORKER] ✅ Mongodb connected');
        db.command({ ping: 1 })
            .then((cmd) => {
                console.log('[WORKER] ✅ Database ping successfull');
                if (cmd.ok == 1) {
                    const collection = db.collection('experiences');

                    setInterval(() => {
                        if (operationToSchedule.size == 0) return;

                        console.log('[WORKER] 💾 %s operations to write', operationToSchedule.size);

                        const operations = [...operationToSchedule.values()];
                        operationToSchedule.clear();
                    
                        collection.bulkWrite(operations);
                    }, 1000);

                    parentPort.on('message', async (messageMainWorker) => {
                        const [type, ...args] = messageMainWorker;
                    
                        if (type == EXPERIENCES_WORKER_TYPE.messageCreate) {
                            const [userId, guildId, content] = args
                            const experience = await getOrCreateExperience(collection, userId, guildId);
                            const update = {
                                updateOne: {
                                    filter: { _id: experience._id },
                                    update: { $inc: { experiences: calculateMessageExperience(content) } },
                                    upsert: false
                                },
                            };

                            operationToSchedule.add(update);
                        }
                    });
                } else {
                    console.log('[WORKER] ❌ Database ping failed');
                    throw Error(cmd);
                }
            })
            .catch((e) => {
                console.log('[WORKER] ❌ Database ping failed');
                throw Error(e);
            })

    })
    .catch((e) => {
        console.log('[WORKER] ❌ Mongodb connection failed');
        throw Error(e);
    })

async function getOrCreateExperience(collection, userId, guildId) {
    const experience = await collection.findOne({ userId, guildId });
    if (!experience) {
        const newExperience = { userId, guildId, experiences: 0 };
        const insert = await collection.insertOne(newExperience);
        newExperience._id = insert.insertedId;
        return newExperience;
    };

    return experience;
}

function calculateMessageExperience(content) {
    let point = 1;
    point += content.length * 0.25;
    return point;
}