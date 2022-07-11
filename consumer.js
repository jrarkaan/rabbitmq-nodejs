const amqp = require('amqplib');

amqp.connect('amqp://localhost')
    .then((conn)=>{
        return conn.createChannel().then((ch)=>{
            // declaration queue
            const queue1 = ch.assertQueue('queue1', { durable: false });
            if(queue1){
                queue1
                    .then(()=>{
                        // menangkap pesan yang dikirimkan oleh RabbitMQ
                        return ch.consume('queue1', msg => console.log('- Received', msg.content.toString()), { noAck: true } );
                    })
                    .then(()=>{
                        console.log('* Waiting for messages. Ctrl+C to exit')
                    })
            }// end if
            const queue2 = ch.assertQueue('queue2', { durable: false });
            if(queue2){
                queue2
                    .then(()=>{
                        /* Menangkap pesan yang dikirimkan oleh RabbitMQ */
                        return ch.consume('queue2', msg => {
                            let json_data = JSON.parse(msg.content.toString());
                            console.log(json_data)
                            console.log(`His name is ${json_data.name}` );
                            console.log(`His Job is ${json_data.job}`);
                        }, { noAck: true })
                    })
                    .then(()=>{
                        console.log('* Waiting for messages. Ctrl+C to exit')
                    })
            }
        });
    })
    .catch(console.warn)