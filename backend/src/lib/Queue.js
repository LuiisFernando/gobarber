import Bee from 'bee-queue';

import CancelationMail from '../app/jobs/CancellationMail';

import redisConfig from '../config/redis';

const jobs = [CancelationMail];

class Queue {
    constructor() {
        this.queues = {};

        this.init();
    }

    init() {
        jobs.forEach(({ key, handle }) => {
            // storing the jobs on variable queue
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig,
                }), // the queue with redis connection
                handle, // method that will process the job
            };
        });
    }

    add(queue, job) {
        return this.queues[queue].bee.createJob(job).save();
    }

    processQueue() {
        // for each job taking bee and handle from queue and process the job
        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key];

            bee.process(handle);
        });
    }
}

export default new Queue();
